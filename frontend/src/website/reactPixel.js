/*
 * react-facebook-pixel@1.x ships only a webpack UMD bundle (no ESM entry, no reliable `__esModule`
 * default). Under Vite's Rolldown build the CJS→ESM interop nests the real API under an extra
 * `.default`, so a plain `import ReactPixel from 'react-facebook-pixel'` yields an object whose `.init`
 * is missing and the app crashes on bootstrap.
 *
 * Normalize the interop here, once: walk the `default` / `ReactPixel` wrapper chain and return the
 * object that actually carries the API (`init` + `pageView`). Call sites keep importing a default
 * `ReactPixel`, exactly as before.
 */
import * as reactPixelModule from 'react-facebook-pixel';

function findPixelApi(root) {
    const seen = new Set();
    const queue = [root];
    while (queue.length > 0) {
        const candidate = queue.shift();
        if (!candidate || typeof candidate !== 'object' || seen.has(candidate)) continue;
        seen.add(candidate);
        if (typeof candidate.init === 'function' && typeof candidate.pageView === 'function') {
            return candidate;
        }
        queue.push(candidate.default, candidate.ReactPixel);
    }
    return undefined;
}

const ReactPixel = findPixelApi(reactPixelModule);

export default ReactPixel;
