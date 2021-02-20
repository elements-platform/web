// @ts-check
import encodeTransport from '@/system/rpc/encodings/null/server'
import createWorkerTransport from '@/system/rpc/transports/worker/server'
import createRPCServer from '@/system/rpc/server'
import MarkdownIt from 'markdown-it'

/** @type {MarkdownIt.Options} */
const options = {
    linkify: true,
};

const md = new MarkdownIt(options);

createRPCServer(encodeTransport(createWorkerTransport(self, (method, args, callback) => {
	if(![ 'render', 'renderInline' ].includes(method)) return callback(new Error('Cannot find method ' + method));
	try{
		const res = md[method](...args);
		callback(null, res)
	} catch(e){
		callback(e)
	}
})));
