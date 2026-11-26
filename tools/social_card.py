"""Compose the 1200x630 link preview (public/social.jpg) from the scene layers.

Usage:  python tools/social_card.py       (needs Pillow and the Segoe UI fonts of Windows)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
LP = ROOT / "public" / "img" / "lp"
W, H, HORIZON = 1200, 630, 520
SKY = [(0, "#121127"), (0.25, "#2a2662"), (0.5, "#355281"), (0.68, "#408898"), (0.83, "#57bd91"), (0.93, "#a4d969"), (1, "#f0eb88")]


def rgb(code):
    return tuple(int(code[i:i + 2], 16) for i in (1, 3, 5))


def gradient(width, height, stops):
    column = Image.new("RGB", (1, height))
    for y in range(height):
        t = y / max(1, height - 1)
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= t <= b:
                k = (t - a) / (b - a)
                column.putpixel((0, y), tuple(round(x + (z - x) * k) for x, z in zip(rgb(ca), rgb(cb))))
                break
    return column.resize((width, height))


def layer(name, width):
    im = Image.open(LP / f"{name}.webp").convert("RGBA")
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def main():
    card = Image.new("RGBA", (W, H))
    card.paste(gradient(W, HORIZON, SKY), (0, 0))
    card.paste(gradient(W, H - HORIZON, [(0, "#57bd91"), (0.35, "#355281"), (1, "#1c1a3a")]), (0, HORIZON))
    core = layer("core", 500)
    card.alpha_composite(core, (660, 20))
    for name, width, drop in (("hills", 1400, 0), ("city-far", 1300, 0), ("city-near", 940, 6)):
        im = layer(name, width)
        x = (W - width) // 2 if name != "city-near" else 330
        card.alpha_composite(im, (x, HORIZON - im.height + drop)) if x >= 0 else card.alpha_composite(im.crop((-x, 0, -x + W, im.height)), (0, HORIZON - im.height + drop))
    shore = layer("shore-spring", 560)
    for x in range(0, W, 560):
        part = shore.crop((0, 0, min(560, W - x), shore.height))
        card.alpha_composite(part, (x, H - shore.height + 8))

    shade = Image.new("RGBA", (W, H))
    draw = ImageDraw.Draw(shade)
    for x in range(820):
        draw.line([(x, 0), (x, H)], fill=(18, 17, 39, round(215 * min(1, (820 - x) / 420))))
    card.alpha_composite(shade)

    draw = ImageDraw.Draw(card)
    fonts = Path("C:/Windows/Fonts")
    bold = lambda size: ImageFont.truetype(str(fonts / "segoeuib.ttf"), size)
    draw.text((70, 96), "WEB3 PRODUCT LAB", font=bold(24), fill="#8fdcb6")
    draw.text((66, 138), "doepic.cc", font=bold(92), fill="#f5f6ec")
    draw.text((70, 268), "Building crypto things", font=bold(46), fill="#f5f6ec")
    draw.text((70, 326), "that feel good to use", font=bold(46), fill="#c4e67e")
    card.convert("RGB").save(ROOT / "public" / "social.jpg", quality=88, optimize=True, progressive=True)
    print("write public/social.jpg", (ROOT / "public" / "social.jpg").stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
