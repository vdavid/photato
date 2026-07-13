<script lang="ts">
    import FullWidthLocalImage from '../../components/FullWidthLocalImage.svelte'
    import PhotoUploadLink from '../../components/PhotoUploadLink.svelte'
    const { formattedDeadline, baseUrl: _baseUrl }: { formattedDeadline: string; baseUrl: string } = $props()
</script>

<p><strong>Röviden:</strong></p>
<p>Ezen a héten egy <strong>önarcképet</strong> várunk tőled. <PhotoUploadLink label="Itt tudod feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>

<p>
    Az utolsó előtti hét feladata egy olyan kép elkészítése, ahol te vagy a tárgy és az alkotó is egyben. Ez lehet egy
    gyors selfie, vagy egy jobban megtervezett, profibb kompozíció is, az elmúlt hetekben tanult technikákat
    felhasználva. A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod majd feltölteni" />.
</p>

<FullWidthLocalImage fileName="gyuri.jpg" altText="Gyuri összeverve" />

<p>
    Gyors emlékeztető: Ha még nem küldted be a múlt heti (esemény) képedet, ma éjfélig még azt is <PhotoUploadLink
        label="megteheted"
    />. 🕚
</p>
<p>Az önarcképeket pedig <PhotoUploadLink label="itt" /> várjuk!</p>

<p>Jó fotózást,</p>

<p>
    --<br />
    a Photato csapata
</p>
