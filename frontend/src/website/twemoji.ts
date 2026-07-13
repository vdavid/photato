import type { Action } from 'svelte/action'
import EmojiReplacer from './EmojiReplacer'

/*
 * `use:twemoji` — walks the element's subtree after mount and replaces emoji characters in text nodes
 * with Noto emoji `<img class="emoji">` images (served from `/website/noto-emojis/`). This mirrors the
 * old React `<Twemoji>` component, but as a Svelte action applied to an existing container element so
 * no extra wrapper node is added. Content is static by the time it mounts (the app gates rendering on
 * fonts + translations), so a single mount-time parse is enough.
 */

const emojiReplacer = new EmojiReplacer({
  defaultAssetsBaseUrl: '/website/',
  defaultFileExtension: '.svg',
  defaultClassName: 'emoji',
  defaultSize: 'noto-emojis',
})

export const twemoji: Action<HTMLElement, boolean | undefined> = (node, enabled = true) => {
  if (enabled) {
    emojiReplacer.parse(node)
  }
  return {
    update(newEnabled: boolean | undefined) {
      /* Re-parse when a route change turns emoji parsing on for the newly shown page. */
      if (newEnabled) {
        emojiReplacer.parse(node)
      }
    },
  }
}
