/**
 * 独立鲸鱼娘皮肤插件的 tsdown 构建配置。
 *
 * lib/ 下产出两个产物：
 *  - index.js  （Node 宿主半边，ESM；cordis 保持外部依赖——宿主会从
 *    dsh 配置树中解析它）
 *  - client.js （浏览器半边，CJS 闭包工厂：bundle 把自己交给
 *    window.__ModuleLoader__.load({ id, factory })，与官方客户端模块
 *    加载器期望的形态完全一致）
 *
 * 浏览器半边运行时不 import 任何东西（cordis 仅为类型导入，编译即擦除），
 * 因此无需配置模块表外部依赖。
 */
import type { UserConfig } from 'tsdown'

const ID = 'dsh-skin-whale-fantasy'

const lib: UserConfig = {
  name: ID,
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
  external: ['@deepseek-ai/cordis'],
}

const client: UserConfig = {
  name: `${ID}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  dts: false,
  sourcemap: false,
  clean: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [lib, client]
