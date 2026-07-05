<script lang="ts">
    import type {Snippet} from 'svelte';
    import Link from './Link.svelte';

    interface Props {
        to: string;
        exact?: boolean;
        iconName?: string;
        children?: Snippet;
    }

    let {to, exact = false, iconName, children}: Props = $props();
</script>

<Link {to} {exact} class="menuItem" activeClass="active"><span class="icon material-icons">{iconName}</span><span class="title">{@render children?.()}</span></Link>
