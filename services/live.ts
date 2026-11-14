export const liveEnabled = process.env.WENDY_ENABLE_LIVE === "true"

export function isLocalRequest(request: Request) {
  const loopback = new Set(["localhost", "127.0.0.1", "[::1]"])
  const host = new URL(request.url).hostname
  const origin = request.headers.get("origin")
  const fetchSite = request.headers.get("sec-fetch-site")
  if (!loopback.has(host) || (fetchSite && !["same-origin", "none"].includes(fetchSite))) return false
  if (!origin) return true
  try {
    return loopback.has(new URL(origin).hostname)
  } catch {
    return false
  }
}
