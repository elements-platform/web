import globalStore from '@/system/global-store'
import { Component } from 'preact'
import { wrap, input, ph } from './styles.module.css'

export default class Input extends Component{
	props = {
		placeholder: ''
	}
	render(){
		const { placeholder } = this.props;
		return <div class={wrap}>
			<input class={input} placeholder=" "></input>
			<div class={ph}>{placeholder}</div>
		</div>
	}
}

export function render(params){
    return <Input {...params}/>
}
