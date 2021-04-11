// @ts-ignore
const raw = import.meta.globEager('./*/index.jsx');

const processed = {}

for(const path in raw){
    processed[path.slice(2, -10)] = raw[path].render
}

export default processed
