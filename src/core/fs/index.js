import { install, registerFileSystem, configure } from 'browserfs';
import ElementsDevices from './dev';

const container = Object.create(null);

install(container);
// @ts-ignore
registerFileSystem(ElementsDevices.Name, ElementsDevices);

/** @type {Promise<void>} */
export const init = new Promise((resolve, reject) => configure({
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
