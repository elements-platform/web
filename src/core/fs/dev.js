import { Errors } from 'browserfs';
/** @typedef { import('browserfs/dist/node/core/file_system').FileSystem } FileSystem */

function notSupported(context, method){
	context[method + 'Sync'] = () => {
		const code = Errors.ErrorCode.ENOTSUP;
		const message = Errors.ErrorStrings[code];
		throw new Errors.ApiError(code, message);
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
export default class ElementsDevices{
	static Name = 'ElementsDevices'
	static Options = {}
	static Create = (_, callback) => callback(null, new ElementsDevices)
	static isAvailable = () => true

	getName(){
		return ElementsDevices.Name;
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
