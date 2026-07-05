<script lang="ts">
    import EnlargeableFigure from './EnlargeableFigure.svelte';

    interface Props {
        fileName1: string;
        thumbnailFileName1: string;
        altText1: string;
        caption1?: string;
        fileName2: string;
        thumbnailFileName2: string;
        altText2: string;
        caption2?: string;
    }

    let {fileName1, thumbnailFileName1, altText1, caption1, fileName2, thumbnailFileName2, altText2, caption2}: Props = $props();
</script>

<div class="figures">
    <EnlargeableFigure fileName={fileName1} thumbnailFileName={thumbnailFileName1} altText={altText1} caption={caption1}/>
    <EnlargeableFigure fileName={fileName2} thumbnailFileName={thumbnailFileName2} altText={altText2} caption={caption2}/>
</div>
