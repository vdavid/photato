<script lang="ts">
    import { config } from '../../config'
    import { getActiveLocaleCode } from '../../i18n/i18n.svelte'
    import { getMaterialContext } from './materialContext'

    interface Props {
        fileName1: string
        fileName2: string
        caption?: string
        /** Optional CSS width. Default "600px". */
        width?: string
    }

    const { fileName1, fileName2, caption, width = '600px' }: Props = $props()

    const getMetadata = getMaterialContext()
    const imageBaseUrl = $derived(
        config.contentImages.thirdPartyArticlesBaseUrl +
            getActiveLocaleCode().substring(0, 2) +
            '/' +
            getMetadata().slug +
            '/',
    )

    let primaryImageRef = $state<HTMLImageElement | null>(null)
    let sliderRef = $state<HTMLDivElement | null>(null)

    let imageWidth = $state(0)
    let imageHeight = $state(0)
    let sliderXPercent = $state(0.5)
    let componentX = $state(0)
    let isDragging = $state(false)

    const sliderTop = $derived(imageHeight / 2 - (sliderRef?.offsetHeight ?? 0) / 2)
    const sliderX = $derived(sliderXPercent * imageWidth)

    $effect(() => {
        const slider = sliderRef
        if (slider) {
            slider.addEventListener('mousedown', startDragging)
            slider.addEventListener('touchstart', startDragging)
            window.addEventListener('resize', updateImageDimensions)
            return () => {
                slider.removeEventListener('mousedown', startDragging)
                slider.removeEventListener('touchstart', startDragging)
                window.removeEventListener('resize', updateImageDimensions)
            }
        }
    })

    function updateImageDimensions() {
        if (!primaryImageRef) return
        componentX = primaryImageRef.getBoundingClientRect().left
        imageWidth = primaryImageRef.offsetWidth || 0
        imageHeight = primaryImageRef.offsetHeight || 0
    }

    function startDragging(event: Event) {
        if (!isDragging) {
            event.preventDefault()
            window.addEventListener('mousemove', drag)
            window.addEventListener('touchmove', drag)
            window.addEventListener('mouseup', endDragging)
            window.addEventListener('touchstop', endDragging)
            isDragging = true
        }
    }

    function drag(event: MouseEvent | TouchEvent) {
        if (isDragging) {
            const cursorXRelativeToImage = (event as MouseEvent).pageX - componentX - window.scrollX
            sliderXPercent = Math.min(Math.max(cursorXRelativeToImage, 0), imageWidth) / imageWidth
        }
    }

    function endDragging() {
        window.removeEventListener('mousemove', drag)
        window.removeEventListener('touchmove', drag)
        window.removeEventListener('mouseup', endDragging)
        window.removeEventListener('touchstop', endDragging)
        isDragging = false
    }
</script>

<div class="imageComparison" style="width: {width}">
    <figure>
        <div class="primary">
            <img
                bind:this={primaryImageRef}
                src={imageBaseUrl + fileName1}
                alt="Image 1"
                onload={updateImageDimensions}
            />
        </div>
        <div bind:this={sliderRef} class="slider" style="left: {sliderX}px; top: {sliderTop}px"></div>
        <div class="overlay" style="left: {sliderX}px; width: {imageWidth - sliderX}px">
            <img src={imageBaseUrl + fileName2} alt="Image 2" />
        </div>
    </figure>
    {#if caption}<figcaption>{caption}</figcaption>{/if}
</div>
