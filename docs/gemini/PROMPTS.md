# Gemini artwork for doepic.cc (low-poly, crypto)

The scene is built from light low-poly layers. Sky and water are CSS (one gradient per season), with no images.
Images are generated in Gemini (gemini.google.com, "Create images" tool) in the built-in browser, accepted by the
local receiver (`tools/receiver.py`, see the README), then `python tools/import_gemini.py` removes the background,
compresses to WebP and writes `public/img/lp/`. `python tools/social_card.py` rebuilds the link preview.

| File in `gemini-raw/` | Background | Layer |
|---|---|---|
| `core-lp` | pure black | crypto core (turned into transparency) |
| `hills-lp` | green `#00FF00` | candlestick mountains |
| `city-far-lp`, `city-near-lp` | green | two city layers |
| `shore-lp-spring/summer/autumn/winter` | magenta `#FF00FF` | bank of each season |
| `soon-lp` | indigo `#1c1a3a` | "coming soon" card |

Common style: `Low-poly 3D style: clean faceted triangular polygons with flat shading and soft gradients, soft glow, polished render, no text, no letters, no logos, not pixel art.`

Palette: `#1c1a3a #2a2662 #355281 #408898 #57bd91 #a4d969 #f0eb88 #d9a269 #bd5757 #984092 #5a3581`

## core-lp (1:1)
```
A giant faceted crypto coin-core glowing like a sun, centered on a PURE BLACK #000000 background, front view, symmetrical: a round faceted disk with a hexagonal crystal gem in its middle, color gradient from soft butter yellow #f0eb88 at the center through lime #a4d969 and mint #57bd91 to teal #408898 and orchid #984092 at the rim; around it a ring of 12 small floating faceted cubes (blockchain blocks) connected by thin glowing lines, alternating mint, ochre #d9a269 and orchid. Fills about 85 percent of the frame. Nothing else, the background must be perfectly black.
```

## hills-lp (21:9, green)
```
SOLID PURE GREEN #00FF00 background (flat chroma-key green screen, no gradient, no sky, no ground plane). A mountain range in three overlapping faceted ridges whose peaks rise like a crypto price chart: hazy slate blue #355281, indigo #2a2662 and violet #5a3581, with soft orchid #984092 and ochre #d9a269 light on facets facing the sunrise, a few slim glowing faceted candlestick pillars standing among the peaks, small low-poly pine trees, nearest ridge darkest. Everything stands on one straight flat baseline at the very bottom edge, spans the full width, nothing below. No green colors on the objects.
```

## city-far-lp (21:9, green)
```
A distant hazy blockchain city skyline: slim towers built from stacked floating cubes (blocks), server towers, a few spires and domes, thin glowing chain-like bridges linking towers, in misty slate blue #355281, violet #5a3581 and orchid #984092 with small butter #f0eb88 and ochre #d9a269 window lights. All buildings stand on one straight flat baseline at the very bottom edge and touch it, spanning the full width, nothing below. No green colors on the buildings.
```

## city-near-lp (21:9, green)
```
The NEAR crypto city skyline, darkest layer, crisp: deep navy #1c1a3a and indigo #2a2662 data-center skyscrapers and server racks, a tall tower made of stacked cubes right of center, a big giant faceted ring portal, satellite dishes, antennas, a few mining rigs with fans, floating faceted coins, many small window facets glowing butter #f0eb88, ochre #d9a269, coral #bd5757 and orchid #984092, thin teal #408898 rim light. Flat baseline at the very bottom edge. No green colors on objects.
```

## shore-lp-spring / summer / autumn / winter (21:9, magenta)
`A low narrow riverbank seen from the side with a row of low-poly trees filling at most the lower 70 percent … All on one straight flat baseline at the very bottom edge, full width, nothing below. No pink or magenta on objects.`

- spring: blossoming trees with lime, butter and mint crowns, young bushes, glowing crystals, small floating cubes and coins;
- summer (DeFi summer): deep green and teal crowns, a weeping willow, reeds, flowers, crystals, golden coins;
- autumn (harvest): maples, birches and oaks in ochre, butter and burnt coral, dry reeds, pumpkins, piles of coins;
- winter (crypto winter): snowy firs and pines, bare birches, snowy rocks, teal ice crystals, frosted coins, violet shadows.

## soon-lp (16:9)
```
Dark background of solid very dark indigo #1c1a3a. In the center a mysterious new project being assembled: a large faceted glass cube, half open, with warm butter #f0eb88 and mint #57bd91 light pouring out, small cubes in teal, lime, ochre, coral, orchid and violet flying in and snapping onto it, thin glowing chain links between them, a low faceted platform under it, a few tiny sparks. Generous empty margins around.
```
