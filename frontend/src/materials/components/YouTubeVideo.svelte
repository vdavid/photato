<script lang="ts">
    interface Props {
        /** Full YouTube embed URL, but without parameters. */
        src: string;
        width?: number | string;
        height?: number | string;
    }

    let {src, width = 560, height = 315}: Props = $props();
    // See https://developers.google.com/youtube/player_parameters for more options.
</script>

<div class="youTubeVideoContainer">
    <iframe {width} {height} src={src + '?cc_load_policy=1&cc_lang_pref=hu'} title="YouTube video"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; " allowfullscreen></iframe>
</div>
