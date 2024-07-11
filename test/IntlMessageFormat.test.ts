import { IntlMessageFormat } from 'intl-messageformat';
import { wrapValues } from '../src/index.ts';

const interpolationValues = {
  firstName: 'John',
  lastName: 'Doe',
  age: 47,
};

createTest(
  'MessageFormat sanity',
  'String to string',
  'String to string',
);

createTest(
  'Interpolation sanity',
  'Hello {firstName}!',
  'Hello John!',
);

createTest(
  'List',
  '<li>One</li><li>Two</li>',
  '<li>One</li><li>Two</li>',
);

createTest(
  'Nested list',
  '<ul><li>One</li><li>Two</li></ul>',
  '<ul><li>One</li><li>Two</li></ul>',
);

createTest(
  'Link',
  'For more information <a><href>https://cnn.com</href>visit CNN</a>.',
  'For more information <a href="https://cnn.com" target="_blank">visit CNN</a>.',
);

function createTest(
  name: string,
  input: string,
  expected: string,
  classNames?: string[]
) {
  test(name, () => {
    const actual = new IntlMessageFormat(input)
      .format(
        wrapValues(interpolationValues, classNames)
      );
    expect(actual).toBe(expected);
  })
}
