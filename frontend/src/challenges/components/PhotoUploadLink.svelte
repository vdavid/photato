<script lang="ts">
    import Link from '../../website/components/Link.svelte'

    const { label }: { label: string } = $props()
</script>

<Link to="/upload">{label}</Link>
