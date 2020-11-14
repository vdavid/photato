import React, {useEffect} from '../../web_modules/react.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import NavLinkButton from '../../website/components/NavLinkButton.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';
import {config} from '../../config.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function FrontPage() {
    const {isAuthenticated, loginWithRedirect} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();

    useEffect(() => {document.title = __('12 weeks, 12 pics') + ' - Photato';}, []);

    return <>
        {isAuthenticated && getAlreadySignedInSection()}
        {getPageHeaderSection()}
        {getThreeKeyPointsSection()}
        {getSignUpForFreeButtonSection()}
        {getVanityNumbersSection()}
        {getSignUpForFreeButtonSection()}
        {getFreeCommentSection()}
        <hr />
        {getMembersOnlySection(isAuthenticated)}
    </>;

    function handleSignIn() {
        loginWithRedirect({});
    }

    function getAlreadySignedInSection() {
        return <section className="frontPageSection">
            <p>{__('It seems like you’re already enrolled in a course, and signed in.')}</p>
            <NavLinkButton to='/course'>{__('Come to the {courseTitle} page', {courseTitle: config.course.titleWithoutPhotato})}</NavLinkButton>
        </section>;
    }

    function getPageHeaderSection() {
        return <header className="frontPageSection frontPageHeader">
            <div className="">
                {(getActiveLocaleCode() === 'hu-HU')
                    ? <>
                        <h2>Tanulj meg fotózni!</h2>
                        <p>Ez egy <strong>ingyenes</strong> fotós tanfolyam kezdőknek és középhaladóknak.<br/>
                            Csak egy fényképezőgépre vagy mobilra van szükséged.
                        </p>
                    </>
                    : <>
                        <h2>Learn Photography!</h2>
                        <p>This is a <strong>free</strong> course for beginners and intermediates.<br/>
                            You only need a camera or a mobile phone.
                        </p>
                    </>}
                <p><ExternalLink href={config.course.signUpFormUrl} className="main callToActionButton">{__('Sign up for the next course')}</ExternalLink></p>
            </div>
        </header>;
    }

    function getThreeKeyPointsSection() {
        return <section className="frontPageSection threePoints">
            <div>
                <p><span className='icon material-icons'>photo_camera</span><span className='icon material-icons'>smartphone</span></p>
                <h3>{__('With a camera or a mobile')}</h3>
                <p>{__('You can get the most out of this course with a camera, but if you don’t have one, a mobile will do.')}</p>
            </div>
            <div>
                <p><span className='icon material-icons'>today</span></p>
                <h3>{__('In 12 weeks')}</h3>
                <p>{__('15–45 minutes of theory and a new challenge each week.')}</p>
            </div>
            <div>
                <p><span className='icon material-icons'>face</span><span className='icon material-icons'>face</span></p>
                <h3>{__('In community')}</h3>
                <p>{__('You can learn alone, with your friends, or with new friends.')}</p>
            </div>
        </section>;
    }

    function getSignUpForFreeButtonSection() {
        return <section className="frontPageSection frontPageMainCallToAction"><ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next free course')}</ExternalLink></section>;
    }

    function getVanityNumbersSection() {
        return <section className="frontPageSection threePoints">
            <div>
                <p><span className='icon material-icons'>looks_4</span></p>
                <h3>{__('4 courses')}</h3>
                <p>{__('This is the fourth free course we start since 2018.')}</p>
            </div>
            <div>
                <p><span className='icon material-icons'>face</span><span className='icon material-icons'>face</span></p>
                <h3>{__('500+ students')}</h3>
                <p>{__('In the last 3 courses, we’ve taught more than 500 people to take better shots.')}</p>
            </div>
            <div>
                <p><span className='icon material-icons'>photo</span><span className='icon material-icons'>photo</span><span className='icon material-icons'>photo</span></p>
                <h3>{__('1,000+ photos')}</h3>
                <p>{__('We got more than 1,000 valid “best shot of the week” submissions.')}</p>
            </div>
        </section>;
    }

    function getFreeCommentSection() {
        return (getActiveLocaleCode() === 'hu-HU') ?
            <section className="frontPageSection">
                <p>A tanfolyam ingyenes. Ha érdekel, kik csinálják ezt, és miért ingyen, a <NavLink to={'/about'}>Rólunk</NavLink> oldalon további információkat találsz.
                </p>
                <p>Gyere fotózni, várunk! :)</p>
            </section>
            : <>
                <p>The course is free. If you’re interested in who does it and why it’s free, you can read more about us on the <NavLink to={'/about'}>About page</NavLink>.
                </p>
                <p>Join us! :)</p>
            </>;

    }

    function getMembersOnlySection(isAuthenticated) {
        return isAuthenticated ? getAlreadySignedInSection() : <section className="frontPageSection">
            <h3>{__('Already enrolled?')}</h3>
            <NavLinkButton to='/upload' disabled={true} title={__('You’ll need to sign in to upload a photo.')}>{__('Upload your weekly photo')}</NavLinkButton>
            <button onClick={handleSignIn}>{__('Sign in')}</button>
        </section>
    }
}