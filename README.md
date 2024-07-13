# intl-messageformat-html

HTML tag functions for use with [intl-messageformat](https://www.npmjs.com/package/intl-messageformat) ([docs](https://formatjs.io/docs/intl-messageformat)). Almost all html elements and attributes are supported, although only a minimal set are recommended. Custom tag functions can also be easily integrated to use CSS to style your localized text.

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

```html
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

```html
  Welcome to the German version (<image src="/images/flag-de.png"></image>).
```

And when rendered as HTML:

> Welcome to the German version (![German Flag](./assets/flag-de.png)).

# Interpolated Values

The examples so far all passed the constant `tagFunctions` provided by `intl-messageformat-html` as the values argument to add support for HTML tags. You'll likely have your own values though to interpolate data into your localized strings. To support this, `intl-messageformat-html` provides a helper function `wrapValues`. This allows you to provide your own values for interpolation and also support HTML tags at the same time.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { wrapValues } from 'intl-messageformat-html';

const values = {
  name: 'John',
};

const message = 'Hi {name}! Welcome to <strong>intl-messageformat-html</strong>.';
const html = new IntlMessageFormat(message, 'en').format(wrapValues(values));
```

Resulting string:

```html
  Hi John! Welcome to <strong>intl-messageformat-html</strong>!
```

And when rendered as HTML:

> Hi John! Welcome to **intl-messageformat-html**!

# Links

Links are the only element given special treatment. By default any link will have the `target` attribute
added automatically with a value of `_blank`. This attribute is not added if a `target` is explicitly provided in the message.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = 'Check out the latest <a><href>https://cnn.com</href>news on CNN</a>.';
const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
```

Resulting string:

```html
  Check out the latest <a href="https://cnn.com" target="_blank">news on CNN</a>.
```

And when rendered as HTML:

> Check out the latest <a href="https://cnn.com" target="_blank">news on CNN</a>.

And to override the default behavior:

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = '<a><href>#content</href><target>_self</target>Skip to content</a>';
const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
```

Resulting string:

```html
  <a href="#content" target="_self">Skip to content</a>
```

And when rendered as HTML:

> <a href="#content" target="_self">Skip to content</a>

# CSS Classes

In addition to standard HTML elements, `intl-messageformat-html` makes it easy to create content with custom CSS classes. To do this pass an array of class names to either `createClassTagFunctions` or as a second parameter to `wrapValues`. Each class name can be specified as a tag within the message.

Custom class tags are rendered as `span` elements.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { createClassTagFunctions } from 'intl-messageformat-html';

const classes = [ 'value' ];
const message = 'Age must be specified as an <value>integer</value>.';
const html = new IntlMessageFormat(message, 'en').format(createClassTagFunctions(classes));
```

Resulting string:

```html
  Age must be specified as an <span class="value">integer</span>.
```

And when rendered as HTML (given styling `.value { color: red; }`):

> Age must be specified as an <span style="color:red">integer</span>.

# SVG Elements

While it should probably be used very sparingly, SVG is also supported.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = `
  Click on the red (<svg><width>16<width/><height>16</height>
    <rect><width>16<width/><height>16</height><style>fill:red;</style></rect>
  </svg>) box.
`;
const html = new IntlMessageFormat(message, 'en').format(wrapValues(tagFunctions, classes));
```

Resulting string:

```html
  Click on the red (<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" style="fill:red;"></rect>
  </svg>) box.
```

Note that the namespace is added automatically to the `<svg>` element, if not otherwise specified.



