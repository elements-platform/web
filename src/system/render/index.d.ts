import elements from '@/elements'
import { JSXInternal } from 'preact/src/jsx'

type Values<T> = T[keyof T]

type Params<T> = {
    [x in keyof T]: T[x] extends (params: infer T) => JSXInternal.Element ? T : never
}

type Description = Values<Params<typeof elements>>

export default function render(description: Description): JSXInternal.Element
