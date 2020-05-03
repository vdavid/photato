import React, {useEffect, useState} from '../../../web_modules/react.js';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import PhotatoMessageRemoteRepository from '../../PhotatoMessageRemoteRepository.mjs';
import {config} from '../../../config.mjs';
import {useAuth0} from '../../../auth/components/Auth0Provider.mjs';

export default function PhotatoMessagesPage() {
    const {getTokenSilently} = useAuth0();
    const {__} = useI18n();
    const [messages, setMessages] = useState(null);

    /* Load messages on component start */
    useEffect(loadMessages, []);

    /* Render */
    const messageListItems = messages ? messages.map(message =>
        <li>{message.title}</li>) : null;

    return <>
        <h1>{__('Messages')}</h1>
        <button onClick={() => loadMessages(true)}>Re-download all messages</button>
        <ul>
            {messageListItems || <li>Loading items...</li>}
        </ul>
    </>;

    /**
     * @param {boolean} forceDownload
     * @returns {Promise<void>}
     */
    async function loadMessages(forceDownload = false) {
        setMessages(null);
        const locallyStoredMessagesAsString = !forceDownload && sessionStorage.getItem('photatoMessages');
        if (locallyStoredMessagesAsString) {
            setMessages(JSON.parse(locallyStoredMessagesAsString));
        } else {
            await _loadAndStoreMessagesFromRemote();
        }
    }

    async function _loadAndStoreMessagesFromRemote() {
        try {
            const messagesFromRemote = await _getMessagesFromRemote();
            sessionStorage.setItem('photatoMessages', JSON.stringify(messagesFromRemote));
            setMessages(messagesFromRemote);
        } catch (error) {
            console.error('Could not load messages from remote:');
            console.error(error);
        }
    }

    async function _getMessagesFromRemote() {
        const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();

        const accessToken = await getTokenSilently();

        return photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.environment});
    }

}