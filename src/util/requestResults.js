// How long a successful response is reused. Short on purpose: it is there to
// collapse the burst of identical requests a page makes while it renders
// (several cards for one URL, a list re-mounting, React StrictMode's double
// mount), not to act as a long-lived cache.
const DEFAULT_TTL_MS = 60 * 1000;
const MAX_ENTRIES = 100;

// url -> { promise, controller, subscribers, settled, expires }
const entries = new Map();

const forget = (url, entry) => {
  if (entries.get(url) === entry) entries.delete(url);
};

const startRequest = (url, ttlMs) => {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const entry = { controller, subscribers: 0, settled: false, expires: 0 };

  entry.promise = fetch(url, controller ? { signal: controller.signal } : undefined)
    .then((response) => response.json())
    .then(
      (body) => {
        entry.settled = true;
        entry.expires = Date.now() + ttlMs;
        // An error body (bad key, quota, unreachable site) is not worth
        // remembering: the next mount should ask again.
        if (!body || body.error) forget(url, entry);
        return body;
      },
      (err) => {
        entry.settled = true;
        forget(url, entry);
        throw err;
      }
    );
  // Every subscriber may have gone by the time this settles.
  entry.promise.catch(() => {});

  if (entries.size >= MAX_ENTRIES) {
    entries.delete(entries.keys().next().value);
  }
  entries.set(url, entry);
  return entry;
};

/**
 * Ask for an API response, sharing one network request between every caller
 * that wants the same URL at the same time or shortly after.
 *
 * Returns the shared promise and a `release` function. Call `release` when the
 * caller no longer wants the answer (the component unmounted): once nobody is
 * waiting, the request is aborted instead of running on and spending a
 * request against the API key for a card that is no longer on the page.
 */
export const requestResults = (url, { skipCache = false, ttlMs = DEFAULT_TTL_MS } = {}) => {
  let entry = entries.get(url);
  const fresh = entry && (!entry.settled || entry.expires > Date.now());
  if (!fresh || skipCache) {
    entry = startRequest(url, ttlMs);
  }

  entry.subscribers += 1;
  let released = false;

  return {
    promise: entry.promise,
    release: () => {
      if (released) return;
      released = true;
      entry.subscribers -= 1;
      // Decided on the next tick, not now: React StrictMode (and a keyed
      // re-render) unmounts and remounts straight away, and the remount should
      // pick this request up rather than abort it and start a second one.
      setTimeout(() => {
        if (!entry.settled && entry.subscribers === 0) {
          forget(url, entry);
          if (entry.controller) entry.controller.abort();
        }
      }, 0);
    },
  };
};

/** Drop every remembered response. */
export const clearResultsCache = () => entries.clear();
