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

/** The slice of the react-facebook-pixel API the app actually uses. */
interface ReactPixelApi {
    init: (pixelId: string, advancedMatching?: object, options?: object) => void;
    pageView: () => void;
}

function findPixelApi(root: unknown): ReactPixelApi | undefined {
    const seen = new Set<unknown>();
    const queue: unknown[] = [root];
    while (queue.length > 0) {
        const candidate = queue.shift();
        if (!candidate || typeof candidate !== 'object' || seen.has(candidate)) continue;
        seen.add(candidate);
        const record = candidate as Record<string, unknown>;
        if (typeof record.init === 'function' && typeof record.pageView === 'function') {
            return candidate as ReactPixelApi;
        }
        queue.push(record.default, record.ReactPixel);
    }
    return undefined;
}

/* The module always carries the API; if the interop ever broke, `.init` below would throw on boot —
 * the same failure mode as before, made explicit by the non-optional type. */
const ReactPixel = findPixelApi(reactPixelModule) as ReactPixelApi;

export default ReactPixel;
