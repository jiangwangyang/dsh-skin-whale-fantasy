/**
 * Browser half of the standalone whale-fantasy skin plugin.
 *
 * Applies the skin the same way the skin center does, minus every management
 * concern — enable the plugin and the skin is on, disable it and the stock
 * look returns. One activation, no switching, no settings:
 *
 *   1. skin.css (L1 token remap, 95 --dsw-alias-* tokens) as a <style> tag;
 *   2. patches.css (L3 atmosphere layer) as a <style> tag;
 *   3. html[data-dsh-skin="whale-fantasy"] — the skin-center contract stamp,
 *      kept so patches written against it (and other plugins keying on it)
 *      behave identically;
 *   4. a fixed background layer (z-index:-2, pointer-events:none) carrying
 *      the looping blink video plus its scrim, with body backgrounds forced
 *      transparent so the art shows through.
 *
 * Everything lives inside one ctx.effect, so unloading the plugin tears the
 * skin down completely (disposers run in reverse registration order).
 */
import type { Context } from '@deepseek-ai/cordis'
import { PATCHES_CSS, SCRIM, SKIN_CSS, VIDEO_BASE64 } from './generated/skin-assets.ts'

const SKIN_ID = 'whale-fantasy'
const LAYER_ATTR = 'data-dsh-skin-layer'
const STYLE_ATTR = 'data-plugin'

export function apply(ctx: Context): void {
  ctx.effect(() => {
    const doc = document
    const disposers: Array<() => void> = []
    const onDispose = (fn: () => void): void => {
      disposers.push(fn)
    }

    // 1-2. Stylesheets. Every asset (CSS and the video) is inlined at build
    // time, so relative url() resolution and network access are not concerns.
    const skinStyle = doc.createElement('style')
    skinStyle.setAttribute(STYLE_ATTR, 'dsh-skin-whale-fantasy/skin')
    skinStyle.textContent = SKIN_CSS
    doc.head.appendChild(skinStyle)
    onDispose(() => skinStyle.remove())

    const patchStyle = doc.createElement('style')
    patchStyle.setAttribute(STYLE_ATTR, 'dsh-skin-whale-fantasy/patches')
    patchStyle.textContent = PATCHES_CSS
    doc.head.appendChild(patchStyle)
    onDispose(() => patchStyle.remove())

    // 3. The atomic stamp.
    doc.documentElement.setAttribute('data-dsh-skin', SKIN_ID)
    onDispose(() => doc.documentElement.removeAttribute('data-dsh-skin'))

    // 4. Background media layer (mirrors the skin center's decoration layer:
    // negative z paints above html/body backgrounds yet below every panel).
    const layer = doc.createElement('div')
    layer.setAttribute(LAYER_ATTR, 'background')
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText =
      'position:fixed;top:0;right:0;bottom:0;left:0;z-index:-2;pointer-events:none;will-change:transform;'

    const video = doc.createElement('video')
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.setAttribute('disablepictureinpicture', '')
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;'
    // The blink loop is inlined as base64 at build time; hand it to the
    // element as a blob URL so no network fetch ever happens.
    const videoBytes = Uint8Array.from(atob(VIDEO_BASE64), (c) => c.charCodeAt(0))
    const videoUrl = URL.createObjectURL(new Blob([videoBytes], { type: 'video/mp4' }))
    video.src = videoUrl
    onDispose(() => URL.revokeObjectURL(videoUrl))
    layer.appendChild(video)

    const scrim = doc.createElement('div')
    scrim.style.cssText = `position:absolute;top:0;right:0;bottom:0;left:0;background:${SCRIM};`
    layer.appendChild(scrim)

    doc.body.appendChild(layer)
    onDispose(() => {
      video.pause()
      layer.remove()
    })

    // The shell's own opaque body background would cover the negative-z layer.
    const bodyStyle = doc.body.style
    const previousColor = bodyStyle.getPropertyValue('background-color')
    const previousImage = bodyStyle.getPropertyValue('background-image')
    bodyStyle.setProperty('background-color', 'transparent')
    bodyStyle.setProperty('background-image', 'none')
    onDispose(() => {
      if (previousColor === '') bodyStyle.removeProperty('background-color')
      else bodyStyle.setProperty('background-color', previousColor)
      if (previousImage === '') bodyStyle.removeProperty('background-image')
      else bodyStyle.setProperty('background-image', previousImage)
    })

    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }, 'dsh-skin-whale-fantasy')
}
