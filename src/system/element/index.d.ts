import { Component } from 'preact'

type BaseProps = {
}

type BaseState = {
}

type ListObject<T> = { [prop in keyof T]: T[prop] }

export default abstract class Element<P = {}, S = {}> extends Component<ListObject<P> & BaseProps, ListObject<S> & BaseState>{}
