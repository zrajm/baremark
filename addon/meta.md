[« Back to Docs](./)


# Baremark Addon: `meta.js`

Source: [`addon/meta.js`](addon/meta.js)

This module parses one paragraph of email style metadata at the beginning of
the document, as well as any heading element at the top of the page.

Metadata consists of names and values in the following format:

```
Lang: la
Author: zrajm
Title: Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod
       Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
Created: 2023-06-29
Updated: 2025-03-25
License: CC BY-NC-SA (text), GPLv2 (code).
Favicon: latin-victorious.svg
```

Names consist of ASCII alphanumerical characters `[a-zA-Z0-9_]`. Each line is
expected to begin with either a name, followed by a colon (without spaces
between), or be an indented continuation of the previous value, starting with
one or more whitespace characters `[\t ]`.

Some metadata names are special:

* `title`: If no `title` is found in the header, and there is a heading at the
  very top of the page (which is not preceded by any other content), then that
  heading will be removed form the document and used for the `title` value.

* `titleId`: If the `title` value was obtained from an HTML heading at the top
  of the document, and that heading had an `id` attribute, then `titleId` will
  be set to the value of that `id` attribute (if no `id` attribute was found,
  `titleId` will be `undefined`)

When invoking `baremark()` on your Markdown, this addon will set the property
`baremark.meta` to an object with the name/value pairs that was found in your
markdown header (with metadata names in all lowercase). This means that you can
access, for example, the `title` metadata field as `baremark.meta.title`, the
`lang` value as `baremark.meta.lang` etc. (And `Object.keys(baremark.meta)`
would naturally give you a list of all values set.)

**NOTE:** Loading `addon/toc.js` before `addon/meta.js`, will result in the
first heading of the page (the page title) being included in the
table-of-content.

**NOTE2:** To avoid a problem where an HTML comment `<!--...-->` at the top of
the page would stop the top heading from being fond, this module implicitly
imports `addon/uncomment.js`, which strips HTML comments.

<!--[eof]-->
