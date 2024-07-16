import {
  extractAttributesAndContent,
  ExtractedAttributes,
  extractEmbeddedTags
} from '../src/internal';

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

describe('extractAttributesAndContent', () => {

  test('No attributes', () => {
    const actual = extractAttributesAndContent('test');
    const expected: ExtractedAttributes = {
      attributes: '',
      content: 'test',
    };
    expect(actual).toEqual(expected);
  });

  test('One attribute', () => {
    const actual = extractAttributesAndContent(' attr="value here"test');
    const expected: ExtractedAttributes = {
      attributes: ' attr="value here"',
      content: 'test',
    };
    expect(actual).toEqual(expected);
  });

  test('Multiple attributes', () => {
    const actual = extractAttributesAndContent(' a1="abc" a2="def"test');
    const expected: ExtractedAttributes = {
      attributes: ' a1="abc" a2="def"',
      content: 'test',
    };
    expect(actual).toEqual(expected);
  });
});
