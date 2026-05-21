[« Back to Docs](./)


# Baremark Addon: `id.js`

Source: [`addon/id.js`](addon/id.js)

Adds the Markdown tag `[#...]` which creates an `id` anchor point in the
resulting HTML document. Anchors let you create links internal to the page,
jump to a specific point in the page on page load, by adding hash/fragment
identifier (`#...`) to the end of the URL.

If `[#...]` is put at the beginning of a block-level element an `id` attribute
is inserted into that block’s HTML tag.—For example, putting `[#here]` at the
start of a paragraph, the HTML tag returned will be `<p id="here">` (instead of
the usual `<p>`).

If `[#...]` is used elsewhere (not in the beginning) in a block, or if that
block already has an `id` attribute in its HTML tag, the `[#...]` tag instead
results in an HTML anchor (`<a id="..."></a>`) being inserted into the output
document.

Specified IDs should avoid using space (` `), colon (`:`), period (`.`), or
square brackets (`[]`)—while technically allowed, these characters have special
meaning when writing CSS rules.

**NOTE:** Spaces and tabs found after the tag are stripped when processing the
Markdown, but newlines are left as-is (as stripping newlines cause a mess
inside tables). Also, if you write `[#...]` on a line of its own, and separated
by blank lines, you’ll get an empty paragraph with a single `<a>` tag in it.

<!--[eof]-->
