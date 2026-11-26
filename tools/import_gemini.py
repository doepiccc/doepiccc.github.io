"""Cut Gemini renders from gemini-raw/ into the light low-poly scene set the site uses.

Usage:  python tools/import_gemini.py       (needs Pillow, numpy, scipy)
Reads   gemini-raw/<name>.(png|jpg|webp)
Writes  public/img/lp/*.webp
Missing files are skipped, so layers can be added one by one. Prompts: docs/gemini/PROMPTS.md

  core-lp                       black background, turned into transparency     -> core.webp
  hills-lp                      green chroma key                             -> hills.webp
  city-far-lp, city-near-lp     green chroma key                             -> city-far.webp, city-near.webp
  shore-lp-<season>             magenta chroma key, 4 seasons                -> shore-<season>.webp
  soon-lp                       opaque art for the "coming soon" card        -> soon.webp
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "gemini-raw"
OUT = ROOT / "public" / "img" / "lp"
SEASONS = ("spring", "summer", "autumn", "winter")
# target widths: enough for a 1440 px screen at the scale the page uses, nothing more
W_SHORE, W_CITY, W_HILLS, W_CORE, W_SOON = 1500, 1440, 1400, 640, 960


def load(name):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = RAW / (name + ext)
        if p.exists():
            return Image.open(p).convert("RGB")
    print(f"skip  {name} (not found)")
    return None


def fit(im, width):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    return im


def save(im, name, quality=80):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.webp"
    im.save(path, "WEBP", quality=quality, method=6, alpha_quality=85)
    print(f"write {path.relative_to(ROOT)}  {im.size}  {path.stat().st_size // 1024} KB")


def key_out(im):
    """Remove a flat green or magenta background without a coloured halo.
    1. key colour = median of the top corners; alpha from the colour distance;
    2. edge colours are un-mixed from the key and the key tint is limited near the edges;
    3. semi-transparent pixels take the colour of the nearest solid pixel;
    4. the matte is eroded a little and softened, then empty rows above/below are cropped."""
    a = np.asarray(im).astype(np.float32)
    corners = np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3)])
    key = np.median(corners, axis=0)
    green = key[1] > key[0]
    d = np.linalg.norm(a - key, axis=2)
    a0 = np.clip((d - 60) / 80, 0, 1)
    a0 = a0 * a0 * (3 - 2 * a0)
    safe = np.maximum(a0, 1e-3)[..., None]
    rgb = np.clip((a - (1 - a0)[..., None] * key) / safe, 0, 255)
    near = ndimage.minimum_filter(a0, size=7) < 0.9
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    if green:
        rgb[..., 1] = np.where(near, np.minimum(g, np.maximum(r, b) + 6), g)
    else:
        spill = np.where(near, np.clip(np.minimum(r, b) - g - 6, 0, None), 0)
        rgb[..., 0] = r - spill
        rgb[..., 2] = b - spill
    solid = (a0 > 0.92) & ~(ndimage.minimum_filter(a0, size=3) < 0.5)
    idx = ndimage.distance_transform_edt(~solid, return_distances=False, return_indices=True)
    filled = rgb[idx[0], idx[1]]
    wr = np.clip((1 - a0) * 1.8, 0, 1)[..., None] * (~solid)[..., None]
    rgb = np.clip(rgb * (1 - wr) + filled * wr, 0, 255)
    alpha = ndimage.minimum_filter(a0, size=3)
    alpha = ndimage.gaussian_filter(alpha, 0.6)
    alpha = np.clip((alpha - 0.12) / 0.88, 0, 1)
    rgb[alpha == 0] = 0
    out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), "RGBA")
    # rows that are mostly empty are noise (stray key pixels) and must not set the baseline
    rows = np.where((alpha > 0.5).sum(axis=1) > out.width * 0.004)[0]
    if rows.size:
        out = out.crop((0, int(rows[0]), out.width, int(rows[-1]) + 1))
    return out


def lift_from_black(im):
    """Turn the black background into transparency, so the core also works on a light sky.
    Alpha follows the brightest channel: objects stay opaque, the faint glow fades out."""
    a = np.asarray(im).astype(np.float32)
    peak = np.clip(a.max(axis=2) - 9, 0, None)
    alpha = np.clip(peak / 105, 0, 1)
    rgb = np.clip(a / np.maximum(alpha, 0.05)[..., None], 0, 255)
    rgb = np.where((alpha > 0.999)[..., None], a, np.minimum(rgb, a * 2.4))
    rgb[alpha == 0] = 0
    return Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), "RGBA")


def main():
    if (im := load("core-lp")):
        save(lift_from_black(fit(im, W_CORE)), "core", 82)
    for name, width in (("hills", W_HILLS), ("city-far", W_CITY), ("city-near", W_CITY)):
        if (im := load(f"{name}-lp")):
            save(key_out(fit(im, width)), name)
    for s in SEASONS:
        if (im := load(f"shore-lp-{s}")):
            cut = key_out(fit(im, W_SHORE))
            # the strip repeats sideways: trim the rounded ends of the bank so no notch shows at the seams
            trim = round(cut.width * 0.035)
            save(cut.crop((trim, 0, cut.width - trim, cut.height)), f"shore-{s}")
    if (im := load("soon-lp")):
        save(fit(im, W_SOON), "soon", 82)
    total = sum(p.stat().st_size for p in OUT.glob("*.webp")) if OUT.exists() else 0
    print(f"public/img/lp total: {total // 1024} KB")


if __name__ == "__main__":
    main()
