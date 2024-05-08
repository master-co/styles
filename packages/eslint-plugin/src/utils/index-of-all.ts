export function indexOfAll(arr: any[] | string, value: any): number[] {
  const result = []
  let i = -1
  while ((i = arr.indexOf(value, i + 1)) !== -1) {
    result.push(i)
  }
  return result
}