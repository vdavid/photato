import type { PhotatoMessage } from './PhotatoMessageRemoteRepository'

export default class PhotatoMessageLocalRepository {
  getAllMessages(): Promise<PhotatoMessage[] | undefined> {
    const locallyStoredMessagesAsString = sessionStorage.getItem('photatoMessages')
    if (locallyStoredMessagesAsString) {
      return Promise.resolve(JSON.parse(locallyStoredMessagesAsString) as PhotatoMessage[])
    } else {
      return Promise.resolve(undefined)
    }
  }

  async getMessageBySlug(slug: string): Promise<PhotatoMessage | undefined> {
    const messages = await this.getAllMessages()
    return messages ? messages.find((message) => message.slug === slug) : undefined
  }

  saveMessages(messages: PhotatoMessage[]): Promise<void> {
    sessionStorage.setItem('photatoMessages', JSON.stringify(messages))
    return Promise.resolve()
  }
}
