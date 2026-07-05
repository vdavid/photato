<script lang="ts">
    import {__, getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import ExternalLink from '../../materials/components/ExternalLink.svelte';
    import Link from '../../website/components/Link.svelte';

    $effect(() => {document.title = __('Contact') + ' - Photato';});
</script>

{#if getActiveLocaleCode() === 'hu-HU'}
        <h1>Kapcsolat 🥔🤙</h1>
        <p>Elérsz minket:</p>
        <ul>
            <li>E-mailben: <a href="mailto:photatophotato@gmail.com">photatophotato@gmail.com</a>
            </li>
            <li>Facebookon: <ExternalLink href="https://fb.com/photatophotato">https://fb.com/photatophotato</ExternalLink>
            </li>
            <li>Instagramon: <ExternalLink href="https://www.instagram.com/photatocourse">https://www.instagram.com/photatocourse</ExternalLink>
            </li>
        </ul>

        <p>Segíts, ha van kedved:</p>
        <ul>
            <li>
                <a href="mailto:photatophotato@gmail.com?subject=Mentornak jelentkezem">Jelentkezz mentornak</a>
            </li>
            <li>Vidd hírünket, pl. postolj a Facebook faladra valami ilyet: “Találtam egy ingyenes online fotóssulit, krumplikat lehet fotózni. 😄 Hamarosan indul a következő tanfolyamuk, itt lehet jelentkezni: <ExternalLink href="https://bit.ly/3iDJ3HV">https://bit.ly/3iDJ3HV</ExternalLink> 🍠”
            </li>
        </ul>

        <p>További infók:</p>
        <ul>
            <li>
                <Link to="/about">Rólunk</Link>
            </li>
            <li>
                <Link to="/faq">Gyakran ismételt kérdések</Link>
            </li>
        </ul>
{:else}
        <h1>Contact 🥔🤙</h1>
        <p>You can reach us:</p>
        <ul>
            <li>In email: <a href="mailto:photatophotato@gmail.com">photatophotato@gmail.com</a>
            </li>
            <li>On Facebook: <ExternalLink href="https://fb.com/photatophotato">https://fb.com/photatophotato</ExternalLink>
            </li>
            <li>On Instagram: <ExternalLink href="https://www.instagram.com/photatocourse">https://www.instagram.com/photatocourse</ExternalLink>
            </li>
        </ul>

        <p>Help if you feel like it:</p>
        <ul>
            <li>
                <a href="mailto:photatophotato@gmail.com?subject=Mentor application">Jelentkezz mentornak</a>
            </li>
            <li>Spread the word. Post on your wall something like: ‘I’ve found a free photo school where you can shoot potatoes. 😄 Their next course is starting soon, apply here: <ExternalLink href="https://bit.ly/3iDJ3HV">https://bit.ly/3iDJ3HV</ExternalLink> 🍠’
            </li>
        </ul>

        <p>More info:</p>
        <ul>
            <li>
                <Link to="/about">About us</Link>
            </li>
            <li>
                <Link to="/faq">Frequently asked questions</Link>
            </li>
        </ul>
{/if}
