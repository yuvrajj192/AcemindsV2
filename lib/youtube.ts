/**
 * Normalize any YouTube URL (watch, youtu.be, shorts, live, embed) to an
 * embeddable https://www.youtube.com/embed/<id> URL. Non-YouTube URLs are
 * returned trimmed so the video modal can still play other providers.
 */
export function toYouTubeEmbed(url: string): string {
  const s = (url || "").trim();
  if (!s) return "";
  if (s.includes("youtube.com/embed/")) return s.split(/[?&]/)[0];
  const patterns: RegExp[] = [
    /youtube\.com\/watch\?(?:[^#]*&)?v=([\w-]{6,})/,
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
    /youtube\.com\/live\/([\w-]{6,})/,
    /youtube-nocookie\.com\/embed\/([\w-]{6,})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return s;
}

export function isYouTubeUrl(url: string): boolean {
  return toYouTubeEmbed(url).includes("youtube.com/embed/");
}
