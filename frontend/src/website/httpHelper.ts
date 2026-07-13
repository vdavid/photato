/** Serializes an object into an `application/x-www-form-urlencoded` query string,
 * percent-encoding both keys and values. Encoding matters for correctness, not
 * just safety: the Go backend parses these with `r.URL.Query()`, so a bare `+`
 * in an email (e.g. `foo+bar@gmail.com`) would decode to a space and fail the
 * email-match check. `URLSearchParams` encodes `+` as `%2B` and spaces as `+`,
 * which round-trip back correctly on the server. */
export function convertObjectToQueryString(object: object): string {
  const parameters = new URLSearchParams()
  for (const [key, value] of Object.entries(object)) {
    parameters.append(key, String(value))
  }
  return parameters.toString()
}
