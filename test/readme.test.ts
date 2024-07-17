import { kebabCase } from 'lodash';

import {
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import {
  join,
  resolve
} from 'node:path';

enum IteratingPosition {
  beforeSection,
  beforeCode,
  inCode,
  beforeResult,
  inResult,
  afterResult,
}

const tmpDirCodeSubdir = 'tmp-readme-code';
const codeDirPath = join(__dirname, tmpDirCodeSubdir);

describe('Dynamic tests from README.md', () => {

  // Each example must be structured as follows:

  /*
  # Title

  ```js
  // code here
  // must end with
  const html = ...
  ```

  ```html
    Expected string here
  ```
  */

  // Other lines between these sections are ignored.
  // the `const html` line is changed to be an export so it can be tested
  // the exported html is compared to the expected result ignoring whitespace.

  let currentSection = '';
  let currentCode = '';
  let currentResult = '';
  let pos = IteratingPosition.beforeSection;

  const readmePath = resolve(__dirname, '../README.md');
  const readmeContent = readFileSync(readmePath, 'utf-8');
  const readmeLines = readmeContent.split('\n');

  readdirSync(codeDirPath).forEach(
    filename => unlinkSync(join(codeDirPath, filename))
  );

  readmeLines.forEach(processReadmeLine);

  function processReadmeLine(line: string) {

    switch (pos) {
      case IteratingPosition.inCode:
        if (line === '```') {
          pos = IteratingPosition.beforeResult;
        } else {
          const linePrefix = line.startsWith('const html = ')
            ? 'export '
            : '';
          currentCode += `${ linePrefix }${ line }\n`;
        }
        return;

      case IteratingPosition.inResult:
        if (line === '```') {
          pos = IteratingPosition.afterResult;
          finishSample(
            currentSection,
            currentCode,
            currentResult
          );
        } else {
          currentResult += `${ line }\n`;
        }
        return;

      case IteratingPosition.beforeSection:
      case IteratingPosition.afterResult:
        processMaybeStartLine(line);
        return;

      case IteratingPosition.beforeCode:
        if (!processMaybeStartLine(line) && line == '```js') {
          pos = IteratingPosition.inCode;
        }
        return;

      case IteratingPosition.beforeResult:
        if (!processMaybeStartLine(line) && line == '```html') {
          pos = IteratingPosition.inResult;
        }
        return;
    }
  }

  function processMaybeStartLine(line: string) {
    if (line.startsWith('# ')) {
      pos = IteratingPosition.beforeCode;
      currentSection = line.substring(2);
      currentCode = '';
      currentResult = '';
      return true;
    }
    return false;
  }

});

function finishSample(
  sectionName: string,
  code: string,
  expectedHtml: string,
) {
  const codeModuleName = kebabCase(sectionName);
  const codePath = resolve(codeDirPath, `${ codeModuleName }.ts`);
  writeFileSync(codePath, code);

  test(sectionName, async () => {
    const { html } = await import(`./${ tmpDirCodeSubdir }/${ codeModuleName }`);
    const actual = oneLine(html);
    const expected = oneLine(expectedHtml);
    expect(actual).toBe(expected);
  });
}

function oneLine(html: unknown) {
  return (html as string).trim().replace(/[ \n]+/g, ' ');
}
