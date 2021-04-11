import globalStore from '@/system/global-store'
import { Component } from 'preact'
import render from '@/system/render'
import { getApiUrl } from '@/system/api';

const iconElement = document.head.querySelector('link[rel="shortcut icon"]'),
	titleElement = document.head.querySelector('title'),
	defaultIcon = iconElement.getAttribute('href'),
	defaultTitle = titleElement.innerText;

export default class Page extends Component{
	props = {
		title: '',
		icon: '',
		children: [],
	}
	render(){
		const { children, title, icon } = this.props;
		titleElement.innerText = title || defaultTitle;
		iconElement.setAttribute('href', icon ? new URL(icon, getApiUrl()).href : defaultIcon);
		return children.map(render)
	}
}

function renderPage(params){
	globalStore.get('setPage')(<Page {...params}/>)
	return null
}

export {
	renderPage as render
}
