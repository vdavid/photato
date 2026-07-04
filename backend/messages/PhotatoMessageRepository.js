const {photatoMessages} = require('./photato-messages.js');

class PhotatoMessageRepository {
    /**
     * @returns {PhotatoMessage[]}
     */
    getAllMessages() {
        return photatoMessages;
    }
}

module.exports = PhotatoMessageRepository;