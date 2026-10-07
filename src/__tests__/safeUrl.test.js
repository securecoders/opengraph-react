import { safeUrl } from '../util/safeUrl';
import { getResultsToUse } from '../util/getResultsToUse';

describe('safeUrl', () => {
  it.each([
    'javascript:alert(1)',
    ' JaVaScRiPt:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'blob:https://example.com/uuid',
    'file:///etc/passwd',
    'not a url',
    '',
    null,
    undefined,
    42,
  ])('rejects %p', (value) => {
    expect(safeUrl(value)).toBeUndefined();
  });

  it('keeps http and https URLs', () => {
    expect(safeUrl('https://example.com/a?b=1')).toBe('https://example.com/a?b=1');
    expect(safeUrl('http://example.com')).toBe('http://example.com/');
  });
});

describe('getResultsToUse', () => {
  it('drops unsafe url, image, favicon and video values', () => {
    const results = getResultsToUse({
      openGraph: { url: 'javascript:alert(1)', image: { url: 'data:image/svg+xml,<svg onload=alert(1)>' }, video: { secure_url: 'vbscript:x' } },
      htmlInferred: { favicon: 'javascript:alert(2)' },
    });
    expect(results.url).toBeUndefined();
    expect(results.image).toBeUndefined();
    expect(results.video).toBeUndefined();
    expect(results.favicon).toBeUndefined();
  });

  it('sanitizes product image URLs and ignores non-array products', () => {
    const results = getResultsToUse({
      url: 'https://shop.example/item',
      hybridGraph: { products: [{ name: 'Thing', images: ['javascript:alert(1)', 'https://cdn.example/a.png'] }, null] },
    });
    expect(results.products).toEqual([{ name: 'Thing', images: ['https://cdn.example/a.png'] }]);

    expect(getResultsToUse({ products: 'nope' }).products).toBeUndefined();
    expect(getResultsToUse({ products: [] }).products).toBeUndefined();
  });

  it('accepts a string og:image', () => {
    expect(getResultsToUse({ openGraph: { image: 'https://cdn.example/a.png' } }).image).toBe('https://cdn.example/a.png');
  });
});
