<script lang="ts">
    import { config } from '../../config'
    import { __, getActiveLocaleCode } from '../../i18n/i18n.svelte'
    import { auth } from '../../auth/auth.svelte'
    import { navigate } from '../../website/router.svelte'
    import Link from '../../website/components/Link.svelte'
    import NavLinkButton from '../../website/components/NavLinkButton.svelte'
    import ExternalLink from '../../materials/components/ExternalLink.svelte'

    $effect(() => {
        document.title = __('12 weeks, 12 pics') + ' - Photato'
    })
</script>

{#snippet alreadySignedIn()}
    <section class="frontPageSection">
        <p>{__('It seems like you’re already enrolled in a course, and signed in.')}</p>
        <NavLinkButton to="/course"
            >{__('Come to the {courseTitle} page', { courseTitle: config.course.titleWithoutPhotato })}</NavLinkButton
        >
    </section>
{/snippet}

<!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- Svelte {@render} of a snippet; the rule mis-reads the snippet call as a confusing void expression -->
{#if auth.isAuthenticated}{@render alreadySignedIn()}{/if}

<header class="frontPageSection frontPageHeader">
    <div class="">
        {#if getActiveLocaleCode() === 'hu-HU'}
            <h2>Tanulj meg fotózni!</h2>
            <p>
                Ez egy <strong>ingyenes</strong> fotós tanfolyam kezdőknek és középhaladóknak.<br />
                Csak egy fényképezőgépre vagy mobilra van szükséged.
            </p>
        {:else}
            <h2>Learn Photography!</h2>
            <p>
                This is a <strong>free</strong> course for beginners and intermediates.<br />
                You only need a camera or a mobile phone.
            </p>
        {/if}
        <p>
            <ExternalLink href={config.course.signUpFormUrl} class="main callToActionButton"
                >{__('Sign up for the next course')}</ExternalLink
            >
        </p>
    </div>
</header>

<section class="frontPageSection threePoints">
    <div>
        <p>
            <span class="icon material-icons">photo_camera</span><span class="icon material-icons">smartphone</span>
        </p>
        <h3>{__('With a camera or a mobile')}</h3>
        <p>
            {__('You can get the most out of this course with a camera, but if you don’t have one, a mobile will do.')}
        </p>
    </div>
    <div>
        <p>
            <span class="icon material-icons">today</span>
        </p>
        <h3>{__('In 12 weeks')}</h3>
        <p>{__('15–45 minutes of theory and a new challenge each week.')}</p>
    </div>
    <div>
        <p>
            <span class="icon material-icons">face</span><span class="icon material-icons">face</span>
        </p>
        <h3>{__('In community')}</h3>
        <p>{__('You can learn alone, with your friends, or with new friends.')}</p>
    </div>
</section>

<section class="frontPageSection frontPageMainCallToAction">
    <ExternalLink href={config.course.signUpFormUrl} class="callToActionButton"
        >{__('Sign up for the next free course')}</ExternalLink
    >
</section>

<section class="frontPageSection threePoints">
    <div>
        <p>
            <span class="icon material-icons">looks_4</span>
        </p>
        <h3>{__('4 courses')}</h3>
        <p>{__('This is the fourth free course we start since 2018.')}</p>
    </div>
    <div>
        <p>
            <span class="icon material-icons">face</span><span class="icon material-icons">face</span>
        </p>
        <h3>{__('500+ students')}</h3>
        <p>{__('In the last 3 courses, we’ve taught more than 500 people to take better shots.')}</p>
    </div>
    <div>
        <p>
            <span class="icon material-icons">photo</span><span class="icon material-icons">photo</span><span
                class="icon material-icons">photo</span
            >
        </p>
        <h3>{__('1,000+ photos')}</h3>
        <p>{__('We got more than 1,000 valid “best shot of the week” submissions.')}</p>
    </div>
</section>

<section class="frontPageSection frontPageMainCallToAction">
    <ExternalLink href={config.course.signUpFormUrl} class="callToActionButton"
        >{__('Sign up for the next free course')}</ExternalLink
    >
</section>

{#if getActiveLocaleCode() === 'hu-HU'}
    <section class="frontPageSection">
        <p>
            A tanfolyam ingyenes. Ha érdekel, kik csinálják ezt, és miért ingyen, a <Link to="/about">Rólunk</Link> oldalon
            további információkat találsz.
        </p>
        <p>Gyere fotózni, várunk! :)</p>
    </section>
{:else}
    <p>
        The course is free. If you’re interested in who does it and why it’s free, you can read more about us on the <Link
            to="/about">About page</Link
        >.
    </p>
    <p>Join us! :)</p>
{/if}

<hr />

{#if auth.isAuthenticated}
    <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- Svelte {@render} of a snippet; the rule mis-reads the snippet call as a confusing void expression -->
    {@render alreadySignedIn()}
{:else}
    <section class="frontPageSection">
        <h3>{__('Already enrolled?')}</h3>
        <NavLinkButton to="/upload" disabled={true} title={__('You’ll need to sign in to upload a photo.')}
            >{__('Upload your weekly photo')}</NavLinkButton
        >
        <button
            onclick={() => {
                navigate('/login')
            }}>{__('Sign in')}</button
        >
    </section>
{/if}
