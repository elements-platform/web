import * as esbuild from 'esbuild-wasm/lib/browser.min.js';
// @ts-ignore
import esbuildWASMUrl from 'esbuild-wasm/esbuild.wasm?url';

/** @typedef { import('esbuild-wasm').Plugin } Plugin */

const init = esbuild.initialize({
    wasmURL: esbuildWASMUrl,
    worker: true,
});

/**
 * @arg {string} url
 * @arg {string} base
 * @return {{ type: 'http', parsed: string }}
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
    throw new Error(`Import path ${url} not supported`);
}

/** @type { Plugin } */
const httpImportPlugin = {
    name: 'http',
    setup(build){
        // Intercept import paths starting with "http:" and "https:" so
        // esbuild doesn't attempt to map them to a file system location.
        // Tag them with the "http-url" namespace to associate them with
        // this plugin.
        build.onResolve({ filter: /.*/ }, args => {
            const { type, parsed } = parseUrl(args.path, args.importer);
            if(type === 'http') return {
                path: parsed,
                namespace: 'http-url',
            }
        });

        // When a URL is loaded, we want to actually download the content
        // from the internet. This has just enough logic to be able to
        // handle the example import from unpkg.com but in reality this
        // would probably need to be more complex.
        build.onLoad({ filter: /.*/, namespace: 'http-url' }, async args => {
            const contents = await fetch(args.path).then(v => v.text())
            return { contents }
        });
    },
}

export default async moduleUrl => {
    await init;
    const res = await esbuild.build({
        bundle: true,
        splitting: false,
        entryPoints: [ moduleUrl ],
        plugins: [
            httpImportPlugin,
        ],
    });
    return new TextDecoder().decode(res.outputFiles[0].contents)
}
