<script lang="ts">
    import { onMount } from 'svelte'
    import { config } from '../../../config'
    import { getSessionToken } from '../../../auth/auth.svelte'
    import { __ } from '../../../i18n/i18n.svelte'
    import Link from '../../../website/components/Link.svelte'
    import PhotatoMessageRemoteRepository, { type PhotatoMessage } from '../PhotatoMessageRemoteRepository'
    import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository'
    import { addDaysToDate, toISODateStringWithHHMM, getDifferenceInDays } from '../../../website/dateTimeHelper'

    const photatoMessageLocalRepository = new PhotatoMessageLocalRepository()
    const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository()

    let messages = $state<PhotatoMessage[] | null>(null)

    onMount(() => {
        void loadMessages()
        document.title = __('Messages') + ' - Photato admin'
    })

    async function loadMessages(forceDownload = false) {
        messages = null
        const localMessages = !forceDownload && (await photatoMessageLocalRepository.getAllMessages())
        if (localMessages) {
            messages = localMessages
        } else {
            await loadAndStoreMessagesFromRemote()
        }
    }

    async function loadAndStoreMessagesFromRemote() {
        try {
            const accessToken = getSessionToken()
            if (accessToken === null) {
                throw new Error('No session token available')
            }
            const messagesFromRemote = await photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(
                config.backendApi.adminGetAllMessages.url,
                accessToken,
                { environment: config.backendApi.environment },
            )
            await photatoMessageLocalRepository.saveMessages(messagesFromRemote)
            messages = messagesFromRemote
        } catch (error) {
            console.error('Could not load messages from remote:')
            console.error(error)
        }
    }

    function getWeekIndexByDayIndex(dayIndex: number): number {
        return Math.floor((dayIndex - 1) / 7) + 1
    }

    function getSendingTimeByDayIndex(dayIndex: number): string {
        const date = addDaysToDate(config.course.startDateTime, dayIndex)
        date.setHours(8)
        date.setMinutes(0)
        return toISODateStringWithHHMM(date, config.course.timeZone)
    }

    function rowClassName(message: PhotatoMessage): string {
        const date = addDaysToDate(config.course.startDateTime, message.courseDayIndex)
        const differenceInDays = getDifferenceInDays(new Date(), date)
        return differenceInDays === 0 ? 'today' : differenceInDays >= 1 && differenceInDays <= 2 ? 'soon' : ''
    }
</script>

<h1>{__('Messages')}</h1>
<p>
    <button onclick={() => loadMessages(true)}>{__('Re-download all messages')}</button>
</p>
{#if messages}
    <table class="photatoMessages">
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
            {#each messages as message (message.slug)}
                <tr class={rowClassName(message)}>
                    <td>{getWeekIndexByDayIndex(message.courseDayIndex)}</td>
                    <td>{getSendingTimeByDayIndex(message.courseDayIndex)}</td>
                    <td>{message.courseDayIndex}</td>
                    <td>{message.channel}</td>
                    <td>{message.audience}</td>
                    <td>
                        <Link to={'/admin/message/' + message.slug}>{message.title}</Link>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Loading items...</p>
{/if}
