/**
 * 独立鲸鱼娘皮肤插件的浏览器半边。
 *
 * 应用方式与皮肤中心完全一致，只是剥掉了一切管理职能——启用插件皮肤
 * 即生效，禁用即恢复默认外观。一次激活、无切换、无设置：
 *
 *   1. skin.css（L1 token 重映射，96 个 --dsw-alias-*）以 <style> 标签注入；
 *   2. patches.css（L3 氛围层）以 <style> 标签注入；
 *   3. html[data-dsh-skin="whale-fantasy"]——皮肤中心契约盖章，保留它
 *      可让针对该标记编写的补丁（以及依赖该标记的其他插件）行为完全一致；
 *   4. 固定背景层（z-index:-2，pointer-events:none），承载循环眨眼视频
 *      及其 scrim 渐变，并把 body 背景强制透明让画面透出。
 *
 * 一切挂在单个 ctx.effect 内，卸载插件时皮肤被完整拆除（disposer 按注册
 * 逆序执行）。
 */
import type { Context } from '@deepseek-ai/cordis'
import { PATCHES_CSS, SCRIM, SKIN_CSS, VIDEO_BASE64 } from './skin-assets.ts'

const SKIN_ID = 'whale-fantasy'
const LAYER_ATTR = 'data-dsh-skin-layer'
const STYLE_ATTR = 'data-plugin'

export function apply(ctx: Context): void {
  ctx.effect(() => {
    const disposers: Array<() => void> = []
    const onDispose = (fn: () => void): void => {
      disposers.push(fn)
    }

    // 1-2. 样式表。所有资产（CSS 与视频）均内联于 skin-assets.ts，相对 url() 解析与
    // 网络访问都不是问题。
    const skinStyle = document.createElement('style')
    skinStyle.setAttribute(STYLE_ATTR, 'dsh-skin-whale-fantasy/skin')
    skinStyle.textContent = SKIN_CSS
    document.head.appendChild(skinStyle)
    onDispose(() => skinStyle.remove())

    const patchStyle = document.createElement('style')
    patchStyle.setAttribute(STYLE_ATTR, 'dsh-skin-whale-fantasy/patches')
    patchStyle.textContent = PATCHES_CSS
    document.head.appendChild(patchStyle)
    onDispose(() => patchStyle.remove())

    // 3. 原子盖章。
    document.documentElement.setAttribute('data-dsh-skin', SKIN_ID)
    onDispose(() => document.documentElement.removeAttribute('data-dsh-skin'))

    // 4. 背景媒体层（与皮肤中心的装饰层一致：负 z 位于 html/body 背景之上、
    // 所有面板之下）。
    const layer = document.createElement('div')
    layer.setAttribute(LAYER_ATTR, 'background')
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText =
      'position:fixed;top:0;right:0;bottom:0;left:0;z-index:-2;pointer-events:none;will-change:transform;'

    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.setAttribute('disablepictureinpicture', '')
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;'
    // 眨眼循环以 base64 内联；运行时转成 blob URL 交给元素，
    // 不发起任何网络请求。
    const videoBytes = Uint8Array.from(atob(VIDEO_BASE64), (c) => c.charCodeAt(0))
    const videoUrl = URL.createObjectURL(new Blob([videoBytes], { type: 'video/mp4' }))
    video.src = videoUrl
    onDispose(() => URL.revokeObjectURL(videoUrl))
    layer.appendChild(video)

    const scrim = document.createElement('div')
    scrim.style.cssText = `position:absolute;top:0;right:0;bottom:0;left:0;background:${SCRIM};`
    layer.appendChild(scrim)

    document.body.appendChild(layer)
    onDispose(() => {
      video.pause()
      layer.remove()
    })

    // 外壳自己的不透明 body 背景会盖住负 z 层。
    const bodyStyle = document.body.style
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
