# intl-messageformat-html

HTML tag functions for use with (intl-messageformat)[https://www.npmjs.com/package/intl-messageformat] ((docs)[https://formatjs.io/docs/intl-messageformat]). Almost all html elements and attributes are supported, although only a minimal set are recommended. Custom tag functions can also be easily integrated to use CSS to style your localized text.

# installation

```bash
npm i intl-messageformat-html
```

# Simple example

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = `
  Welcome to <strong>intl-messageformat-html</strong>!
  <em>Add HTML to your localized messages</em>.
  `;
const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
```

Resulting string:

```text
  Welcome to <strong>intl-messageformat-html</strong>!
  <em>Add HTML to your localized messages</em>.
```

And when rendered as HTML:

> Welcome to **intl-messageformat-html**!
>
> *Add HTML to your localized messages*.

***What did the library do?***

In this example, it looks like `intl-messageformat-html` didn't really do anything, and that's in a way true. It reconstructed the same html that existed in the source messages. `intl-messageformat-html` is still necessary in this example though since `intl-messageformat` requires a tag function be defined for every tag used. By providing "passthrough" tag functions that recreate the same HTML then all simple HTML (without attributes) can be used in localization messages.

# Attributes

While we recommend avoiding complex HTML inside localized messages, there are instances where some HTML with attributes are useful and appropriate. `intl-messageformat-html` supports *almost* all atributes for supported HTML elements.

`intl-messageformat` does not allow specifying attributes on tags so `intl-messageformat-html` supports specifying attributes as embedded tags.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = 'Welcome to the German version (<image><src>/images/flag-de.png</src></image>).';
const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
```

Resulting string:

```text
  Welcome to the German version (<image src="/images/flag-de.png"></image>).
```

And when rendered as HTML:

> Welcome to the German version (![German Flag](./assets/flag-de.png)).
