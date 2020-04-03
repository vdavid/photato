import {createElement} from '/web_modules/react.js';

export default function AboutPage() {
    return [
        createElement('h1', {}, 'Welcome to Photato!'),
        createElement('p', {}, 'Photato is a free photo course etc.'),
    ];
}