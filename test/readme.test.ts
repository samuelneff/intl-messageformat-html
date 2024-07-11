import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';


test('Simple example', () => {
  const message = `
  Welcome to <strong>intl-messageformat-html</strong>!
  <em>Add HTML to your localized messages!
  `;
  const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
  expect(oneLine(html)).toBe(`Welcome to <strong>intl-messageformat-html</strong>! <em>Add HTML to your localized messages!`);
});

function oneLine(html: unknown) {
  return (html as string).trim().replace(/[ \n]+/g, ' ');
}
