import React, {useEffect, useRef, useState} from '../../../web_modules/react.js';
import {config} from '../../../config.mjs';
import {useAuth0} from '../../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import {useParams} from '../../../web_modules/react-router-dom.js';

import NavLinkButton from '../../../website/components/NavLinkButton.mjs';
import PhotatoMessageRemoteRepository from '../PhotatoMessageRemoteRepository.mjs';
import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository.mjs';
import PhotatoMessageLiveContentReplacer from '../PhotatoMessageLiveContentReplacer.mjs';
import {addDaysToDate, toISODateStringWithHHMM} from '../../../website/dateTimeHelper.mjs';

const photatoMessageLocalRepository = new PhotatoMessageLocalRepository();
const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();

export default function PhotatoMessagePage() {
    /* Get page parameters */
    const {slug} = useParams();

    const {getTokenSilently} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const [message, setMessage] = useState(null);
    const photatoMessageLiveContentReplacerRef = useRef(new PhotatoMessageLiveContentReplacer({
        courseStartDate: config.course.startDateTime,
        signedUpCount: config.course.subscribedStudentCount, // TODO: Make this dynamic someday
        signUpUrl: config.course.signupFormUrl,
        facebookGroupUrl: config.course.facebookGroupUrl,
        courseTitle: config.course.title,
    }));

    useEffect(() => {
        setMessage(null);

        async function loadMessage() {
            const message = await loadMessageFromLocalOrRemote(slug);
            message.content = photatoMessageLiveContentReplacerRef.current.replace(message.content, getActiveLocaleCode());
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
                    <div className="metadata">
                        <p>Send via <strong>{message.channel}</strong>, to {message.locale} <strong>{message.audience}</strong>. Content type is {message.contentType}.</p>
                        <p><strong>Date/time: </strong>{getSendingTimeByDayIndex(message.courseDayIndex)} (Day {message.courseDayIndex} of the course)</p>
                        {message.channel ==='email' ? <p><strong>Subject: </strong>{message.subject}</p> : null}
                    </div>
                </header>
                <pre className="photatoMessageContent">
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

    /**
     * @param {int} dayIndex
     * @returns {string}
     */
    function getSendingTimeByDayIndex(dayIndex) {
        const date = addDaysToDate(config.course.startDateTime, dayIndex);
        date.setHours(8);
        date.setMinutes(0);
        return toISODateStringWithHHMM(date, config.course.timeZone);
    }
}