/**
 * Resolves stored media paths for <img src>.
 * - Absolute http(s) URLs (e.g. ImageKit) are returned unchanged.
 * - Relative paths like /uploads/... are prefixed with the API origin from VITE_API_URL.
 */
export function resolveMediaUrl(urlOrPath) {
    if (urlOrPath == null || urlOrPath === "") return "";
    const s = String(urlOrPath).trim();
    if (/^https?:\/\//i.test(s)) return s;
    const raw = import.meta.env.VITE_API_URL || "";
    const base = raw.replace(/\/api\/?$/i, "").replace(/\/$/, "");
    const pathPart = s.startsWith("/") ? s : `/${s}`;
    return base ? `${base}${pathPart}` : pathPart;
}
