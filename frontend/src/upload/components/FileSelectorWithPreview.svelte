<script lang="ts">
    import {__} from '../../i18n/i18n.svelte';
    import OrientationFixer from '../OrientationFixer';

    interface Props {
        selectedFile: File | null;
        selectedFilePreviewUrl: string;
        onFileSelected: (file: File) => void;
        onFileRemoved: () => void;
        isDisabled: boolean;
    }

    let {selectedFile, selectedFilePreviewUrl, onFileSelected, onFileRemoved, isDisabled}: Props = $props();

    const orientationFixer = new OrientationFixer();
    let fileInputRef = $state<HTMLInputElement | null>(null);
    let orientation = $state(1);
    let isImageLoading = $state(false);

    let orientationCss = $derived(orientationFixer.getCssTransformationByOrientationValue(orientation));

    $effect(() => {
        void selectedFilePreviewUrl; /* Re-run when the preview changes. */
        isImageLoading = true;
        void (async () => {
            if (selectedFile) {
                orientation = await orientationFixer.determineOrientation(selectedFile);
            } else {
                orientation = 1;
            }
            isImageLoading = false;
        })();
    });

    function handleRemove(event: MouseEvent) {
        event.preventDefault();
        if (fileInputRef) {
            fileInputRef.value = '';
        }
        onFileRemoved();
    }
</script>

<div class="imageFileSelector">
    <div>
        {#if selectedFilePreviewUrl && !isImageLoading}
            <div class="preview">
                <img src={selectedFilePreviewUrl} style="transform: {orientationCss}" alt="Selected file"/>
            </div>
            <button class="removeButton" onclick={handleRemove} title="Remove photo">x</button>
        {/if}
        {#if !selectedFilePreviewUrl}
            <div class="helpText">
                <p>{__('Click here to select your photo, or drop your photo here')}</p>
            </div>
        {/if}
        {#if isImageLoading}
            <div class="loadingText">
                <p>{__('Loading...')}</p>
            </div>
        {/if}
        <input type="file" name="image" accept="image/jpeg" bind:this={fileInputRef} disabled={isDisabled}
               onchange={(event) => onFileSelected((event.currentTarget as HTMLInputElement).files![0])}/>
    </div>
</div>
