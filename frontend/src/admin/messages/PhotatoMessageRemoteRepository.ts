import { convertObjectToQueryString } from '../../website/httpHelper'

export interface PhotatoMessage {
  /** Unique identifier of the message */
  slug: string
  /** Not used publicly, it's just to recognize the message. */
  title: string
  /** The index of the day the message should be sent. Can be negative. 0 is the first Sunday. */
  courseDayIndex: number
  /** One of the `channels` constants */
  channel: string
  /** One of the `emailAudiences` or `facebookAudiences` constants */
  audience: string
  /** E.g. "en-US". */
  locale: string
  /** Only for emails. */
  subject?: string
  /** One of the `contentTypes` constants */
  contentType: string
  /** "text/plain" or "text/html". */
  content: string
}

export default class PhotatoMessageRemoteRepository {
  /**
   * @param url
   * @param accessToken The JWT to pass as the authorization Bearer
   * @param parameters "development", "staging", or "production".
   */
  async getAllPhotatoMessagesFromServer(
    url: string,
    accessToken: string,
    parameters: { environment: string },
  ): Promise<PhotatoMessage[]> {
    const response = await fetch(url + '?' + convertObjectToQueryString(parameters), {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
    return (await response.json()) as PhotatoMessage[]
  }
}
