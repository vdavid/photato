import React, {useEffect, useState} from '../../../web_modules/react.js';
import {config} from '../../../config.mjs';
import {useAuth0} from '../../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../../web_modules/react-router-dom.js';
import PhotatoMessageRemoteRepository from '../PhotatoMessageRemoteRepository.mjs';
import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository.mjs';
import {addDaysToDate, toISODateStringWithHHMM} from '../../../website/dateTimeHelper.mjs';

const photatoMessageLocalRepository = new PhotatoMessageLocalRepository();
const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();

export default function PhotatoMessagesPage() {
    const {getTokenSilently} = useAuth0();
    const {__} = useI18n();
    const [/** @type {PhotatoMessage[]} */messages, setMessages] = useState(null);
    console.log(config.course.startDateTime);

    /* Load messages on component start */
    useEffect(() => {
        loadMessages().then(() => {});
    }, []);

    /* Render */
    return <>
        <h1>{__('Messages')}</h1>
        <button onClick={() => loadMessages(true)}>{__('Re-download all messages')}</button>
        {messages ? buildMessagesTable() : <p>Loading items...</p>}
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
            const messagesFromRemote = await photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.environment});
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
            <th>Week #</th>
            <th>Date</th>
            <th>Day #</th>
            <th>Channel</th>
            <th>Audience</th>
            <th>Title</th>
            </thead>
            <tbody>
            {messages.map(message => <tr>
                <td>{getWeekIndexByDayIndex(message.courseDayIndex)}</td>
                <td>{getSendingTimeByDayIndex(message.courseDayIndex)}</td>
                <td>{message.courseDayIndex}</td>
                <td>{message.channel}</td>
                <td>{message.audience}</td>
                <td><NavLink to={'/admin/message/' + message.slug}>{message.title}</NavLink></td>
            </tr>)}
            </tbody>
        </table>;
    }

    function getWeekIndexByDayIndex(dayIndex) {
        return Math.floor((dayIndex - 1) / 7) + 1;
    }

    function getSendingTimeByDayIndex(dayIndex) {
        const date = addDaysToDate(config.course.startDateTime, dayIndex);
        date.setHours(8);
        date.setMinutes(0);
        return toISODateStringWithHHMM(date, config.course.timeZone);
    }
}