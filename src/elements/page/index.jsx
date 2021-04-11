import globalStore from '@/system/global-store'
import { Component } from 'preact'
import render from '@/system/render'

export default class Page extends Component{
	props = {
		title: '',
		icon: '',
		children: [],
	}
	render(){
		const { children } = this.props;
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
