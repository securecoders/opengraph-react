import React from 'react';
import { render, waitFor } from '@testing-library/react';
import OpenGraphReactComponent from '../index';
import RenderLarge from '../components/large';
import LinkedInComponent from '../components/linkedIn';
import ErrorBoundary from '../components/error';
import { getProductInfo } from '../util/getProductInfo';
import { buildRequestUrl } from '../util/buildRequestUrl';

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
