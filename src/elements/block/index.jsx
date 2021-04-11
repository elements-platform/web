import { Component } from 'preact'
import { block } from './styles.module.css'
import render from '@/system/render'

export default class Block extends Component{
    props = {
        children: []
    }
    render(){
        return <div class={block}>
            {this.props.children.map(render)}
        </div>
    }
}

function renderBlock(params){
    return <Block {...params}/>
}

export {
    renderBlock as render
}
