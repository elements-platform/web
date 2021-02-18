import Element from '@/system/element'
import { wrap, input, ph } from './styles.module.css'

export default class Input extends Element{
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
