import { JSXInternal } from 'preact/src/jsx'

type Elements = {
    block: typeof import('./block')
    input: typeof import('./input')
    page: typeof import('./page')
}

type Instance<Class> = Class extends new () => infer T ? T : never

type Strict<T> = {
    [x in keyof T]: T[x]
}

type Descripted<Name extends string, T = any> = {
    [x in (keyof T | 'type')]: (Strict<T> & { type: Name })[x]
}

type Description<Name extends string, Element> = Element extends { props: infer Props } ? Descripted<Name, Props> : never

declare const elements: {
    [element in keyof Elements]: (parameters: Description<element, Instance<Elements[element]['default']>>) => JSXInternal.Element
}

export default elements
