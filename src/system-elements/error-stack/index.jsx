import { Component } from 'preact'
import { stack, message } from './styles.module.css'

export default class ErrorStack extends Component{
    render(){
        return <div class={stack}>
            {this.props.stack.map((text, i) =>
                <div class={message} onClick={() => this.messageClick(i)}>
                    <pre>
                        {text}
                    </pre>
                </div>
            )}
        </div>
    }
    messageClick(i){
        this.props.stack.splice(i, 1);
        this.setState({})
    }
}