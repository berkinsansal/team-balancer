//  Enum Helper
const isString = (value: any) => isNaN(Number(value));
const isNumber = (value: any) => !isNaN(Number(value));

// Turn enum into KEY array
export function enumToKeyArray(enumme: any) {
    return Object.keys(enumme)
        .filter(isNumber)
        .map(key => enumme[key]);
}

// Turn enum into VALUE array
export function enumToValueArray(enumme: any) {
    return Object.keys(enumme)
        .filter(isString)
        .map(key => enumme[key]);
}