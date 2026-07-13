<script lang="ts">
    import { __ } from '../../i18n/i18n.svelte'
    import { twemoji } from '../twemoji'
    import ExternalLink from '../../materials/components/ExternalLink.svelte'
</script>

<footer>
    <div class="copyright" use:twemoji>{__('Made with ❤️ by the Photato team')}</div>
    <div class="social">
        <ExternalLink
            href="https://www.facebook.com/photato12/"
            class="facebook icon"
            title={__('Photato’s Facebook page')}
        />
        <ExternalLink
            href="https://www.instagram.com/photatocourse/"
            class="instagram icon"
            title={__('Photato’s Instagram')}
        />
    </div>
</footer>
