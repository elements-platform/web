// @ts-check
import preactRefresh from '@prefresh/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

/**
 * @type { import('vite').UserConfig }
 */
const config = {
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
		jsxInject: `import { h, Fragment } from 'preact'`
	},
	plugins: [
		preactRefresh(),
	],
	css: {
		modules: {
			scopeBehaviour: 'local',
			localsConvention: 'camelCaseOnly',
		},
	},
	alias: {
		'@': resolve(fileURLToPath(import.meta.url), '..', 'src'),
	},
}

export default config
