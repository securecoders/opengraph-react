import React from 'react';
import { render, waitFor } from '@testing-library/react';
import OpenGraphReactComponent from '../index';
import RenderLarge from '../components/large';
import LinkedInComponent from '../components/linkedIn';
import ErrorBoundary from '../components/error';
import { getProductInfo } from '../util/getProductInfo';
import { buildRequestUrl } from '../util/buildRequestUrl';
import { requestResults, clearResultsCache } from '../util/requestResults';

const ogResponse = {
  openGraph: { title: 'Example', url: 'https://example.com/', image: { url: 'https://example.com/og.png' } },
  htmlInferred: {},
  hybridGraph: {},
};

const mockFetch = (body) => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(body) }));
  return global.fetch;
};

afterEach(() => {
  delete global.fetch;
  clearResultsCache();
});

describe('default fetch path', () => {
  it('renders the card after fetching instead of crashing on empty resultsToUse', async () => {
    mockFetch(ogResponse);
    const { container } = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);

    await waitFor(() => expect(container.querySelector('.wrapperLarge')).not.toBeNull());
    expect(container.querySelector('img').getAttribute('src')).toBe('https://example.com/og.png');
  });

  it('does not render javascript: links from the API response', async () => {
    mockFetch({ ...ogResponse, openGraph: { ...ogResponse.openGraph, url: 'javascript:alert(1)' } });
    const { container } = render(<OpenGraphReactComponent site="https://example.com" appId="abc" component="small" />);

    await waitFor(() => expect(container.querySelector('a')).not.toBeNull());
    expect(container.querySelector('a').getAttribute('href')).toBeNull();
  });
});

describe('buildRequestUrl', () => {
  it('sends accept_lang as a real query parameter', () => {
    const url = new URL(buildRequestUrl({ site: 'https://example.com', appId: 'abc' }));
    expect(url.searchParams.get('accept_lang')).toBe('auto');
    expect(url.searchParams.get('app_id')).toBe('abc');

    const withLang = new URL(buildRequestUrl({ site: 'https://example.com', appId: 'abc', acceptLang: 'en-US' }));
    expect(withLang.searchParams.get('accept_lang')).toBe('en-US');
  });

  it('calls the proxy without an app_id when proxyUrl is set', () => {
    const url = new URL(buildRequestUrl({ site: 'https://example.com', appId: 'abc', proxyUrl: 'https://my.app/api/og', fullRender: true }));
    expect(url.origin + url.pathname).toBe('https://my.app/api/og');
    expect(url.searchParams.get('site')).toBe('https://example.com');
    expect(url.searchParams.get('full_render')).toBe('true');
    expect(url.searchParams.has('app_id')).toBe(false);
  });
});

describe('ErrorBoundary', () => {
  it('swallows render errors from a card', () => {
    const Boom = () => { throw new Error('boom'); };
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(container.innerHTML).toBe('');
    console.error.mockRestore();
  });
});

describe('URL parsing crash fixes', () => {
  it('LinkedIn card survives a missing or invalid url', () => {
    expect(() => render(<LinkedInComponent resultsToUse={{ title: 'x' }} />)).not.toThrow();
    expect(() => render(<LinkedInComponent resultsToUse={{ title: 'x', url: 'not a url' }} />)).not.toThrow();
  });

  it('getProductInfo survives a missing url', () => {
    expect(() => getProductInfo({ products: [{ name: 'x' }] })).not.toThrow();
  });
});

describe('video iframe', () => {
  const base = { title: 't', url: 'https://example.com/', image: 'https://example.com/og.png' };

  it('sandboxes allow-listed https embeds', () => {
    const { container } = render(<RenderLarge resultsToUse={{ ...base, video: 'https://www.youtube.com/embed/abc' }} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin allow-presentation');
    expect(iframe.getAttribute('allow')).not.toMatch(/autoplay|accelerometer|gyroscope/);
  });

  it('falls back to the image for unknown or plain-http video hosts', () => {
    for (const video of ['https://evil.example/player', 'http://www.youtube.com/embed/abc']) {
      const { container } = render(<RenderLarge resultsToUse={{ ...base, video }} />);
      expect(container.querySelector('iframe')).toBeNull();
      expect(container.querySelector('img')).not.toBeNull();
    }
  });
});

// OGR-005 follow-up (#46): every mount used to issue its own request, with no
// way to stop one whose card had already left the page. In direct mode each of
// those requests spends the site's API key from a visitor's browser.
describe('request sharing', () => {
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('makes one request when the same card is mounted several times', async () => {
    const fetchMock = mockFetch(ogResponse);
    const { container } = render(
      <div>
        <OpenGraphReactComponent site="https://example.com" appId="abc" />
        <OpenGraphReactComponent site="https://example.com" appId="abc" />
        <OpenGraphReactComponent site="https://example.com" appId="abc" component="small" />
      </div>
    );

    await waitFor(() => expect(container.querySelectorAll('img').length).toBeGreaterThanOrEqual(2));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('makes one request under React.StrictMode', async () => {
    const fetchMock = mockFetch(ogResponse);
    const { container } = render(
      <React.StrictMode>
        <OpenGraphReactComponent site="https://example.com" appId="abc" />
      </React.StrictMode>
    );

    await waitFor(() => expect(container.querySelector('.wrapperLarge')).not.toBeNull());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(false);
  });

  it('reuses a recent answer for a later mount, and asks again for a different site', async () => {
    const fetchMock = mockFetch(ogResponse);
    const first = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);
    await waitFor(() => expect(first.container.querySelector('.wrapperLarge')).not.toBeNull());
    first.unmount();

    const second = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);
    await waitFor(() => expect(second.container.querySelector('.wrapperLarge')).not.toBeNull());
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const third = render(<OpenGraphReactComponent site="https://example.org" appId="abc" />);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(third.container.querySelector('.wrapperLarge')).not.toBeNull());
  });

  it('always asks again when forceCacheUpdate is set', async () => {
    const fetchMock = mockFetch(ogResponse);
    const first = render(<OpenGraphReactComponent site="https://example.com" appId="abc" forceCacheUpdate />);
    await waitFor(() => expect(first.container.querySelector('.wrapperLarge')).not.toBeNull());
    first.unmount();

    const second = render(<OpenGraphReactComponent site="https://example.com" appId="abc" forceCacheUpdate />);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(second.container.querySelector('.wrapperLarge')).not.toBeNull());
  });

  it('aborts a request once the only card waiting for it unmounts', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    const { unmount } = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);
    const { signal } = global.fetch.mock.calls[0][1];
    expect(signal.aborted).toBe(false);

    unmount();
    await tick();
    expect(signal.aborted).toBe(true);
  });

  it('keeps a shared request alive while another card still waits for it', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    const first = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);
    render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    first.unmount();
    await tick();
    expect(global.fetch.mock.calls[0][1].signal.aborted).toBe(false);
  });

  it('does not remember an error response or a failed request', async () => {
    mockFetch({ error: { code: 101, message: 'Invalid API key' } });
    await requestResults('https://opengraph.io/api/1.1/site/x?app_id=bad').promise;
    mockFetch(ogResponse);
    const body = await requestResults('https://opengraph.io/api/1.1/site/x?app_id=bad').promise;
    expect(body).toEqual(ogResponse);

    global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
    await expect(requestResults('https://opengraph.io/api/1.1/site/y').promise).rejects.toThrow('offline');
    mockFetch(ogResponse);
    await expect(requestResults('https://opengraph.io/api/1.1/site/y').promise).resolves.toEqual(ogResponse);
  });

  it('does not update a card after it unmounted', async () => {
    let resolveFetch;
    global.fetch = jest.fn(() => new Promise((resolve) => { resolveFetch = resolve; }));
    const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
    const keep = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);
    const gone = render(<OpenGraphReactComponent site="https://example.com" appId="abc" />);

    gone.unmount();
    resolveFetch({ json: () => Promise.resolve(ogResponse) });
    await waitFor(() => expect(keep.container.querySelector('.wrapperLarge')).not.toBeNull());
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });
});
