export function getRandomNumber(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}
export function arrayShuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
export function isArrayUnique(value, index, array) {
  return array.indexOf(value) === array.lastIndexOf(value);
}
