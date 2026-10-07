# dsh-skin-whale-fantasy

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE)
![Platform](https://img.shields.io/badge/platform-web-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

English | [中文](README.zh-CN.md)

The **Whale Girl · The Unreached (鲸鱼娘 · 未至之境)** skin as a standalone DeepSeek Harness (dsh) plugin: enable the plugin and the skin is on, disable it and the stock look returns without residue. No skin center, no settings, no skin list — just the theme.

![hero](docs/screenshots/whale-fantasy.jpg)

## Features

- **The full whale-fantasy skin, standalone**: the original `skin.css` (L1 token remap, 95 `--dsw-alias-*` tokens) and `patches.css` (L3 holographic atmosphere layer), injected exactly as the skin center's runtime would
- **Looping whale background video + full-screen dimming veil**: a fixed background layer (`z-index: -2`, `pointer-events: none`) carries the 2.58 s blink loop, a 0.5-opacity deep-night blue-black dimming veil and a scrim gradient, with the body background forced transparent so the art shows through — the veil keeps text on transparent panels readable
- **Skin-center contract stamp**: `html[data-dsh-skin="whale-fantasy"]` is set while the plugin is active, so patches written against the stamp (and other plugins keying on it) behave identically
- **Fully self-contained, zero runtime network**: the stylesheets and the video are inlined into the client bundle at build time (the video as base64, delivered to the element as a blob URL) — no CDN, no static asset routes, no globals
- **Clean teardown**: everything lives inside one `ctx.effect`, so disabling the plugin removes every DOM trace and restores the previous body background exactly as it was

## Installation

The skin is purely browser-side and has no host-side service dependencies.

Requires dsh ≥ 0.1.7-rc.1.

```bash
dsh plugin --profile web add github:jiangwangyang/dsh-skin-whale-fantasy
```

Or install the package `dsh-skin-whale-fantasy` from the dsh plugin manager.

## Usage

There is no settings toggle: the skin applies as soon as the plugin is enabled.

- **Turn off**: disable or remove the plugin (`dsh plugin --profile web remove dsh-skin-whale-fantasy`); the stylesheets, the stamp, the background layer (with its dimming veil) and the body transparency are all retracted, restoring the stock look exactly as it was
- **Appearance setting**: this is a **dark-only skin** by the original author's design — it renders the same dark palette under both light and dark system schemes
- **Mutually exclusive with the skin center** (`@linxin666/dsh-client-ui-skin-center`): both stamp `data-dsh-skin` and own the background layer — use one or the other

## How It Works

### Overall Architecture

The skin is purely browser-side: the host side is an empty implementation (the bundle loader imports every row's node half), and all logic lives in a single client bundle:

| Part             | Location | Responsibility |
|------------------|----------|----------------|
| Host side        | `src/index.ts` | Empty implementation (`apply()` does nothing) |
| Client side      | `src/client/index.ts` | Injects stylesheets, stamps `data-dsh-skin`, mounts the background layer (video + dimming veil + scrim gradient), all inside one `ctx.effect` |
| Skin assets      | `src/client/skin-assets.ts` | `SKIN_CSS` / `PATCHES_CSS` / `VIDEO_BASE64` / `SCRIM` / `VEIL`, all inlined and shipped with the repo; the video is the upstream 25.5 s loop trimmed to the seamless 2.58 s blink segment |

### Activation Steps

One activation, no switching, no settings — the client replicates exactly what the skin center's runtime does for this one skin:

1. injects `skin.css` and `patches.css` as `<style>` tags in `document.head`;
2. stamps `html[data-dsh-skin="whale-fantasy"]` — the skin-center contract;
3. mounts a fixed background layer (`z-index: -2`, `pointer-events: none`) carrying the looping blink video plus its scrim gradient — negative z paints above the html/body backgrounds yet below every panel;
4. nests a full-screen dimming veil inside the background layer (after the video, before the scrim) — a 0.5-opacity deep-night blue-black wash that keeps text on transparent panels readable; it must share the video's stacking context, otherwise the compositor-promoted video would pop above the veil;
5. forces the body background transparent so the art shows through (the previous values are recorded and restored on unload).

### Gating and Teardown

- All skin visuals key off the `data-dsh-skin` attribute on the `html` element and the injected `<style>` tags: present while the plugin is active, gone the moment it is disabled — no residue
- Everything is registered inside a single `ctx.effect`; disposers run in reverse registration order on unload: stylesheets removed, stamp removed, video paused and its blob URL revoked, background layer (with its dimming veil) removed, body background restored
- Every asset (CSS and the video) is bundled into the client, so relative `url()` resolution and network access are not concerns; the trade-off is a larger client bundle

### The Background Video

The video lives at `assets/whale-blink-loop.mp4` (base64-inlined into `src/client/skin-assets.ts`): it is the upstream 25.5 s loop trimmed to the 2.58 s blink segment (frames 378-439, 15.71 s–18.29 s; the line-construction intro is dropped, and the remaining blink cycles seamlessly). Upstream download: [jsDelivr CDN](https://cdn.jsdelivr.net/gh/zhu1090093659/dsh-web@dev/market/dist/assets/skins/whale-fantasy/assets/whale-fantasy-loop.mp4) (fallback: [GitHub raw](https://raw.githubusercontent.com/zhu1090093659/dsh-web/dev/market/dist/assets/skins/whale-fantasy/assets/whale-fantasy-loop.mp4)). Reproduce with:

```bash
ffmpeg -ss 15.7083 -i whale-fantasy-loop.mp4 -frames:v 62 \
  -c:v libx264 -crf 19 -preset slow -pix_fmt yuv420p -an \
  -movflags +faststart assets/whale-blink-loop.mp4
```

At runtime the video is decoded from its inlined base64 into a blob URL and handed to a muted, looping, inline `<video>` element with `object-fit: cover` — no network fetch ever happens.

## Build from Source

```bash
pnpm install
pnpm build        # bundles lib/index.js + lib/client.js (assets ship with the repo - no download step)
```

## Project Structure

```
.
├── cordis.patch.yml      # bundle patch: inserts the plugin row into the web roster
├── package.json          # exports, dsh.bundle / dsh.client manifest
├── lib                   # build output (committed, so git installs need no build step)
├── assets
│   └── whale-blink-loop.mp4   # trimmed background video; base64 source of skin-assets.ts
└── src
    ├── index.ts          # host side (empty implementation)
    └── client
        ├── index.ts      # client side (styles + stamp + background layer)
        └── skin-assets.ts   # skin assets (CSS + video, all inlined)
```

## Credits

The skin itself — `skin.json` / `skin.css` / `patches.css`, the palette, all holographic HUD rules, and the background video — is the original work of **stushansusu**, published under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Source: https://github.com/zhu1090093659/dsh-web/tree/dev/market/dist/assets/skins/whale-fantasy.

## License

[CC BY-NC-SA 4.0](./LICENSE) — this wrapper plugin only packages the skin for standalone installation and is published under the same terms.
