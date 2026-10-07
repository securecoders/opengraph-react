const OPENGRAPH_API_BASE = 'https://opengraph.io/api/1.1/site/';

// With proxyUrl the browser never sees an app_id: the proxy adds its own key
// server-side and forwards these same query parameters to opengraph.io.
export const buildRequestUrl = ({
  site, appId, proxyUrl, acceptLang,
  useProxy, forceCacheUpdate, fullRender,
  usePremium, useSuperior, disableAutoProxy,
}) => {
  let url;
  if (proxyUrl) {
    url = new URL(proxyUrl, typeof window !== 'undefined' ? window.location.href : undefined);
    url.searchParams.set('site', site);
  } else {
    url = new URL(OPENGRAPH_API_BASE + encodeURIComponent(site));
    url.searchParams.set('app_id', appId);
  }

  url.searchParams.set('accept_lang', acceptLang || 'auto');
  if (useProxy) url.searchParams.set('use_proxy', 'true');
  if (forceCacheUpdate) url.searchParams.set('cache_ok', 'false');
  if (fullRender) url.searchParams.set('full_render', 'true');
  if (usePremium) url.searchParams.set('use_premium', 'true');
  if (useSuperior) url.searchParams.set('use_superior', 'true');
  if (disableAutoProxy) url.searchParams.set('auto_proxy', 'false');

  return url.toString();
};
