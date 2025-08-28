[« Back to Docs](./)


# Baremark Addon: `autolink.js`

Source: [`addon/autolink.js`](addon/autolink.js)

This addon converts inline URLs to links. The link text will also show the the
URL, but are inserted `<wbr>` at good line breaking points (necessary since URL
can sometimes be ridiculously long).

When it comes to line breaking points the whole idea is that URLs are
*special,* so we break *before* dash (`-`) and period (`.`)—rather than
after—to clearly indicate that the punctuation is part of the URL and not added
by hyphenation or belonging to the surrounding text. The most prominent
exception to this is slash ('/') which is allowed at end of words.

Basically the URL is split into 'words', where each word consist of either:

* Upper, followed by lowercase letters (there must be at least one letter in
  total, and there may be more than one upper case letter; upper case
  `[\p{Lt}\p{Lu}]`, and lower case `\p{Ll}`.)
* A number (`\p{N}`).

Each word may (optionally) be preceded leading punctuation or other symbols.
(Math symbol `\p{S}`, separator `\p{Z}`, opening quotes `\p{Pi}`, opening
brackets `\p{Ps}`, dashes `\p{Pd}`, underscore etc. `\p{Pc}`, other `\p{Po}`)

And finally, each 'word' may be followed by slash (`/`) and closing punctuation
(closing brackets `\p{Pe}` or closing quotes `\p{Pf}`).

<!--[eof]-->
