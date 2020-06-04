import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';
import Twemoji from './Twemoji.mjs';

export default function Footer() {
    const {__} = useI18n();

    return <footer>
        <Twemoji><div className='copyright'>{__('Made with ❤️ by the Photato team')}</div></Twemoji>
        <div className='social'>{[
            <ExternalLink href='https://www.facebook.com/photato12/'
                          className='facebook icon'
                          title={__('Photato’s Facebook page')}/>,
            <ExternalLink href='https://www.instagram.com/photatocourse/'
                          className='instagram icon'
                          title={__('Photato’s Instagram')}/>]}</div>
    </footer>;
}
