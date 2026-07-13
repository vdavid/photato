export function convertObjectToQueryString(object: object): string {
  return Object.entries(object)
    .map(([key, value]) => key + '=' + String(value))
    .join('&')
}
