import React, {useEffect, useState} from 'react';
import {config} from '../../../config';
import {useAuth0} from '../../../auth/components/Auth0Provider';
import {useI18n} from '../../../i18n/components/I18nProvider';
import {NavLink} from 'react-router-dom';
import PhotatoMessageRemoteRepository from '../PhotatoMessageRemoteRepository';
import type {PhotatoMessage} from '../PhotatoMessageRemoteRepository';
import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository';
import {addDaysToDate, toISODateStringWithHHMM, getDifferenceInDays} from '../../../website/dateTimeHelper';

const photatoMessageLocalRepository = new PhotatoMessageLocalRepository();
const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();

export default function PhotatoMessagesPage() {
    const {getTokenSilently} = useAuth0();
    const {__} = useI18n();
    const [messages, setMessages] = useState<PhotatoMessage[] | null>(null);

    /* Load messages on component start */
    useEffect(() => {
        loadMessages().then(() => {});
        document.title = __('Messages') + ' - Photato admin';
    }, []);

    /* Render */
    return <>
        <h1>{__('Messages')}</h1>
        <p>
            <button onClick={() => loadMessages(true)}>{__('Re-download all messages')}</button>
        </p>
        {messages ? buildMessagesTable() :
            <p>Loading items...</p>}
    </>;

    /**
     * @param {boolean} forceDownload
     * @returns {Promise<void>}
     */
    async function loadMessages(forceDownload = false) {
        setMessages(null);
        const localMessages = !forceDownload && await photatoMessageLocalRepository.getAllMessages();
        if (localMessages) {
            setMessages(localMessages);
        } else {
            await _loadAndStoreMessagesFromRemote();
        }
    }

    async function _loadAndStoreMessagesFromRemote() {
        try {
            const accessToken = await getTokenSilently();
            const messagesFromRemote = await photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.backendApi.environment});
            await photatoMessageLocalRepository.saveMessages(messagesFromRemote);
            setMessages(messagesFromRemote);
        } catch (error) {
            console.error('Could not load messages from remote:');
            console.error(error);
        }
    }

    function buildMessagesTable() {
        return <table className="photatoMessages">
            <thead>
            <tr>
                <th>Week #</th>
                <th>Date</th>
                <th>Day #</th>
                <th>Channel</th>
                <th>Audience</th>
                <th>Title</th>
            </tr>
            </thead>
            <tbody>
            {messages!.map(buildMessagesTableRow)}
            </tbody>
        </table>;
    }

    function buildMessagesTableRow(message: PhotatoMessage, index: number) {
        const date = addDaysToDate(config.course.startDateTime, message.courseDayIndex);
        const differenceInDays = getDifferenceInDays(new Date(), date);
        const className = (differenceInDays === 0) ? 'today' : ((differenceInDays >= 1) && ((differenceInDays <= 2)) ? 'soon' : '');
        return <tr className={className} key={index}>
            <td>{getWeekIndexByDayIndex(message.courseDayIndex)}</td>
            <td>{getSendingTimeByDayIndex(message.courseDayIndex)}</td>
            <td>{message.courseDayIndex}</td>
            <td>{message.channel}</td>
            <td>{message.audience}</td>
            <td>
                <NavLink to={'/admin/message/' + message.slug}>{message.title}</NavLink>
            </td>
        </tr>;
    }

    function getWeekIndexByDayIndex(dayIndex: number): number {
        return Math.floor((dayIndex - 1) / 7) + 1;
    }

    function getSendingTimeByDayIndex(dayIndex: number): string {
        const date = addDaysToDate(config.course.startDateTime, dayIndex);
        date.setHours(8);
        date.setMinutes(0);
        return toISODateStringWithHHMM(date, config.course.timeZone);
    }
}