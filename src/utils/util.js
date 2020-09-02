
// TODO: use native Array.find, Array.findIndex when IE support is dropped
export const arrayFindIndex = function (arr, pred) {
  for (let i = 0; i !== arr.length; ++i) {
    if (pred(arr[i])) {
      return i
    }
  }
  return -1
}

export const arrayFind = function (arr, pred) {
  const idx = arrayFindIndex(arr, pred)
  return idx !== -1 ? arr[idx] : undefined
}
