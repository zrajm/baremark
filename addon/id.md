# `addon/id.js`

`[#...]` -> `<a id="..."></a>`, or, if it comes after another HTML opening tag
w/o an 'id' attribute, it instead adds an id attribute to that tag. (Meaning
that you can put in first in a paragraph, or heading to give that paragraph or
heading an id.) IDs must not contain space, nor any of '.:[]' (colon and period
interferes with CSS styling). Note: Spaces and tabs following the tag are also
stripped, but not newline (as this can cause a mess inside tables). If you put
a [#...] in a paragraph of its own you'll get an empty paragraph with a single
<a> tag in it!)

<!--[eof]-->
