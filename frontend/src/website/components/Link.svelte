<script lang="ts">
    import type { Snippet } from 'svelte'
    import { navigate, isActive } from '../router.svelte'

    /*
     * Client-side navigation link (the old react-router `NavLink`). Renders a real `<a href>` so it's a
     * normal link for middle-click / ctrl-click / crawlers, but a plain left-click navigates in-app.
     * When active, appends `activeClass` to the class list (react-router v5 defaulted that to 'active').
     */
    interface Props {
        to: string
        exact?: boolean
        class?: string
        activeClass?: string
        title?: string
        children?: Snippet
        [key: string]: unknown
    }

    const {
        to,
        exact = false,
        class: className = '',
        activeClass = 'active',
        title,
        children,
        ...rest
    }: Props = $props()

    const active = $derived(isActive(to, { exact }))
    const computedClass = $derived([className, active ? activeClass : ''].filter(Boolean).join(' '))

    function handleClick(event: MouseEvent) {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return
        }
        event.preventDefault()
        navigate(to)
    }
</script>

<a href={to} class={computedClass} {title} onclick={handleClick} {...rest}>{@render children?.()}</a>
