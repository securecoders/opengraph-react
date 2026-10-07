// Scraped OpenGraph values are attacker-controlled; anything that ends up in an
// href, src or CSS url() must be plain http(s).
export const safeUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : undefined;
  } catch (e) {
    return undefined;
  }
};

const VIDEO_EMBED_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'www.dailymotion.com',
  'geo.dailymotion.com',
  'player.twitch.tv',
  'fast.wistia.net',
  'www.loom.com',
];

export const safeVideoEmbedUrl = (value) => {
  const url = safeUrl(value);
  if (!url) {
    return undefined;
  }
  const parsed = new URL(url);
  return parsed.protocol === 'https:' && VIDEO_EMBED_HOSTS.includes(parsed.hostname) ? url : undefined;
};
