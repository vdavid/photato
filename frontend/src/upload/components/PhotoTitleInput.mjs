import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

/**
 *
 * @param {string} title
 * @param {boolean} isDisabled
 * @param {function(string): void} onChange
 * @returns {React.ReactElement}
 * @constructor
 */
export default function PhotoTitleInput({title, isDisabled, onChange}) {
    const {__} = useI18n();

    return <div className='title'>
        <input type='text'
               name='title'
               maxLength={150}
               placeholder={__('Give your photo a title (optional)')}
               disabled={isDisabled}
               value={title}
               onChange={event => onChange(event.target.value)}/>
    </div>;
}