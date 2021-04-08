// @ts-ignore
import Worker from './api?worker'
import createRPCClient from '@/system/rpc/client'
import encodeClientTransport from '@/system/rpc/encodings/null/client'
import createClientTransport from '@/system/rpc/transports/worker/client'
import Hostname from '@/system/hostname'

const serviceLink = new URL('https://' + location.href.slice(location.origin.length + 1));

if(new Hostname(serviceLink.hostname).local) serviceLink.protocol = 'http:';

const worker = new Worker;

const callMethod = createRPCClient(encodeClientTransport(createClientTransport(worker)));

export function getApiUrl(){
	let link = serviceLink.origin + serviceLink.pathname;
	if(link[link.length - 1] !== '/') link = link + '/';
	return link;
}

export default new class API{
	constructor(apiBaseLink = getApiUrl()){
		return new Proxy(Object.create(API.prototype), {
			get(_, method){
				if(typeof method === 'string' && !(method in _)) _[method] = callMethod.bind(null, method, apiBaseLink);
				return _[method];
			},
			has(_, p){
				return typeof p === 'string' || p in _;
			},
		})
	}
}
