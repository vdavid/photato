import {createElement} from '../../web_modules/react.js';

export default function AboutPage() {
    return [
        createElement('h1', {}, 'About us'),
        createElement('p', {}, 'Photato is a free photo course etc.'),
    ];
}