import React, {useEffect, useRef, useState} from 'react';
import {config} from '../../../config';
import {useAuth0} from '../../../auth/components/Auth0Provider';
import {useI18n} from '../../../i18n/components/I18nProvider';
import {useParams} from 'react-router-dom';

import NavLinkButton from '../../../website/components/NavLinkButton';
import PhotatoMessageRemoteRepository from '../PhotatoMessageRemoteRepository';
import type {PhotatoMessage} from '../PhotatoMessageRemoteRepository';
import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository';
import PhotatoMessageLiveContentReplacer from '../PhotatoMessageLiveContentReplacer';
import {addDaysToDate, toISODateStringWithHHMM} from '../../../website/dateTimeHelper';

const photatoMessageLocalRepository = new PhotatoMessageLocalRepository();
const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();

export default function PhotatoMessagePage() {
    /* Get page parameters */
    const {slug} = useParams<{slug: string}>();

    const {getTokenSilently} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const [message, setMessage] = useState<PhotatoMessage | null>(null);
    const photatoMessageLiveContentReplacerRef = useRef(new PhotatoMessageLiveContentReplacer({
        courseStartDate: config.course.startDateTime,
        signedUpCount: config.course.subscribedStudentCount, // TODO: Make this dynamic someday
        signUpUrl: config.course.signUpFormUrl,
        facebookGroupUrl: config.course.facebookGroupUrl,
        courseTitle: config.course.titleWithPhotato,
    }));

    useEffect(() => {
        setMessage(null);

        async function loadMessage() {
            const message = await loadMessageFromLocalOrRemote(slug) as PhotatoMessage;
            message.content = photatoMessageLiveContentReplacerRef.current.replace(message.content, getActiveLocaleCode());
            document.title = message.title + ' - Photato admin';
            setMessage(message);
        }

        loadMessage().then(() => {});
    }, [slug]);

    return message
        ? <>
            <p>
                <NavLinkButton to='/admin/messages'>{'←' + __('Back to the list of messages')}</NavLinkButton>
            </p>
            <article>
                <header>
                    <h1>{message.title}</h1>
                    <div className="metadata">
                        <p>Send via <strong>{message.channel}</strong>, to {message.locale}&nbsp;
                            <strong>{message.audience}</strong>. Content type is {message.contentType}.
                        </p>
                        <p>
                            <strong>Date/time: </strong>{getSendingTimeByDayIndex(message.courseDayIndex)} (Day {message.courseDayIndex} of the course)
                        </p>
                        {message.channel === 'email' ?
                            <p>
                                <strong>Subject: </strong>{message.subject}
                            </p> : null}
                    </div>
                </header>
                <pre className="photatoMessageContent">
                    {message.content}
                </pre>
            </article>
            <p>
                <NavLinkButton to='/admin/messages'>{'←' + __('Back to the list of messages')}</NavLinkButton>
            </p>
        </>
        : <>
            <p>{__('Loading message...')}</p>
            <p>
                <NavLinkButton to='/admin/messages'>{'←' + __('Back to the list of messages')}</NavLinkButton>
            </p>
        </>;

    async function loadMessageFromLocalOrRemote(slug: string) {
        if (!await photatoMessageLocalRepository.getAllMessages()) {
            try {
                const accessToken = await getTokenSilently();
                const messagesFromRemote = await photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.backendApi.environment});
                await photatoMessageLocalRepository.saveMessages(messagesFromRemote);
            } catch (error) {
                console.error('Could not load messages from remote:');
                console.error(error);
            }
        }
        return photatoMessageLocalRepository.getMessageBySlug(slug);
    }

    function getSendingTimeByDayIndex(dayIndex: number): string {
        const date = addDaysToDate(config.course.startDateTime, dayIndex);
        date.setHours(8);
        date.setMinutes(0);
        return toISODateStringWithHHMM(date, config.course.timeZone);
    }
}