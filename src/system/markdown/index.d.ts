import MarkdownIt from 'markdown-it'

export const {
    render,
    renderInline
}: {
    [key in keyof MarkdownIt]: MarkdownIt[key] extends (...args: infer T) => infer R ? (...args: T) => Promise<R> : never
}
