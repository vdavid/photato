<script lang="ts">
    import type {Snippet} from 'svelte';

    /* A link that opens in a new tab and carries the `external` class (which adds the little arrow icon
     * from styles.css). Appends `external` to any class the caller passes. */
    interface Props {
        href?: string;
        class?: string;
        title?: string;
        children?: Snippet;
        [key: string]: unknown;
    }

    let {href, class: className, title, children, ...rest}: Props = $props();

    let computedClass = $derived(className ? [...className.split(/\s+/), 'external'].join(' ') : 'external');
</script>

<a {href} class={computedClass} {title} target="_blank" rel="noopener" {...rest}>{@render children?.()}</a>
