const {photatoMessages} = require('./photato-messages.js');

module.exports = class MessageRepository {
    /**
     * @returns {PhotatoMessage[]}
     */
    getAllMessages() {
        return photatoMessages;
    }
};