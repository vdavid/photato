import type { TranslationMap } from '../I18n'

/* Most strings are missing from here because the English phrases in the code are fine as-is for the
 * English version. The few HTML-fragment entries (`format: 'html'`) are rendered with `{@html}` at
 * their call site. The Photato emoji is the aperture logo image (see PhotatoEmoji.svelte). */
export const translations: TranslationMap = {
  /* Loading page */
  'Loading seems to take longer than usual. If you think this is a problem, please report it here.': {
    translation:
      'Loading seems to take longer than usual. If you think this is a problem, please report it at <a href="mailto:photatophotato@gmail.com?subject=Problem with website, loading for too long!">photatophotato@gmail.com</a>.',
    format: 'html',
  },

  /* Article pages */
  'Photato cached version': {
    translation: '<img draggable="false" class="emoji" alt="🥔📷" src="/website/aperture-logo.svg"/> cached version',
    format: 'html',
  },

  /* Materials page */
  'Some of these articles are not our own. [...]': {
    translation:
      '<em>Some of these articles are not our own.</em> We just like them very much. You’ll recognize them easily because the original author is specified, and the link looks different.<br/>' +
      'Sadly, these great articles tend to disappear from the internet over the years. To protect them, we created cached copies for some.<br/>' +
      'Unless the link is broken, we advise you to <em>read the original version</em> to support its authors with your visit and ad views.',
    format: 'html',
  },
}
