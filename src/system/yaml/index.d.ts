import Yaml from 'js-yaml'

declare const yaml: typeof Yaml & {
    FUNCTIONS_SCHEMA: Yaml.Schema
}

export default yaml
