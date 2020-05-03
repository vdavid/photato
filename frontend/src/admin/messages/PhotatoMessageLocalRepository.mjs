export default class PhotatoMessageLocalRepository {
    /**
     * @returns {Promise<PhotatoMessage[]|undefined>}
     */
    async getAllMessages() {
        const locallyStoredMessagesAsString = sessionStorage.getItem('photatoMessages');
        if (locallyStoredMessagesAsString) {
            return JSON.parse(locallyStoredMessagesAsString);
        } else {
            return undefined;
        }
    }

    /**
     * @param {string} slug
     * @returns {Promise<PhotatoMessage|undefined>}
     */
    async getMessageBySlug(slug) {
        const messages = await this.getAllMessages();
        return messages ? messages.find(message => message.slug === slug) : undefined;
    }

    /**
     *
     * @param {PhotatoMessage[]} messages
     * @returns {Promise<void>}
     */
    async saveMessages(messages) {
        sessionStorage.setItem('photatoMessages', JSON.stringify(messages));
    }
}
