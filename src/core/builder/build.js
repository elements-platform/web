import * as esbuild from 'esbuild-wasm/lib/browser.min.js';
// @ts-ignore
import esbuildWASMUrl from 'esbuild-wasm/esbuild.wasm?url';
import * as BrowserFS from 'browserfs';
import rand from '@/system/rand';

/** @typedef { import('esbuild-wasm').Plugin } Plugin */
/** @typedef { import('browserfs/dist/node/core/file_system').FileSystem } FileSystem */

const bfsContainer = Object.create(null),
	efsName = 'ElementsDevices';

function notSupported(context, method){
	context[method + 'Sync'] = () => {
		const code = BrowserFS.Errors.ErrorCode.ENOTSUP;
		const message = BrowserFS.Errors.ErrorStrings[code];
		throw new BrowserFS.Errors.ApiError(code, message);
	};
	context[method] = (...args) => {
		try{
			context[method + 'Sync']();
		} catch(e){
			args.pop()(e);
		}
	};
}

/** @implements {FileSystem} */
class ElementsDevices{
	static Name = efsName
	static Options = {}
	static Create = (_, callback) => callback(null, new ElementsDevices)
	static isAvailable = () => true

	getName(){
		return efsName;
	}
	diskSpace(_, cb){
		cb(0, 0);
	}
	isReadOnly(){
		return true;
	}
	supportsLinks(){
		return false;
	}
	supportsProps(){
		return false;
	}
	supportsSynch(){
		return false;
	}
	stat(p, isLstat, cb){
		throw new Error('Method not implemented.');
	}
	statSync(p, isLstat){
		throw new Error('Method not implemented.');
	}
	open(p, flag, mode, cb){
		throw new Error('Method not implemented.');
	}
	openSync(p, flag, mode){
		throw new Error('Method not implemented.');
	}
	readdir(p, cb){
		throw new Error('Method not implemented.');
	}
	readdirSync(p){
		throw new Error('Method not implemented.');
	}
	exists(p, cb){
		throw new Error('Method not implemented.');
	}
	existsSync(p){
		throw new Error('Method not implemented.');
	}
	realpath(p, cache, cb){
		throw new Error('Method not implemented.');
	}
	realpathSync(p, cache){
		throw new Error('Method not implemented.');
	}
	truncate(p, len, cb){
		throw new Error('Method not implemented.');
	}
	truncateSync(p, len){
		throw new Error('Method not implemented.');
	}
	readFile(fname, encoding, flag, cb){
		throw new Error('Method not implemented.');
	}
	readFileSync(fname, encoding, flag) {
		throw new Error('Method not implemented.');
	}
	writeFile(fname, data, encoding, flag, mode, cb){
		throw new Error('Method not implemented.');
	}
	writeFileSync(fname, data, encoding, flag, mode){
		throw new Error('Method not implemented.');
	}
	appendFile(fname, data, encoding, flag, mode, cb){
		throw new Error('Method not implemented.');
	}
	appendFileSync(fname, data, encoding, flag, mode){
		throw new Error('Method not implemented.');
	}
	chmod(p, isLchmod, mode, cb){
		throw new Error('Method not implemented.');
	}
	chmodSync(p, isLchmod, mode){
		throw new Error('Method not implemented.');
	}
	chown(p, isLchown, uid, gid, cb){
		throw new Error('Method not implemented.');
	}
	chownSync(p, isLchown, uid, gid){
		throw new Error('Method not implemented.');
	}
	utimes(p, atime, mtime, cb){
		throw new Error('Method not implemented.');
	}
	utimesSync(p, atime, mtime){
		throw new Error('Method not implemented.');
	}
	link(srcpath, dstpath, cb){
		throw new Error('Method not implemented.');
	}
	linkSync(srcpath, dstpath){
		throw new Error('Method not implemented.');
	}
	symlink(srcpath, dstpath, type, cb){
		throw new Error('Method not implemented.');
	}
	symlinkSync(srcpath, dstpath, type){
		throw new Error('Method not implemented.');
	}
	readlink(p, cb){
		throw new Error('Method not implemented.');
	}
	readlinkSync(p) {
		throw new Error('Method not implemented.');
	}
}

[
	'rename',
	'unlink',
	'rmdir',
	'mkdir',
].forEach(name => notSupported(ElementsDevices.prototype, name));

BrowserFS.install(bfsContainer);
BrowserFS.registerFileSystem(efsName, ElementsDevices);

const bfsInit = new Promise((resolve, reject) => BrowserFS.configure({
	fs: 'MountableFileSystem',
	options: {
		'/tmp': {
			fs: 'InMemory',
		},
		'/home': {
			fs: 'IndexedDB',
			options: {
				storeName: 'elementsFS'
			},
		},
		'/dev': {
			fs: efsName,
		},
	},
}, e => e && (reject(e), true) || resolve()));

const init = esbuild.initialize({
	wasmURL: esbuildWASMUrl,
	worker: true,
});

const nativePlugins = {
	get fs(){ return bfsContainer.require('fs') },
	get buffer(){ return bfsContainer.Buffer },
};

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
		parsed: `module.exports = globalThis[${JSON.stringify(nativePluginsId)}][${JSON.stringify(url)}];`,
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
	await bfsInit;
	const res = await esbuild.build({
		bundle: true,
		splitting: false,
		entryPoints: [ moduleUrl ],
		plugins: [
			importPlugin,
		],
	});
	return new TextDecoder().decode(res.outputFiles[0].contents)
}
