import { Component } from 'preact';
import exec from '@/core/builder';

export default class Module extends Component{
	props = {
		url: '',
	}
	render(){
		const { url } = this.props;
		exec(url);
		return null;
	}
}

export function render(params){
	return <Module {...params}/>
}
