import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';


// import { readFile } from 'node:fs/promises';
// import { resolve } from 'node:path';

// describe('Dynamic tests from README.md', async () => {

//   // const filePath = resolve(__dirname, '../README.md');
// });


test('Simple example', () => {
  const message = `
  Welcome to <strong>intl-messageformat-html</strong>!
  <em>Add HTML to your localized messages!</em>
  `;
  const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
  expect(oneLine(html)).toBe(`Welcome to <strong>intl-messageformat-html</strong>! <em>Add HTML to your localized messages!</em>`);
});

function oneLine(html: unknown) {
  return (html as string).trim().replace(/[ \n]+/g, ' ');
}

test('Attributes', () => {
  const message = 'Welcome to the German version (<image><src>/images/flag-de.png</src></image>).';
  const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
  expect(html).toBe('Welcome to the German version (<image src="/images/flag-de.png" />).');
});

