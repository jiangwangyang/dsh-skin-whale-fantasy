/**
 * 独立鲸鱼娘皮肤插件的宿主半边。
 *
 * 皮肤是纯浏览器侧呈现（CSS + 一个背景视频，均在构建期内联进客户端
 * bundle），因此宿主半边刻意什么都不做。它存在只是因为 bundle 加载器
 * 会导入每一行的 Node 半边。
 */
export function apply(): void {}
