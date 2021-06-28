export default function exec<T extends string>(...args: T extends `${'.' | '..'}/${infer _}` ? [ url: T, base: string ] : [ url: T ]): Promise<void>
