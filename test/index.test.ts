import {
  clearCaches,
  createAttributeTagFunctions,
  createClassTagFunctions,
  createElementTagFunctions,
  tagFunctions,
  wrapValues,
 } from '../src/index';

beforeEach(() => {
  clearCaches();
});

describe('createAttributeTagFunctions', () => {

  test('simple', () => {
    const fn = createAttributeTagFunctions([ 'a' ]).a;
    const actual = fn([ '123' ]);
    expect(actual).toBe(' a="123"');
  });
});

describe('createClassTagFunctions', () => {

  test('simple', () => {
    const fn = createClassTagFunctions([ 'c' ]).c;
    const actual = fn([ '123' ]);
    expect(actual).toBe('<span class="c">123</span>');
  });
});

describe('createElementTagFunctions', () => {

  test('simple', () => {
    const fn = createElementTagFunctions([ 'e' ]).e;
    const actual = fn([ '123' ]);
    expect(actual).toBe('<e>123</e>');
  });

  test('with attributes', () => {
    const fn = createElementTagFunctions([ 'e2' ]).e2;
    const actual = fn([ ' a="123" bcd="456"789' ]);
    expect(actual).toBe('<e2 a="123" bcd="456">789</e2>');
  });

  // test('with entities', () => {
  //   const fn = createElementTagFunctions([ 'e3' ]).e3;
  //   const actual = fn([ ' a="b&amp;c"He said "hi".' ]);
  //   expect(actual).toBe('<e3 a="b&amp;c">He said &quot;hi&quot;.</e3>');
  // });
});

describe('tagFunctions', () => {
  test('li', () => {
    const fn = tagFunctions.li;
    const actual = fn([ 'content' ]);
    expect(actual).toBe('<li>content</li>');
  });

  test('link', () => {
    const fn = tagFunctions.a;
    const actual = fn([ 'content' ]);
    expect(actual).toBe('<a target="_blank">content</a>');
  });

  test('link with target', () => {
    const fn = tagFunctions.a;
    const actual = fn([ ' target="custom"content' ]);
    expect(actual).toBe('<a target="custom">content</a>');
  });
});

describe('wrapValues', () => {

  test('simple', () => {
    const values = {
      value: 123
    };
    const wrapped = wrapValues(values);
    expect(wrapped.value).toBe(123);

    const fn = wrapped.li;
    const taggedContent = fn([ 'content' ]);
    expect(taggedContent).toBe('<li>content</li>');
  });
});
