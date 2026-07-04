import React from '../../web_modules/react.js';
import {useHistory} from '../../web_modules/react-router-dom.js';

export default function NavLinkButton(props) {
    const {to, onClick, ...rest} = props;
    const history = useHistory();

    const handleClicks = event => {
        history.push(to);
        onClick && onClick(event);
    };

    return <button {...rest} onClick={handleClicks}/>;
}