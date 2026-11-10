# Assets

Original photographs, brand artwork and web fonts for the Ceylon Pathways site.
The originals in this folder are never modified by the site; everything the
browser loads is generated into `assets/img/` and `assets/fonts/`.

## Photography (originals)

| File | What it shows |
| --- | --- |
| `hortonplains2.JPG` | Mist and golden grassland on Horton Plains at sunrise - used as the hero |
| `hortanplains.JPG` | The highland reservoir in Horton Plains |
| `worlds end.JPG` | Cloud spilling between ridges below World's End |
| `mountainview.JPG` | Rolling highland ridges |
| `sunset.JPG` | Last light over the hills - used behind the contact section |
| `ninearchbridge.jpg` / `.HEIC` | The train on Nine Arch Bridge, Ella |
| `waterfall.jpg` / `.HEIC` | A hill-country waterfall (portrait) |
| `waterfall2.jpg` / `.HEIC` | A waterfall framed by jungle (landscape) |
| `teafactory.jpg` / `.HEIC` | A Nuwara Eliya tea factory facade |
| `myvan.jpg` / `.HEIC` | The Ceylon Pathways private van in the tea fields |
| `c1`-`c6.jpg` | Photographs of guests on Ceylon Pathways journeys |

## Generated images (`assets/img/`)

Responsive WebP variants are produced from the originals with `cwebp`
(`-q 80`-`82`), at the widths the layouts actually request:

- `hero-horton-{800,1200}.webp` - hero background
- `worldsend`, `mountainview`, `sunset`, `horton-lake`, `waterfall`,
  `waterfall-2`, `ninearch`, `teafactory`, `van` - section imagery
- `guest-1`…`guest-6-{480,800}.webp` - guest moments rail and gallery
- `mark-96.png`, `mark-180.png` - logo emblem cropped from `logobgr.png`
  (transparent), used for the header, footer and favicon
- `og-cover.jpg` - 1200×630 social sharing card

The HEIC originals carry EXIF rotation, which `cwebp` ignores. Orientation is
flattened before conversion (the Nine Arch file in particular) so the WebP
variants are the right way up.

## Fonts (`assets/fonts/`)

Self-hosted variable WOFF2 subsets (latin):

- `fraunces-normal.woff2`, `fraunces-italic.woff2` - display type
- `manrope-normal.woff2` - body and UI type

Both families are open source (SIL Open Font License) and served locally, so
the site makes no third-party font requests.
