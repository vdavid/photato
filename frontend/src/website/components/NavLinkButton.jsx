import React from 'react';
import {useHistory} from 'react-router-dom';

export default function NavLinkButton(props) {
    const {to, onClick, ...rest} = props;
    const history = useHistory();

    const handleClicks = event => {
        history.push(to);
        onClick && onClick(event);
    };

    return <button {...rest} onClick={handleClicks}/>;
}