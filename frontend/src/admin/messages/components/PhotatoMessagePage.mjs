import React, {useEffect, useState} from '../../../web_modules/react.js';
import {config} from '../../../config.mjs';
import {useAuth0} from '../../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import {useParams} from '../../../web_modules/react-router-dom.js';

import NavLinkButton from '../../../website/components/NavLinkButton.mjs';
import PhotatoMessageRemoteRepository from '../PhotatoMessageRemoteRepository.mjs';
import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository.mjs';

const photatoMessageLocalRepository = new PhotatoMessageLocalRepository();
const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();

export default function PhotatoMessagePage() {
    /* Get page parameters */
    const {slug} = useParams();

    const {getTokenSilently} = useAuth0();
    const {__} = useI18n();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setMessage(null);

        async function loadMessage() {
            const message = await loadMessageFromLocalOrRemote(slug);
            setMessage(message);
        }

        loadMessage().then(() => {});
    }, [slug]);

    return message
        ? <>
            <NavLinkButton to='/admin/messages'>{'←' + __('Back to the list of messages')}</NavLinkButton>
            <article>
                <header>
                    <h1>{message.title}</h1>
                </header>
                <pre>
                {message.content}
                </pre>
            </article>
            <NavLinkButton to='/admin/messages'>{'←' + __('Back to the list of messages')}</NavLinkButton>
        </>
        : <>
            <p>{__('Loading message...')}</p>
            <NavLinkButton to='/admin/messages'>{'←' + __('Back to the list of messages')}</NavLinkButton>
        </>;

    async function loadMessageFromLocalOrRemote(slug) {
        if (!await photatoMessageLocalRepository.getAllMessages()) {
            try {
                const accessToken = await getTokenSilently();
                const messagesFromRemote = await photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.environment});
                await photatoMessageLocalRepository.saveMessages(messagesFromRemote);
            } catch (error) {
                console.error('Could not load messages from remote:');
                console.error(error);
            }
        }
        return photatoMessageLocalRepository.getMessageBySlug(slug);
    }
}