import { Errors } from 'browserfs';
import FSStats from 'browserfs/dist/node/core/node_fs_stats';
import { BaseFileSystem } from 'browserfs/dist/node/core/file_system';

const devices = Object.create(null);

class Stats extends FSStats{
	constructor(){
		super(0, 0, 0, new Date(0), new Date(0), new Date(0));
	}
	isBlockDevice(){
		return true;
	}
	isFile(){
		return false;
	}
	isDirectory(){
		return false;
	}
}

export default class ElementsDevices extends BaseFileSystem{
	static Name = 'ElementsDevices'
	static Options = {}
	static Create = (_, callback) => callback(null, new ElementsDevices)
	static isAvailable = () => true

	getName(){
		return ElementsDevices.Name;
	}
	isReadOnly(){
		return true;
	}
	supportsProps(){
		return false;
	}
	supportsSynch(){
		return false;
	}
	stat(p, isLstat, cb){
		if(p in devices){
			cb(null, devices[p].stats);
		} else {
			cb(new Errors.ApiError(Errors.ErrorCode.ENOENT));
		}
	}
	/**
	 * TODO: implement
	 */
	open(p, flag, mode, cb){
		throw new Error('Method not implemented.');
	}
	/**
	 * TODO: implement
	 */
	readFile(p, flag, mode, cb){
		throw new Error('Method not implemented.');
	}
	/**
	 * TODO: implement
	 */
	writeFile(p, flag, mode, cb){
		throw new Error('Method not implemented.');
	}
	/**
	 * TODO: implement
	 */
	appendFile(p, flag, mode, cb){
		throw new Error('Method not implemented.');
	}

	/*
	 * !NOT SUPPORTED METHODS
	 */

	openSync(){
		throw new Errors.ApiError(Errors.ErrorCode.ENOTSUP);
	}
	existsSync(){
		throw new Errors.ApiError(Errors.ErrorCode.ENOTSUP);
	}
	realpath(p, cache, cb){
		cb(new Errors.ApiError(Errors.ErrorCode.ENOTSUP));
	}
	realpathSync(){
		throw new Errors.ApiError(Errors.ErrorCode.ENOTSUP);
	}
	truncate(p, len, cb){
		cb(new Errors.ApiError(Errors.ErrorCode.ENOTSUP));
	}
	truncateSync(){
		throw new Errors.ApiError(Errors.ErrorCode.ENOTSUP);
	}
}

export function registerDevice(name, reader, writer, stopper){
	devices[name] = {
		stats: new Stats,
		reader,
		writer,
		stopper,
	}
}
