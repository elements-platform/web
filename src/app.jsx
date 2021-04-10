import { ERROR_DISPLAY_TIMEOUT } from '@/constants'
import ErrorStack from '@/system-elements/error-stack'
import API from '@/system/api'
import globalStore from '@/system/global-store'
import render from '@/system/render'
import { Component } from 'preact'

/** @type {import('preact/src/jsx').JSXInternal.Element} */
let currentPage = null;

export default class App extends Component{
	state = {
		errorStack: [],
	}
	componentDidMount(){
		globalStore.set('showError', error => {
			if(typeof error !== 'string' && typeof error.stack === 'string'){
				error = error.stack;
			}
			this.state.errorStack.push(error);
			this.setState({});
			setTimeout(this.removeFirstError.bind(this), ERROR_DISPLAY_TIMEOUT);
		});
		globalStore.set('setPage', page => {
			currentPage = page;
			this.setState({});
		});
	}
	componentWillUnmount(){
		globalStore.set('showError', () => {});
		globalStore.set('setPage', page => currentPage = page);
	}
	removeFirstError(){
		this.state.errorStack.shift();
		this.setState({});
	}
	render(){
		return <>
			{currentPage}
			<ErrorStack stack={this.state.errorStack}/>
		</>
	}
}

API.getIndex().then(render)
