import React from 'react';
import {NavLink} from 'react-router-dom';

export default function PhotoUploadLink({label}) {
    return <NavLink to='/upload'>{label}</NavLink>;
}