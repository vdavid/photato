import type {PhotatoMessage} from './PhotatoMessageRemoteRepository';

export default class PhotatoMessageLocalRepository {
    async getAllMessages(): Promise<PhotatoMessage[] | undefined> {
        const locallyStoredMessagesAsString = sessionStorage.getItem('photatoMessages');
        if (locallyStoredMessagesAsString) {
            return JSON.parse(locallyStoredMessagesAsString);
        } else {
            return undefined;
        }
    }

    async getMessageBySlug(slug: string): Promise<PhotatoMessage | undefined> {
        const messages = await this.getAllMessages();
        return messages ? messages.find(message => message.slug === slug) : undefined;
    }

    async saveMessages(messages: PhotatoMessage[]): Promise<void> {
        sessionStorage.setItem('photatoMessages', JSON.stringify(messages));
    }
}
