// @ts-check
import Hostname from '@/system/hostname'

const serviceLink = new URL('https://' + location.href.slice(location.origin.length + 1));

if(new Hostname(serviceLink.hostname).local) serviceLink.protocol = 'http:';

export function getApiUrl(){
	return serviceLink.origin + serviceLink.pathname
}
