import { describe, expect, it } from 'vitest'
import { convertObjectToQueryString } from './httpHelper'

/* The Go backend parses these with `r.URL.Query()`, which follows
 * `application/x-www-form-urlencoded` rules: `+` decodes to a space and `%2B`
 * decodes to `+`. So the query string must percent-encode `+` (and every other
 * reserved character) or values round-trip wrong on the server. These tests pin
 * the encoding that keeps the round-trip honest. */
describe('convertObjectToQueryString', () => {
  it('encodes a "+"-address email so the backend decodes it back to "+"', () => {
    const queryString = convertObjectToQueryString({ emailAddress: 'foo+bar@gmail.com' })

    // The literal `+` must be `%2B`, not a bare `+` (which the backend would read as a space).
    expect(queryString).toBe('emailAddress=foo%2Bbar%40gmail.com')
    expect(new URLSearchParams(queryString).get('emailAddress')).toBe('foo+bar@gmail.com')
  })

  it('round-trips a title with a space alongside a "+"-address email', () => {
    const queryString = convertObjectToQueryString({
      emailAddress: 'foo+bar@gmail.com',
      title: 'my title',
    })

    // A real space serializes as `+` (form-urlencoded), which the backend decodes back to a space.
    expect(queryString).toBe('emailAddress=foo%2Bbar%40gmail.com&title=my+title')
    const parsed = new URLSearchParams(queryString)
    expect(parsed.get('emailAddress')).toBe('foo+bar@gmail.com')
    expect(parsed.get('title')).toBe('my title')
  })

  it('encodes reserved characters "&" and "=" in a value without corrupting the query', () => {
    const queryString = convertObjectToQueryString({ title: 'a&b=c' })

    expect(queryString).toBe('title=a%26b%3Dc')
    expect(new URLSearchParams(queryString).get('title')).toBe('a&b=c')
  })

  it('serializes non-string values (e.g. a numeric weekIndex) as their string form', () => {
    const queryString = convertObjectToQueryString({ courseName: 'hu-4', weekIndex: 2 })

    expect(queryString).toBe('courseName=hu-4&weekIndex=2')
  })
})
