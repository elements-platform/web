import createRPCServer from '@/system/rpc/server'
import createRPCClient from '@/system/rpc/client'
import encodeServerTransport from '@/system/rpc/encodings/null/server'
import encodeClientTransport from '@/system/rpc/encodings/null/client'
import createServerTransport from '@/system/rpc/transports/worker/server'
import createClientTransport from '@/system/rpc/transports/worker/client'
import MarkdownIt from 'markdown-it'

// @ts-ignore
const callRemoteMethod = createRPCClient(encodeClientTransport(createClientTransport(self)));

/** @type {MarkdownIt.Options} */
const options = {
    linkify: true,
};

function normalizePathname(pathname){
    return pathname.endsWith('/') ? pathname : (pathname + '/')
}

function processLinks(md, process){
    const defaultRender = md.renderer.rules.link_open ||
        ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
		const { openInNewTab, link } = process(tokens[idx].attrGet('href'));
		tokens[idx].attrSet('href', link);
		if(openInNewTab) tokens[idx].attrSet('target', '_blank');
        return defaultRender(tokens, idx, options, env, self)
    }
}

function identifiedHeadings(md){
    const defaultRender = md.renderer.rules.heading_open ||
        ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    md.renderer.rules.heading_open = (tokens, i, options, env, self) => {
        const id = md.renderer.render(tokens[i + 1].children, md.options).replace(/ /g, '-');
        tokens[i].attrSet('id', id);
        return defaultRender(tokens, i, options, env, self)
    }
}

async function onload(md){
    const apiUrl = await callRemoteMethod('getApiUrl').then(v => new URL(v));
    const location = await callRemoteMethod('getLocation').then(v => new URL(v));
	const elementsProtocol = await callRemoteMethod('getProtocol');
	apiUrl.protocol = elementsProtocol;
    processLinks(md, href => {
        const hrefUrl = new URL(href, apiUrl);
		if(hrefUrl.protocol === elementsProtocol){
			// elements link
			const transformed = new URL(location.origin + hrefUrl.href.slice(elementsProtocol.length + 1));
			return {
				openInNewTab: [
					transformed.origin === location.origin,
					normalizePathname(transformed.pathname) === normalizePathname(location.pathname),
					transformed.search === location.search,
				].includes(false),
				link: transformed,
			}
		}
		return {
			openInNewTab: true,
			link: hrefUrl.href,
		}
    });
    identifiedHeadings(md);
    md.disable('image');
    return md
}

const md = onload(new MarkdownIt(options));

createRPCServer(encodeServerTransport(createServerTransport(self, async (method, args, callback) => {
	if(![ 'render', 'renderInline' ].includes(method)) return callback(new Error('Cannot find method ' + method));
	try{
		callback(null, (await md)[method](...args))
	} catch(e){
		callback(e)
	}
})));
