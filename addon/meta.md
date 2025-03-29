# `addon/meta.js`

This module parses one paragraph of email-style metadata at the beginning of
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

Names consist of ASCII alphanumerical characters (`[a-zA-Z0-9_]`). Each line is
expected to begin with either a name, followed by a colon (without spaces
between), or be an indented continuation of the previous value, starting with
one or more whitespace characters (`[\t ]`).

Some names are special:

* `title`: If no `title` is found in the header, and there is a heading at the
  very top of the page (which is not preceded by any other content), then that
  heading will be removed form the document and used for the `title` value.

* `titleId`: If `title` is gotten from an HTML heading at the top of the
  document, then `titleId` will also be set. Either to the `id` attribute of
  that heading, or (if no `id` attribute could be found) `top`.

When invoking `baremark()` on your markdown, this addon will set the property
`baremark.meta` to an object with the name/value pairs that was found in your
markdown header (with metadata names in all lowercase).

**Note:** Loading `addon/toc.js` before `addon/meta.js`, will result in the
first heading of the page (the page title) being included in the
table-of-content.

**NOTE2:** If there is a HTML comment (`<!--…-->`) before the top heading, this
heading will not be correctly found, to avoid this problem the
`addon/uncomment.js` module is implicitly imported by this plugin.

<!--[eof]-->
