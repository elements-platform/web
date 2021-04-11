import elements from '@/elements'
import { interceptErrors } from '@/system/helpers/errors'

export default interceptErrors(function render(description){
    if(typeof description.type !== 'string'){
        throw new TypeError('"type" field is not of type string');
    }
    if(description.type in elements){
        return elements[description.type](description);
    } else {
        throw new TypeError('field "type" is not valid. Valid ones are: ' + Object.keys(elements).join(', '));
    }
})
