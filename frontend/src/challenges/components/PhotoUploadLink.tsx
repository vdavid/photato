import React from 'react';
import {NavLink} from 'react-router-dom';

export default function PhotoUploadLink({label}: {label: React.ReactNode}) {
    return <NavLink to='/upload'>{label}</NavLink>;
}