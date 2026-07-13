<script lang="ts">
    import { __ } from '../../i18n/i18n.svelte'

    interface Props {
        title: string
        isDisabled: boolean
        onChange: (title: string) => void
    }

    const { title, isDisabled, onChange }: Props = $props()
</script>

<div class="title">
    <input
        type="text"
        name="title"
        maxlength="150"
        placeholder={__('Give your photo a title (optional)')}
        disabled={isDisabled}
        value={title}
        oninput={(event) => {
            onChange(event.currentTarget.value)
        }}
    />
</div>
