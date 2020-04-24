import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useParams} from '../../web_modules/react-router-dom.js';

import NavLinkButton from '../../app/components/NavLinkButton.mjs';

export default function MaterialPage() {
    /* Get page parameters */
    const {slug} = useParams();

    const {getActiveLocaleCode, __} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);

    /* Load article */
    const [article, setArticle] = useState({isLoaded: false, metadata: {}, component: null});

    useEffect(() => {
        setArticle({isLoaded: false, metadata: {}, component: null});

        async function loadArticle() {
            const content = await import('../content/' + languageCode + '/' + slug + '.mjs');
            setArticle({isLoaded: true, metadata:content.getMetadata(), component: content.default});
        }

        loadArticle().then(() => {});
    }, [slug]);

    useEffect(() => {
        if (article.isLoaded) {
            document.querySelectorAll('.enlargeable figure').forEach(element => element.addEventListener('click', fullscreenClick));
            document.addEventListener('keydown', exitFullscreenOnEscape);

            function fullscreenClick(event) {
                /* Do not go to linked URL */
                event.preventDefault();

                const html = document.querySelector('html');
                const enlargeableDiv = this.parentElement;
                if (!enlargeableDiv.classList.contains('fullscreen')) {
                    /* Build references to DOM elements */
                    const figure = this;
                    const link = figure.querySelector('a');
                    const image = figure.querySelector('img');

                    /* Add "fullscreen" class to container */
                    enlargeableDiv.classList.add('fullscreen');

                    /* Set initial position for the figure */
                    figure.style.left = (figure.offsetLeft - html.scrollLeft) + 'px';
                    figure.style.top = (figure.offsetTop - html.scrollTop) + 'px';
                    figure.style.width = figure.offsetWidth + 'px';
                    figure.style.height = figure.offsetHeight + 'px';

                    /* Replace thumbnail image with the full version */
                    const downloadingImage = new Image();
                    downloadingImage.onload = function () {
                        if (enlargeableDiv.classList.contains('fullscreen')) {
                            image['data-thumbnail-src'] = image['data-thumbnail-src'] || image.src;
                            image.src = this.src;
                        }
                    };
                    downloadingImage.onerror = function(error) {
                        console.error(`Error loading ${this.src}: ${error.message}`);
                    };
                    downloadingImage.src = link.href;

                    /* Set up link to exit fullscreen */
                    link.addEventListener('click', exitFullscreen);
                    link['data-original-href'] = link['data-original-href'] || link.href;
                    link.removeAttribute('href');

                    /* Start going to fullscreen after a bit of time, to let the basic updates roll out first */
                    setTimeout(() => {
                        if (enlargeableDiv.classList.contains('fullscreen')) {
                            figure.style.left = '0';
                            figure.style.top = '0';
                            figure.style.width = '100%';
                            figure.style.height = '100%';
                        }
                    }, 50);
                }
            }

            function exitFullscreenOnEscape(event) {
                if (event.key === 'Escape') {
                    exitFullscreen();
                }
            }

            function exitFullscreen() {
                setTimeout(() => {
                    document.querySelectorAll('.enlargeable.fullscreen').forEach(enlargeableDiv => {
                        const figure = enlargeableDiv.querySelector('figure');
                        const link = enlargeableDiv.querySelector('a');
                        const image = enlargeableDiv.querySelector('img');

                        enlargeableDiv.classList.remove('fullscreen');
                        figure.style.left = '';
                        figure.style.top = '';
                        figure.style.width = '';
                        figure.style.height = '';
                        link.removeEventListener('click', exitFullscreen);
                        link.href = link['data-original-href'] || link.href;
                        link.removeAttribute('data-original-href');
                        image.src = image['data-thumbnail-src'] || image.src;
                        image.removeAttribute('data-thumbnail-src');
                    });
                }, 50);
            }

            return () => {
                document.querySelectorAll('.enlargeable figure').forEach(element => element.removeEventListener('click', fullscreenClick));
                document.removeEventListener('keydown', exitFullscreenOnEscape);
            };
        }
    }, [article]);

    return article.isLoaded ? createElement('article', {},
        createElement('h1', {}, article.metadata.title),
        createElement('p', {className: 'articleMetadata'}, __('Author') + ': ' + article.metadata.author, ' — ',
            __('Publication date') + ': ' + article.metadata.publishDate.toLocaleDateString(getActiveLocaleCode()), ' — ',
            createElement('a', {href: article.metadata.originalUrl, target: '_blank'}, __('Original article')),
        ),
        createElement('div', {}, createElement(article.component, {})),
        createElement(NavLinkButton, {to: '/materials'}, '←' + __('Back to the list of materials')),
    ) : [
        __('Loading article...'),
        createElement(NavLinkButton, {to: '/materials'}, '←' + __('Back to the list of materials')),
    ];
}