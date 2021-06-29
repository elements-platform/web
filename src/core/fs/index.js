import * as BrowserFS from 'browserfs';
import ElementsDevices from './dev';

const container = Object.create(null);

BrowserFS.install(container);
// @ts-ignore
BrowserFS.registerFileSystem(ElementsDevices.Name, ElementsDevices);

/** @type {Promise<void>} */
export const init = new Promise((resolve, reject) => BrowserFS.configure({
	fs: 'MountableFileSystem',
	options: {
		'/tmp': {
			fs: 'InMemory',
		},
		'/home': {
			fs: 'IndexedDB',
			options: {
				storeName: 'elementsFS',
			},
		},
		'/dev': {
			fs: ElementsDevices.Name,
		},
	},
}, e => e && (reject(e), true) || resolve()));

export const nativePlugins = {
    /** @return {import('fs')} */
	fs: () => container.require('fs'),
    /** @return {import('buffer')} */
	buffer: () => container.Buffer,
};
