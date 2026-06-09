/**
 * Resolve absolute site paths for VitePress (/) or nested GitHub Pages (/repo/).
 * Viewer apps live under .../viewer/; media and doc links use the site root.
 */
export function siteRootFromBase(baseUrl = '/') {
  return String(baseUrl || '/').replace(/viewer\/$/, '')
}

export function resolveSitePath(path, baseUrl = siteRootFromBase(import.meta.env?.BASE_URL)) {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path

  const root = siteRootFromBase(baseUrl).replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return root ? `${root}${normalized}` : normalized
}
