<script lang="ts">
    import FullWidthLocalImage from '../../components/FullWidthLocalImage.svelte';
    import PhotoUploadLink from '../../components/PhotoUploadLink.svelte';
    let {formattedDeadline, baseUrl}: {formattedDeadline: string; baseUrl: string} = $props();
</script>

<p><strong>Röviden:</strong></p>
<p>A 10. héten egy <strong>eseményfotót</strong> várunk tőled, <PhotoUploadLink label="itt tudod feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>
<FullWidthLocalImage fileName="concert.jpg" altText="Koncert Buffalo WY" />
<p>Megint egy könnyedebb, de sokakat érintő témával jövünk: csoportos események fényképezésével. Legyen az buli, családi összejövetel, esküvő vagy koncert, valószínűleg sokan fognak kattogtatni közben a telefonjukkal, köztük talán te is. Megpróbálunk segíteni, hogy minél jobb fotókat lőj az ilyen helyzetekben. A legjobb képed ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod majd feltölteni" />.</p>


<p>Ha még nem küldted be a múlt heti (portré) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
<p>Az eseményfotókat pedig <PhotoUploadLink label="itt várjuk" />!</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
