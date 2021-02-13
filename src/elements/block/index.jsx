import Element from '@/system/element'
import { block } from './styles.module.css'

export default class Block extends Element{
    render(){
        return <div class={block}></div>
    }
}
