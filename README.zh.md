# dsh-skin-whale-fantasy

[English](README.md) | [中文](README.zh.md)

把 **鲸鱼娘 · 未至之境（Whale Girl · The Unreached）** 皮肤做成独立 dsh 插件：
启用即应用，禁用即还原。没有皮肤中心、没有设置项、没有皮肤列表——只有主题本身。

## 工作原理

完整复制皮肤中心运行时对这套皮肤做的事：

1. 以 `<style>` 标签注入 `skin.css`（L1 token 重映射，95 个 `--dsw-alias-*`）
   和 `patches.css`（L3 氛围层）；
2. 盖上 `html[data-dsh-skin="whale-fantasy"]` 标记；
3. 挂载固定背景层（`z-index:-2`，`pointer-events:none`），内置循环背景视频
   及其 scrim 渐变，并把 body 背景设透明让画面透出来。

插件禁用时以上全部撤除。

## 构建

```sh
pnpm install
pnpm build   # 下载皮肤资产，然后打出 lib/index.js + lib/client.js
```

`pnpm fetch-skin` 会从上游市场仓库重新下载 `skin.css` / `patches.css`，
重新生成 `src/client/generated/skin-assets.ts` 和 `LICENSE`。

## 安装

在 dsh 插件管理器中安装包 `dsh-skin-whale-fantasy`（或直接指向本目录 /
git 地址）。启用插件皮肤立即生效，禁用即恢复默认外观。

## 注意

- **暗色专用**皮肤（原作者设计）：系统在亮色模式下也渲染同一套暗色。
- **与皮肤中心互斥**（`@linxin666/dsh-client-ui-skin-center`）：两者都会盖
  `data-dsh-skin` 章并占用背景层，二选一使用。
- 背景视频（约 6.6 MB）运行时从 CDN（jsDelivr，失败回退 GitHub Raw）加载，
  其余内容全部打进 `lib/client.js`。

## 署名与许可

皮肤本体 —— `skin.json` / `skin.css` / `patches.css`、调色板、全部全息化规则
与背景视频 —— 均为 **stushansusu** 原创，按
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
发布（见 `LICENSE`）。来源：
[dsh-web 市场目录](https://github.com/zhu1090093659/dsh-web/tree/dev/market/dist/assets/skins/whale-fantasy)。

本包装插件只负责把皮肤打包成可独立安装的形态，同样以 CC BY-NC-SA 4.0 发布。
