import { Component } from 'preact'
import { block } from './styles.module.css'

export default class Block extends Component{
    props = {}
    render(){
        return <div class={block}></div>
    }
}

export function render(params){
    return <Block {...params}/>
}
