# intl-messageformat-html

HTML tag functions for use with [intl-messageformat](https://www.npmjs.com/package/intl-messageformat) ([docs](https://formatjs.io/docs/intl-messageformat)). Almost all html elements and attributes are supported, although only a minimal set are recommended. Custom tag functions can also be easily integrated to use CSS to style your localized text.

```html
Hi {name}! Welcome to <strong>intl-messageformat-html</strong>.
```

# Installation

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
  Welcome to the German version (<image src="/images/flag-de.png" />).
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
  Hi John! Welcome to <strong>intl-messageformat-html</strong>.
```

And when rendered as HTML:

> Hi John! Welcome to **intl-messageformat-html**!

# Safety and entity encoding

Generating dynamic HTML is dangerous since data from a user could inject malicious HTML into the document. `intl-messageformat-html` provides *partial* protection against this. Any content that comes from interpolated values is entity encoded. The messages themselves are not. The reason for this is the messages will contain tags, which must not be entity encoded, and nested tags, which are necessary for certain constructs, like lists and formatting inside links, will not render as desired if entity encoded.

With this in mind, and it's almost universal anyways, the messages themselves should not be user-generated content, or if they are, they should be validated to be safe **before** sending to `intl-messageformat-html`. This also means that messages that have content that must be entity-encoded are encoded in the source messages themselves.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { wrapValues } from 'intl-messageformat-html';

const values = {
  name: 'John & Joe',
};

const message = 'Hi {name}! Welcome to <strong>Bob &amp; Bill&apos;s Service</strong>.';
const html = new IntlMessageFormat(message, 'en').format(wrapValues(values));
```

Resulting string:

```html
  Hi John &amp; Joe! Welcome to <strong>Bob &amp; Bill&apos;s Service</strong>.
```

Note how the first `&` inside the interpolated values is **not** encoded ihe source but is encoded in the output and
the `&` and `'` in the message are entity-encoded **before** the message is processed. The result is that both are
properly encoded in the output.

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

And when rendered as HTML (given styling `.value { text-transform: uppercase; }`):

> Age must be specified as an INTEGER.

# SVG Elements

While it should probably be used very sparingly, SVG is also supported.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = `
  Click on the red (<svg><width>16</width><height>16</height>
    <rect><width>16</width><height>16</height><style>fill:red;</style></rect>
  </svg>) box.
`;
const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
```

Resulting string:

```html
  Click on the red (<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" style="fill:red;" />
  </svg>) box.
```

Note that the namespace is added automatically to the `<svg>` element, if not otherwise specified.

# Performance

Localized strings can often be generated a hundred or more times in a single frame. Performance is critical in processing these strings and `intl-messageformat-html` has important characteristics to not degrade performance of localization.

### Constant `tagFunctions`

The `tagFunctions` constant itself is of course a constant. It's generated once at the start of the application and never needs to change, regardless of usage or locale. Whenever you do not need your own interpolated values or custom CSS classes, passing `tagFunctions` will yield the best results.

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';

const message = 'Welcome to <strong>intl-messageformat-html</strong>!';
const html = new IntlMessageFormat(message, 'en').format(tagFunctions);
```

### Multiproxy from `utikity`

When you do need your own interpolated values it's critical to use the `wrapValues` helper and not spread across your values and `tagFunctions`. The spread operator is the most common and generally recommended way to combine objects, but in this specific use case it is not optimal. Since your message will use only a small fraction of values from the tag functions, using spread to create a combined object will perform a lot more work than cherry-picking only the used functions.

Performance of `wrapValues` is achieved through use of a Multiproxy from [utikity](https://www.npmjs.com/package/utikity). Instead of creating a new object with the properties of your interpolated values and the tag functions, the Multiproxy is a proxy that will first return any requested value from your interpolated values and, if not found, then will return the value from the tag functions.

The code behind `wrapValues` is essentially like this (but has other performance optimizations too):

```js
import { IntlMessageFormat } from 'intl-messageformat';
import { tagFunctions } from 'intl-messageformat-html';
import { createMultiproxy } from 'utikity';

const values = {
  name: 'John',
};

// Don't do this, it's just a demonstration
const combinedTags = createMultiproxy(values, tagFunctions);

const message = 'Hi {name}! Welcome to <strong>intl-messageformat-html</strong>.';
const html = new IntlMessageFormat(message, 'en').format(combinedTags);
```

### Caching in `wrapValues` and `createClassTagFunctions`

It's also extremely common to call `wrapValues` and `createClassTagFunctions` repeatedly with the same set of values and classes. This is particularly true in React where components are rendered with the same inputs to identify if the resulting content actually changed. Therefor both `wrapValues` and `createClassTagFunctions` will cache the resulting multiproxy and custom tag functions object based on the input values and class list.

The pseudo-code representing this caching is essentially this:

```js
const cache = new Map();

function createClassTagFunctions(classes) {
  if (cache.has(classes)) {
    return cache.get(classes);
  }
  const customTagFunctions = realCreateClassTagFunctions(classes);
  cache.set(classes, customTagFunctions);
  return customTagFunctions;
}

function wrapValues(values) {
  if (cache.has(values)) {
    return cache.get(values);
  }
  const multiproxy = createMultiproxy(values, tagFunctions);
  cache.set(classes, multiproxy);
  return multiproxy;
}
```

The cache doesn't actually store all values forever though. It will store approximately up to the cache size (default 100) and then purge the cache if the cache size is reached. The cache size is approximate because purging happens on the next frame so within a single frame, the cache size can be exceeded. When purged, the cache is reduced to at most 60% of the cache size depending on how long items have been in the cache and how often they've been used.

The cache size can be overridden and caching can be disabled entirely by setting the cache size to zero.

```js
import { setTagFunctionCacheSize } from 'intl-messageformat-html';

// to cache more
setTagFunctionCacheSize(1000);

// to not cache at all
setTagFunctionCacheSize(0);
```