import { Component } from 'preact';
import exec from '@/core/builder';

export default class Module extends Component{
	render(){
		const { url } = this.props;
		exec(url);
		return null;
	}
}
