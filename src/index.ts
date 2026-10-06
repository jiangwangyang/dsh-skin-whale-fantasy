/**
 * Host half of the standalone whale-fantasy skin plugin.
 *
 * The skin is pure browser-side presentation (CSS + one background video
 * streamed from a CDN), so the host half intentionally does nothing. It
 * exists because the bundle loader imports every row's node half.
 */
export function apply(): void {}
