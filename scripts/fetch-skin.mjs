/**
 * 构建期皮肤抓取器：从 dsh-web 市场仓库下载鲸鱼娘皮肤资产
 * （skin.css + patches.css，v2 清单），烘焙进
 * src/client/generated/skin-assets.ts，让插件完全自包含——CSS 与视频
 * 全部内联，运行时无 CDN。
 *
 * 背景视频为 assets/whale-blink-loop.mp4：从上游 25.5 秒循环中裁剪出的
 * 2.58 秒眨眼片段（第 378-439 帧，15.71 秒-18.29 秒；删除开头线条构建段）。
 * 复现命令：
 *   ffmpeg -ss 15.7083 -i whale-fantasy-loop.mp4 -frames:v 62 \
 *     -c:v libx264 -crf 19 -preset slow -pix_fmt yuv420p -an \
 *     -movflags +faststart assets/whale-blink-loop.mp4
 *
 * 上游皮肤更新后，重跑 `pnpm fetch-skin` 即可同步。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REF = 'dev'
const BASE = `https://raw.githubusercontent.com/zhu1090093659/dsh-web/${REF}/market/dist/assets/skins/whale-fantasy`

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'src/client/generated/skin-assets.ts')
const VIDEO = resolve(ROOT, 'assets/whale-blink-loop.mp4')

async function fetchText(path) {
  const response = await fetch(`${BASE}/${path}`)
  if (!response.ok) throw new Error(`fetch ${path}: HTTP ${response.status}`)
  return await response.text()
}

const [skinCss, patchesCss, license, video] = await Promise.all([
  fetchText('skin.css'),
  fetchText('patches.css'),
  fetchText('LICENSE'),
  readFile(VIDEO),
])

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, [
  '// 由 scripts/fetch-skin.mjs 生成，勿手改——重跑 `pnpm fetch-skin`。',
  `export const SKIN_CSS = ${JSON.stringify(skinCss)}`,
  `export const PATCHES_CSS = ${JSON.stringify(patchesCss)}`,
  `export const VIDEO_BASE64 = ${JSON.stringify(video.toString('base64'))}`,
  `export const SCRIM = ${JSON.stringify(
    'linear-gradient(180deg, rgba(5,7,13,0) 0%, rgba(5,7,13,0) 86%, rgba(5,7,13,0.16) 96%, rgba(5,7,13,0.22) 100%)',
  )}`,
  '',
].join('\n'))
await writeFile(resolve(ROOT, 'LICENSE'), license)

console.log(`skin-assets.ts 已写入（skin.css ${skinCss.length} B，patches.css ${patchesCss.length} B，视频 ${video.length} B）；LICENSE 已更新`)
