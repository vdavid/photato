<script lang="ts">
    import { onMount } from 'svelte'
    import { __ } from '../../i18n/i18n.svelte'
    import { config } from '../../config'
    import { getSessionToken } from '../../auth/auth.svelte'
    import { convertObjectToQueryString } from '../../website/httpHelper'
    import Link from '../../website/components/Link.svelte'

    let version = $state('Loading from server...')

    $effect(() => {
        document.title = 'Admin - Photato admin'
    })

    onMount(async () => {
        version = await getVersionFromServer()
    })

    async function getVersionFromServer(): Promise<string> {
        const url = config.backendApi.version.url
        const accessToken = getSessionToken()
        try {
            const response = await fetch(
                url + '?' + convertObjectToQueryString({ environment: config.backendApi.environment }),
                {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: { Authorization: 'Bearer ' + String(accessToken) },
                },
            )
            return (await response.text()) || 'Bad response from server.'
        } catch {
            return `Unknown, could not reach back end. (URL: ${url})`
        }
    }
</script>

<p><Link to="/admin/photos">{__('Photos')}</Link></p>
<p><Link to="/admin/messages">{__('Messages')}</Link></p>
<p><Link to="/admin/sitemap-generator">{__('Sitemap generator')}</Link></p>
<p>Back end version: {version}</p>
