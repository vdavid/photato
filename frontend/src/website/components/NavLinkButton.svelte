<script lang="ts">
    import type {Snippet} from 'svelte';
    import {navigate} from '../router.svelte';

    /* A `<button>` that navigates in-app on click (the old react-router-backed `NavLinkButton`). */
    interface Props {
        to: string;
        disabled?: boolean;
        title?: string;
        class?: string;
        onclick?: (event: MouseEvent) => void;
        children?: Snippet;
        [key: string]: unknown;
    }

    let {to, disabled, title, class: className, onclick, children, ...rest}: Props = $props();

    function handleClick(event: MouseEvent) {
        navigate(to);
        onclick?.(event);
    }
</script>

<button {disabled} {title} class={className} onclick={handleClick} {...rest}>{@render children?.()}</button>
