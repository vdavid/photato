<script lang="ts">
    import {config} from '../../../config';
    import {getSessionToken} from '../../../auth/auth.svelte';
    import {__, getActiveLocaleCode} from '../../../i18n/i18n.svelte';
    import NavLinkButton from '../../../website/components/NavLinkButton.svelte';
    import PhotatoMessageRemoteRepository, {type PhotatoMessage} from '../PhotatoMessageRemoteRepository';
    import PhotatoMessageLocalRepository from '../PhotatoMessageLocalRepository';
    import PhotatoMessageLiveContentReplacer from '../PhotatoMessageLiveContentReplacer';
    import {addDaysToDate, toISODateStringWithHHMM} from '../../../website/dateTimeHelper';

    let {slug}: {slug: string} = $props();

    const photatoMessageLocalRepository = new PhotatoMessageLocalRepository();
    const photatoMessageRemoteRepository = new PhotatoMessageRemoteRepository();
    const liveContentReplacer = new PhotatoMessageLiveContentReplacer({
        courseStartDate: config.course.startDateTime,
        signedUpCount: config.course.subscribedStudentCount,
        signUpUrl: config.course.signUpFormUrl,
        facebookGroupUrl: config.course.facebookGroupUrl,
        courseTitle: config.course.titleWithPhotato,
    });

    let message = $state<PhotatoMessage | null>(null);

    $effect(() => {
        const currentSlug = slug;
        message = null;
        void (async () => {
            const loaded = await loadMessageFromLocalOrRemote(currentSlug) as PhotatoMessage;
            loaded.content = liveContentReplacer.replace(loaded.content, getActiveLocaleCode());
            document.title = loaded.title + ' - Photato admin';
            message = loaded;
        })();
    });

    async function loadMessageFromLocalOrRemote(messageSlug: string) {
        if (!await photatoMessageLocalRepository.getAllMessages()) {
            try {
                const accessToken = getSessionToken()!;
                const messagesFromRemote = await photatoMessageRemoteRepository.getAllPhotatoMessagesFromServer(config.backendApi.adminGetAllMessages.url, accessToken, {environment: config.backendApi.environment});
                await photatoMessageLocalRepository.saveMessages(messagesFromRemote);
            } catch (error) {
                console.error('Could not load messages from remote:');
                console.error(error);
            }
        }
        return photatoMessageLocalRepository.getMessageBySlug(messageSlug);
    }

    function getSendingTimeByDayIndex(dayIndex: number): string {
        const date = addDaysToDate(config.course.startDateTime, dayIndex);
        date.setHours(8);
        date.setMinutes(0);
        return toISODateStringWithHHMM(date, config.course.timeZone);
    }
</script>

{#if message}
    <p>
        <NavLinkButton to="/admin/messages">{'←' + __('Back to the list of messages')}</NavLinkButton>
    </p>
    <article>
        <header>
            <h1>{message.title}</h1>
            <div class="metadata">
                <p>Send via <strong>{message.channel}</strong>, to {message.locale}&nbsp;
                    <strong>{message.audience}</strong>. Content type is {message.contentType}.
                </p>
                <p>
                    <strong>Date/time: </strong>{getSendingTimeByDayIndex(message.courseDayIndex)} (Day {message.courseDayIndex} of the course)
                </p>
                {#if message.channel === 'email'}
                    <p>
                        <strong>Subject: </strong>{message.subject}
                    </p>
                {/if}
            </div>
        </header>
        <pre class="photatoMessageContent">{message.content}</pre>
    </article>
    <p>
        <NavLinkButton to="/admin/messages">{'←' + __('Back to the list of messages')}</NavLinkButton>
    </p>
{:else}
    <p>{__('Loading message...')}</p>
    <p>
        <NavLinkButton to="/admin/messages">{'←' + __('Back to the list of messages')}</NavLinkButton>
    </p>
{/if}
