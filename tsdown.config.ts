/**
 * tsdown build for the standalone whale-fantasy skin plugin.
 *
 * Two artifacts land in lib/:
 *  - index.js  (node host half, ESM; cordis stays external — the host resolves
 *    it from the dsh profile tree)
 *  - client.js (browser half, CJS closure-factory: the bundle hands itself to
 *    window.__ModuleLoader__.load({ id, factory }) exactly like the official
 *    client-module loader expects)
 *
 * The browser half imports nothing at runtime (type-only cordis imports are
 * erased), so no module-table externals are needed.
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
  sourcemap: true,
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
