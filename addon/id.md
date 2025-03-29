[« Back to Docs](./)


# Baremark Addon: `id.js`

Source: [`addon/id.js`](addon/id.js)

Adds the Markdown tag `[#...]` which inserts an HTML anchor (`<a
id="..."></a>`) into the document. Or, if the `[#...]` tag occurs first within
the content of an HTML element, it will instead add an `id='...'` attribute to
that tag. – You can thus put `[#...]` at the beginning of paragraph (or
heading, or other element) in order to add the specified `id` to that element.
If the element in question already has an `id` attribute, then a `<a
id="..."></a>` tag will be inserted instead.

Specified IDs should not contain space, colon, period or square brackets
` .:[]`. (Colon and period interferes with CSS styling.)

**NOTE:** Spaces and tabs following the tag are also stripped, but not newline
(as this can cause a mess inside tables). If you put a `[#...]` in a paragraph
of its own you’ll get an empty paragraph with a single `<a>` tag in it!)

<!--[eof]-->
