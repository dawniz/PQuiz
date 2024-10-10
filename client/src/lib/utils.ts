export function arrayShuffle<T>(arr: T[]): T[] {
    return arr.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
export function arrayIntersect<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter(val1 => {
        return arr2.indexOf(val1) !== -1;
    });
}
export function getRandomNumber(min: number, max: number): number{
    return Math.floor(min + Math.random() * (max - min + 1));
}
export function arrayCopyReplace(array: Array<any>, index: number, value: any): Array<any>{
    const newArray = [...array];
    // Update the value at the specified index
    newArray[index] = value;
    // Set the state with the new array
    return(newArray);
}
export function stringCapitalize(text: string): string {
    return text[0].toUpperCase() + text.slice(1);
}
export function arrayRandomEntry(array: Array<any>):any {
    return array[getRandomNumber(0, array.length - 1)]
}
export function toBase64(str: string){
    return (typeof window === 'undefined')
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);
}
