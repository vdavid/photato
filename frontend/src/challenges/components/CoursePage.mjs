import React, {useEffect} from '../../web_modules/react.js';
import ChallengeList from './ChallengeList.mjs';
import {config} from '../../config.mjs';


export default function CoursePage() {
    useEffect(() => {document.title = config.course.titleWithoutPhotato + ' - Photato'}, []);

    return <>
        <h1>{config.course.titleWithPhotato}</h1>
        <ChallengeList/>
    </>;
}