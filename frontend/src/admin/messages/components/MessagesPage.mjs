import React, {useEffect, useState} from '../../../web_modules/react.js';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import MessageRemoteRepository from '../../MessageRemoteRepository.mjs';
import {config} from '../../../config.mjs';
import {useAuth0} from '../../../auth/components/Auth0Provider.mjs';

export default function MessagesPage() {
    const {getTokenSilently} = useAuth0();
    const {__} = useI18n();
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        async function loadMessages() {
            const accessToken = await getTokenSilently();

            const messageRemoteRepository = new MessageRemoteRepository();
            const messagesFromRemote = await messageRemoteRepository.getAllMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.environment})

            setMessages(messagesFromRemote);
        }

        loadMessages().then(() => {});
    }, []);

    const messageListItems = messages ? messages.map(message => <li>{message.title}</li>) : null;

    return <>
        <h1>{__('Messages')}</h1>
        <ul>
            {messageListItems}
        </ul>
    </>;
}