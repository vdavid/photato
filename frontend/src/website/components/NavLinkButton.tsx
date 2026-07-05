import React from 'react';
import {useHistory} from 'react-router-dom';

interface NavLinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    to: string;
}

export default function NavLinkButton(props: NavLinkButtonProps) {
    const {to, onClick, ...rest} = props;
    const history = useHistory();

    const handleClicks = (event: React.MouseEvent<HTMLButtonElement>) => {
        history.push(to);
        onClick && onClick(event);
    };

    return <button {...rest} onClick={handleClicks}/>;
}