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

    return (getActiveLocaleCode() === 'hu-HU') ? getHungarianPage() : getEnglishPage();

    function handleSignIn() {
        loginWithRedirect({});
    }

    function getHungarianPage() {
        return <>
            <header className="frontPageHeader">
                <div className="">
                    <h2>Tanulj meg fotózni!</h2>
                    <p>Ez egy ingyenes fotós tanfolyam kezdőknek és középhaladóknak.<br/>
                        Csak egy fényképezőgépre vagy mobilra van szükséged.
                    </p>
                    <p><ExternalLink href={config.course.signUpFormUrl} className="main callToActionButton">{__('Sign up for the next course')}</ExternalLink></p>
                </div>
            </header>

            <div className="threePoints">
                <div>
                    <p><span className='icon material-icons'>photo_camera</span><span className='icon material-icons'>smartphone</span></p>
                    <h3>Fényképezőgéppel vagy mobillal</h3>
                    <p>Fényképezőgéppel tudsz a legtöbbet tanulni, de ha nincs, egy mobil is elég.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>today</span></p>
                    <h3>12 hét alatt</h3>
                    <p>Heti 15–45 perc elmélet, és annyi gyakorlat, amit beleteszel. Minden héten új feladatot kapsz.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>face</span><span className='icon material-icons'>face</span></p>
                    <h3>Társaságban</h3>
                    <p>Tanulhatsz egyedül, a barátaiddal, vagy új ismerősökkel is.</p>
                </div>
            </div>

            <p className="frontPageMainCallToAction"><ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next free course')}</ExternalLink></p>

            <div className="threePoints">
                <div>
                    <p><span className='icon material-icons'>looks_4</span></p>
                    <h3>4 tanfolyam</h3>
                    <p>2018 óta ez már a 4. ingyenes tanfolyam, amit indítunk.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>face</span><span className='icon material-icons'>face</span></p>
                    <h3>500+ résztvevő</h3>
                    <p>Az eddigi 3 tanfolyamon több, mint 500 embert tanítottunk fotózni.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>photo</span><span className='icon material-icons'>photo</span><span className='icon material-icons'>photo</span></p>
                    <h3>1 000+ fotó</h3>
                    <p>Több, mint 1 000 érvényes “heti legjobb fotó” beadást kaptunk.</p>
                </div>
            </div>

            <p className="frontPageMainCallToAction"><ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next free course')}</ExternalLink></p>

            <p>&nbsp;</p>
            <p>A tanfolyam ingyenes. Ha érdekel, kik csinálják ezt, és miért ingyen, a <NavLink to={'/about'}>Rólunk</NavLink> oldalon további információkat találsz.</p>
            <p>Gyere fotózni, várunk! :)</p>
            <p>&nbsp;</p>

            <hr />

            <h3>Már nálunk tanulsz?</h3>
            <div>
                    <NavLinkButton to='/upload'
                                   disabled={!isAuthenticated}
                                   title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                        {__('Upload your weekly photo')}
                    </NavLinkButton>
                {!isAuthenticated ?

                        <button onClick={handleSignIn}>{__('Sign in')}</button>
                     : null}
            </div>
        </>
    }

    function getEnglishPage(isAuthenticated) {
        return <>
            <header className="frontPageHeader">
                <div className="">
                    <h2>Learn Photography for Free!</h2>
                    <p>This is a free course for beginners and intermediates.<br/>
                        You only need a camera or a mobile phone.
                    </p>
                    <p><ExternalLink href={config.course.signUpFormUrl} className="main callToActionButton">{__('Sign up for the next course')}</ExternalLink></p>
                </div>
            </header>

            <div className="threePoints">
                <div>
                    <p><span className='icon material-icons'>photo_camera</span><span className='icon material-icons'>smartphone</span></p>
                    <h3>With a camera or a mobile</h3>
                    <p>You can get the most out of this course with a camera, but if you don’t have one, a mobile will do.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>today</span></p>
                    <h3>In 12 weeks</h3>
                    <p>15–45 minutes of theory and a new challenge each week.</p>
                    <p>The course takes 12 weeks. You’ll learn some theory and get a new challenge each week.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>face</span><span className='icon material-icons'>face</span></p>
                    <h3>In community</h3>
                    <p>You can learn alone, with your friends, or with new friends.</p>
                </div>
            </div>

            <p className="frontPageMainCallToAction"><ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next free course')}</ExternalLink></p>

            <div className="threePoints">
                <div>
                    <p><span className='icon material-icons'>looks_4</span></p>
                    <h3>4 courses</h3>
                    <p>This is the fourth free course we start since 2018.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>face</span><span className='icon material-icons'>face</span></p>
                    <h3>500+ students</h3>
                    <p>In the last 3 courses, we’ve taught more than 500 people to take better shots.</p>
                </div>
                <div>
                    <p><span className='icon material-icons'>photo</span><span className='icon material-icons'>photo</span><span className='icon material-icons'>photo</span></p>
                    <h3>1,000+ photos</h3>
                    <p>We got more than 1,000 valid “best shot of the week” submissions.</p>
                </div>
            </div>

            <p className="frontPageMainCallToAction"><ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next free course')}</ExternalLink></p>

            <p>&nbsp;</p>
            <p>The course is free. If you’re interested in who does it and why it’s free, you can read more about us on the <NavLink to={'/about'}>About page</NavLink>.</p>
            <p>Join us! :)</p>

            <div>
                <p>
                    <NavLinkButton to='/upload'
                                   disabled={!isAuthenticated}
                                   title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                        {__('Upload your weekly photo')}
                    </NavLinkButton>
                </p>
                {!isAuthenticated ?
                    <p>
                        <button onClick={handleSignIn}>{__('Sign in')}</button>
                    </p> : null}
            </div>
        </>
    }
}