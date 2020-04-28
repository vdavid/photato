import ReactDOM from '../web_modules/react-dom.js';

export function renderReactElement(element) {
    return new Promise((resolve) => {
        const temporaryHtmlElement = document.React.createElement('div');
        ReactDOM.render(element, temporaryHtmlElement, () => {
            resolve(temporaryHtmlElement.innerHTML);
        });
    });
}