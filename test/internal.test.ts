import { entityEncode, extractEmbeddedTags } from '../src/internal';

describe('entityEncode', () => {

  test('None', () => {
    const actual = entityEncode('test');
    expect(actual).toBe('test');
  });

  test('All of them', () => {
    const actual = entityEncode(`<a href="link">John & O'Hara</a>`);
    expect(actual).toBe(`&lt;a href=&quot;link&quot;&gt;John &amp; O&apos;Hara&lt;/a&gt;`);
  });
});

describe('extractEmbeddedTags', () => {

  test('Link', () => {
    const actual = extractEmbeddedTags(
      '<href>https://cnn.com</href><title>CNN</title>See the latest news on CNN'
    );
    const expected = {
      href: 'https://cnn.com',
      title: 'CNN',
      text: 'See the latest news on CNN',
    };
    expect(actual).toEqual(expected);
  });

  test('Dashes', () => {
    const actual = extractEmbeddedTags(
      '<href>https://cnn.com</href><aria-label>Navigate to CNN.com</aria-label>See the latest news on CNN'
    );
    const expected = {
      href: 'https://cnn.com',
      'aria-label': 'Navigate to CNN.com',
      text: 'See the latest news on CNN',
    };
    expect(actual).toEqual(expected);
  });


  test('Only innermost tags', () => {
    const actual = extractEmbeddedTags(
      '<a><b>B</b>c</a>'
    );
    const expected = {
      b: 'B',
      text: '<a>c</a>',
    };
    expect(actual).toEqual(expected);
  });

  test('Ignore mismtached tags', () => {
    const actual = extractEmbeddedTags(
      '<a><b>c</c></a>'
    );
    const expected = {
      text: '<a><b>c</c></a>',
    };
    expect(actual).toEqual(expected);
  });
});
