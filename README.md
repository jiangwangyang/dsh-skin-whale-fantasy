# dsh-skin-whale-fantasy

[English](README.md) | [中文](README.zh.md)

The **Whale Girl · The Unreached (鲸鱼娘 · 未至之境)** skin as a standalone dsh
plugin: enable it and the skin is on, disable it and the stock look returns.
No skin center, no settings, no skin list — just the theme.

## What it does

Replicates exactly what the skin center's runtime does for this one skin:

1. injects `skin.css` (L1 token remap, 95 `--dsw-alias-*` tokens) and
   `patches.css` (L3 atmosphere layer) as `<style>` tags;
2. stamps `html[data-dsh-skin="whale-fantasy"]`;
3. mounts a fixed background layer (`z-index:-2`, `pointer-events:none`) with
   the looping background video plus its scrim, and makes the body background
   transparent so the art shows through.

Everything is torn down when the plugin is disabled.

## Build

```sh
pnpm install
pnpm build   # downloads the skin assets, then bundles lib/index.js + lib/client.js
```

`pnpm fetch-skin` re-downloads `skin.css` / `patches.css` from the upstream
market tree and regenerates `src/client/generated/skin-assets.ts` and `LICENSE`.

## Install

From the dsh plugin manager, install the package `dsh-skin-whale-fantasy`
(or point it at this directory / a git URL). Enable the plugin — the skin
applies immediately; disable it to restore the stock look.

## Notes

- **Dark-only skin** by the original author's design; it renders the same dark
  palette under both light and dark system schemes.
- **Mutually exclusive with the skin center** (`@linxin666/dsh-client-ui-skin-center`):
  both stamp `data-dsh-skin` and own the background layer. Use one or the other.
- The background video is `assets/whale-blink-loop.mp4`: the upstream 25.5 s
  loop trimmed to the 2.58 s blink segment (the line-construction intro is
  dropped, the remaining blink cycles seamlessly). It is base64-inlined into
  `lib/client.js` at build time — the plugin makes no network requests.

## Credits and license

The skin itself — `skin.json` / `skin.css` / `patches.css`, the palette, all
holographic HUD rules, and the background video — is the original work of
**stushansusu**, published under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
(see `LICENSE`). Source:
[dsh-web market tree](https://github.com/zhu1090093659/dsh-web/tree/dev/market/dist/assets/skins/whale-fantasy).

This wrapper plugin only packages the skin for standalone installation and is
published under the same CC BY-NC-SA 4.0 terms.
