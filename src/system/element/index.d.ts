import { Component } from 'preact'
import API from '@/system/api'

type BaseProps = {
    api: API
}

type BaseState = {
}

type ListObject<T> = { [prop in keyof T]: T[prop] }

export default abstract class Element<P = {}, S = {}> extends Component<ListObject<P> & BaseProps, ListObject<S> & BaseState>{}
