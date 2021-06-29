import * as esbuild from 'esbuild-wasm/lib/browser.min.js';
// @ts-ignore
import esbuildWASMUrl from 'esbuild-wasm/esbuild.wasm?url';
import rand from '@/system/rand';
import { init as fsInit, nativePlugins as fsNativePlugins } from '@/core/fs';

/** @typedef { import('esbuild-wasm').Plugin } Plugin */

const init = esbuild.initialize({
	wasmURL: esbuildWASMUrl,
	worker: true,
});

const nativePlugins = Object.assign(
	{},
	fsNativePlugins,
);
const nativePluginsId = rand();

Object.defineProperty(globalThis, nativePluginsId, {
	enumerable: false,
	value: nativePlugins,
});

/**
 * @arg {string} url
 * @arg {string} base
 * @return {{ type: 'http' | 'native', parsed }}
 */
function parseUrl(url, base){
	if(/^https?:\/\/./.test(url)) return {
		type: 'http',
		parsed: url,
	};
	if(/^\.\.?\/./.test(url) && base) return {
		type: 'http',
		parsed: new URL(url, base).toString(),
	};
	if(Object.keys(nativePlugins).includes(url)) return {
		type: 'native',
		parsed: `module.exports = globalThis[${JSON.stringify(nativePluginsId)}][${JSON.stringify(url)}]();`,
	};
	throw new Error(`Import path ${url} not supported`);
}

/** @type { Plugin } */
const importPlugin = {
	name: 'import-plugin',
	setup(build){
		build.onResolve({ filter: /.*/ }, args => {
			const { type, parsed } = parseUrl(args.path, args.importer);
			if(type === 'http') return {
				path: parsed,
				namespace: 'http-url',
			};
			if(type === 'native') return {
				path: args.path,
				namespace: 'native',
				pluginData: parsed,
			};
		});

		build.onLoad({ filter: /.*/, namespace: 'http-url' }, async args => {
			const contents = await fetch(args.path).then(v => v.text());
			return { contents };
		});

		build.onLoad({ filter: /.*/, namespace: 'native' }, async args => {
			return {
				contents: args.pluginData,
			};
		});
	},
}

/** @arg {string} moduleUrl */
export default async moduleUrl => {
	await init;
	await fsInit;
	/** @type {import('esbuild')} */
	let _esbuild = esbuild;
	const res = await _esbuild.build({
		bundle: true,
		splitting: false,
		entryPoints: [ moduleUrl ],
		plugins: [
			importPlugin,
		],
		format: 'esm',
	});
	return new TextDecoder().decode(res.outputFiles[0].contents)
}
