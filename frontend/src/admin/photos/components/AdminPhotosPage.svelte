<script lang="ts">
    import { config } from '../../../config'
    import { getSessionToken } from '../../../auth/auth.svelte'
    import { __, getActiveLocaleCode } from '../../../i18n/i18n.svelte'
    import PhotoRemoteRepository, { type S3PhotoMetadata } from '../PhotoRemoteRepository'
    import ExternalLink from '../../../materials/components/ExternalLink.svelte'
    import { courseData } from '../../../challenges/courseData'

    const photoRemoteRepository = new PhotoRemoteRepository()
    const weekCount = config.course.weekCount
    const weekIndexes = Array.from(Array(weekCount), (value, key) => key + 1)

    let photos = $state<S3PhotoMetadata[] | null>([])
    let weekIndex = $state<number | string>(courseData.currentWeekIndex)

    $effect(() => {
        document.title = __('Photos') + ' - Photato admin'
    })

    async function loadPhotos(includeTitleAndContentType = false) {
        photos = null
        try {
            const accessToken = getSessionToken()
            if (accessToken === null) {
                throw new Error('No session token available')
            }
            photos = await photoRemoteRepository.getAllPhotosForWeek({
                url: config.backendApi.adminListPhotosForWeek.url,
                accessToken,
                environment: config.backendApi.environment,
                courseName: config.course.name,
                weekIndex: weekIndex as number,
                includeTitleAndContentType,
            })
        } catch (error) {
            console.error('Could not load photos from remote:')
            console.error(error)
        }
    }
</script>

<h1>Photos for week #{weekIndex}</h1>
<h2>Choose week</h2>
<div class="weekIndexSelector">
    {#each weekIndexes as week (week)}
        <a
            href=""
            data-value={week}
            onclick={(event) => {
                event.preventDefault()
                weekIndex = (event.currentTarget as HTMLElement).getAttribute('data-value') ?? ''
            }}>{week}</a
        >
    {/each}
</div>
<p>
    <button onclick={() => loadPhotos()}>Download photo info without titles (faster)</button>
    <button onclick={() => loadPhotos(true)}>Download photo info with titles (slower)</button>
</p>
{#if photos}
    <table class="adminPhotoListForWeek">
        <thead>
            <tr>
                <th>Email address</th>
                <th>Title</th>
                <th>Content type</th>
                <th>Size (in bytes)</th>
                <th>Upload date</th>
                <th>Link</th>
            </tr>
        </thead>
        <tbody>
            {#each photos as photo, index (index)}
                <tr>
                    <td>{photo.emailAddress}</td>
                    <td>{photo.title === undefined ? '(Not retrieved)' : photo.title}</td>
                    <td>{photo.contentType === undefined ? '(Not retrieved)' : photo.contentType}</td>
                    <td>{new Intl.NumberFormat(getActiveLocaleCode()).format(photo.sizeInBytes)}</td>
                    <td>{new Intl.DateTimeFormat(getActiveLocaleCode()).format(photo.lastModifiedDate)}</td>
                    <td>
                        <ExternalLink href={photo.url}>Link</ExternalLink>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    <p>Total uploaded photos: {photos.length}</p>
{:else}
    <p>Loading data...</p>
{/if}
