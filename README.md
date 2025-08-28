Baremark: A Tiny Markdown Engine
================================
**22 September 2024 – Breaking changes.** Where previously `baremark.add(...)`
was used to extend rules, now use `baremark().push([...])`. (*Note the added
brackets!*) – This makes Baremark smaller *and* adds more flexibility! All
Javascript array methods may now be used to work with the ruleset. (For
example, one may now use `baremark().unshift([...])` to add a rule to be
executed first, which wasn’t previously possible.)

*Baremark* is a minimal (but extendable) [Markdown] parser written in
Javascript, originally inspired by Van Tigranyan’s Gist [Landmark], but with
added bugfixes, optimizations, support for labeled links/images, and a little
more [CommonMark] compliance. (Note that Baremark never will be *fully*
CommonMark compliant, as the intent of Baremark is source code brevity above
featurefulness.)

* [README]
* [Source code]
* [Test suite]
* [Github repo]

It is currently 1985 bytes in size *before* minification and zipping!


<toc heading=Contents class=toc>


[Usage]: #usage
Usage
=====
Baremark can be invoked in two ways.

* `baremark(MARKDOWN)` – Expand `MARKDOWN` and return the resulting HTML. (Most
  of the time, this is the only function you need.)
* `baremark()` – Returns the list of rules used internally by Baremark. This is
  used to extend the Baremark rules (for supporting your own non-standard
  Markdown). See below.
* `baremark.escape(STRING)` – Expands any characters in `STRING` that are
  special in Markdown into HTML `&#...;` entities. This means that further
  processing will not affect `STRING`. For example use, see below.


[Extending Baremark]: #extending-baremark
Extending Baremark
------------------
Baremark’s internals are very simple. It consists of a list of rules, which are
applied, in order, to the given Markdown text. Each rule is passed on *exactly
as-is* to the Javascript `replace()` string method. Yet, from this simplicity
come remarkable versatility.


[Addons]: #addons
### Addons

**Note:** Please bear in mind that the addon system of Baremark is still new,
and might change in the future.

In there is a directory called `addon/` in the repository, containing addons
you can play with. These addons are, still a little bit of a work-in-progress,
but they are perfectly usable.

| See              | Description                              | Source                         |
|------------------|------------------------------------------|--------------------------------|
| [Docs][autolink] | Turn plain URLs into links.              | [`autolink.js`][autolink.js]   |
| [Docs][id]       | Use `[#id]` to create named HTML anchor. | [`id.js`][id.js]               |
| [Docs][meta]     | Email-style metadata at beginning.       | [`meta.js`][meta.js]           |
|                  | Use `^sup^` for superscript.             | [`sup.js`][sup.js]             |
| [Docs][table]    | GFM-style tables.                        | [`table.js`][table.js]         |
| [Docs][toc]      | Add table-of-contents.                   | [`toc.js`][toc.js]             |
|                  | Remove HTML comments.                    | [`uncomment.js`][uncomment.js] |

[autolink.js]: addon/autolink.js
[autolink]: ?addon/autolink.md
[id.js]: addon/id.js
[id]: ?addon/id.md
[meta.js]: addon/meta.js
[meta]: ?addon/meta.md
[sup.js]: addon/sup.js
[sup]: ?addon/sup.md
[table.js]: addon/table.js
[table]: ?addon/table.md
[toc.js]: addon/toc.js
[toc]: ?addon/toc.md
[uncomment.js]: addon/uncomment.js
[uncomment]: ?addon/uncomment.md

Order (sometimes) matter when you import these, as they add rules to the end or
the beginning of the Baremark ruleset, and the order in which the rules are
executed matters. Though it’s somewhat cumbersome, the loading of addons in a
specific order can be achieved using Javascript dynamic imports.

```
import('./addon/table.js')
  .then(() => import('./addon/meta.js'))
  .then(() => import('./addon/toc.js'))   // toc likes to be last
  .then(() => {
    ...baremark(MARKDOWN)...
  })
```

Or, in HTML:

```
<script src="./addon/table.js"></script>
<script src="./addon/meta.js"></script>
<script src="./addon/toc.js"></script><!-- toc likes to be last -->
<script>
  ...baremark(MARKDOWN)...
</script>
```

Plugins `import` their own dependencies, meaning that you don’t have to load
Baremark itself, you can just import the addons you need, and those will make
sure that base `baremark.js` is loaded. (Also, `meta.js` and `toc.js` both
depend on `uncomment.js` since that’s needed for them working correctly.)


[Rolling Your Own]: #rolling-your-own
### Rolling Your Own

When inserting new rules, you generally should avoid putting them first and
last in the existing ruleset. This is because the first four rules, and the
very last rule have very specific tasks.

* The *first four rules* normalize whitespace and escape characters in
  different ways (that is, protect them from additional processing, as is
  expected with backslash escapes `\X`, ` ```CODEBLOCKS``` ` and `` `CODE` ``).
  – In order to not mess with this, you should insert new rules *after* this.

* The *last rule* wraps any remaining paragraph-like text chunks in HTML `<p>`
  tags. – In order to not have to deal with spurious `<p>` tags in your input
  you most likely want to put your rules before this.

Line endings are normalized by the first builtin rule of Baremark.
Normalization strips any trailing spaces and tabs, and make sure all lines end
in `\n` (converting any found Windows `\r\n` and old Mac `\r` line endings).
This means that your rules need not match trailing space they should be added
after that, or, if you *want* to match trailing space, that your new rule have
to be added *before* the builtin rules (using `baremark().unshift()`).

Let’s take an example. The below rule turns `[#anchor]` into `<a
id="anchor"></a>` (see also [`id.js`][id]), which allows you to add URL anchors
to your document, which you can then link to (e.g. using `[link](#anchor)` or
`[link](file#anchor)`).—This rule is here added to the end of the current
Baremark ruleset using `baremark().push()` (meaning that it will be applied
*after* all the previously existing rules).

```
// Fragment URL anchor: Turns `[#text]` into <a id="text"></a>.
baremark().push([/\[#([^.:\[\]\s]+)\][\t ]*/g, '<a id="$1"></a>'])
```

Multiple rules can be added at the same time:

```
baremark().unshift(
    [/\[#([^.:\[\]\s]+)\][\t ]*/g, '<a id="$1"></a>'],        // hash anchor
    [/\b[a-z]+:\/\/[^ \n<>]*\w/gi,x =>                        // autolink URL
        `<a href="${baremark.escape(x)}">${baremark.escape(x)}</a>`],
)
```

Above we also use the `baremark.escape()` to prevent the autolinked URL from
being further processed by Baremark. In this case it is used to stop any
Markdown found in the URL from being further expanded. (We wouldn’t want for
example `_..._` inside a filename to be replaced with `<i>...</i>`, now would
we?)

Finally, since rules are passed exactly as-is to the Javascript string method
`replace()`, so the [MDN docs] on the subject is recommended reading.


[Common Gotchas]: #common-gotchas-when-extending-baremark
Common Gotchas when Extending Baremark
--------------------------------------
**Forgetting the `[` and `]` around the rules.** – If you forget the brackets
when adding rules (with `baremark().push([...])` or
`baremark().unshift([...])`) you’ll get a very cryptic error message upon
running `baremark(MARKDOWN)`.

```
Uncaught TypeError: r is not iterable
```

**Forgetting the `/g` flag on the regex.** – If you forget this flag, your
regex will only be applied once. This is very seldom the right choice and can
lead to some hand-to-find errors. (Though, for a counterexample, have a look at
source of the [`meta.js`][meta.js] addon.)

**Each regex is applied to the *entirety* of the Markdown source.** – Thus, for
inline elements, you need to make *sure* that you allow single newlines to
match inside your Markdown element, but never *two newlines after each other*
(or your element will match across paragraph borders). The rule for `**bold**`,
for example, look like this:

```
[/(\*\*|__)(\n?(.+\n)*?.*?)\1/g,'<b>$2</b>']
```

Notice the `(\n?(.+\n)*?.*?)` part in the middle? That matches, ‘one optional
newline’ (`\n?`), followed by ‘as few as possible, optional, lines that has at
least one non-newline character, and ends in newline’ (`(.+\n)*?`), followed by
‘as few as possible, optional, non-newline characters’ (`.*?`). – That’s a
pretty elaborate way to say that `**...**` shouldn’t match if there are two
newlines next to each other inside it.


[Limitations]: #limitations
Limitations
===========
These limitations might change in the future.

* Indentation is ignored.
* Fenced [code blocks] are supported, but not indented ones.
* [Blockquotes] cannot be nested.
* [Lists] cannot be nested.
* Autolinks `<URL>` are not supported.
* Determining what is a [paragraph] and what is a [HTML block] from is somewhat
  simplistic.
* Whitespace in not allowed between `](` or `][` in [links and images]. This
  allowed in the [CommonMark] specification, but can lead to weird errors.
  (Baremark allow space inside the brackets though, so your line wrapping
  shouldn’t be too affected.)


[Markdown]: #markdown
Markdown
========
Even though much inspiration is taken from [CommonMark], Baremark sometimes go
in a slightly different direction (usually to keep the code minimal), see
[Limitations]. Most advanced Markdown features (such as tables) are not
supported out-of-the-box, but you may use [extensions][extending baremark] to
add missing functionality.

The first step of Markdown processing normalizes line endings. This is done by
trimming off all trailing tabs and spaces, and converting the
end-line-character to `\n` (both Windows `\r\n` and old Mac `\r` line endings
are supported). This means that subsequent rules can be simplified, as they do
not have to factor in line-ending space.


[Block Elements]: #block-elements
Block Elements
--------------
Block elements are paragraph-level stuff, like lists, headings and the like.
Most of them are separated from the surrounding blocks by blank lines, though
some of them (like [blockquotes], [lists] and [label definitions]) do not
require that.


[Paragraph]: #paragraphs
[Paragraphs]: #paragraphs
### Paragraphs

Paragraphs are any text that is surrounded by blank lines, which isn’t
recognized as any other type of block. They are wrapped in a paragraph tag
`<p>...</p>`, and any Markdown contained in the paragraph is also expanded.


[HTML Block]: #html-blocks
[HTML Blocks]: #html-blocks
### HTML Blocks

The only difference between *HTML blocks* and [paragraphs] is that paragraphs
are outputted wrapped in paragraph tags `<p>...</p>`, while HTML blocks are
not. (Markdown is expanded in both paragraphs and HTML blocks.)

If one of the following HTML tags `<...>`, or their corresponding end tags
`</...>` is found at the beginning of a paragraph, it is considered an HTML
block: `address`, `article`, `aside`, `blockquote`, `details`, `div`, `dl`,
`fieldset`, `figcaption`, `figure`, `footer`, `form`, `h1` … `h6`, `header`,
`hgroup`, `hr`, `main`, `menu`, `nav`, `noscript`, `ol`, `p`, `pre`, `script`,
`search`, `section`, `style`, `table` and `ul`. (These are the tags that close
any currently open `<p>` tag. See also: [MDN: The `<p>` Element]).


[Headings]: #headings
### Headings

There are two types of headings: [Atx headings] which start with 1–6 hashtags
`#` (optionally also followed by hashtags), and [Setext headings] which
underlined with a line of equal signs `=` or hyphens `-`.

[Atx Heading]: #-heading-1---heading-6
[Atx Headings]: #-heading-1---heading-6
#### `# HEADING 1` … `###### HEADING 6`

This is an atx style heading, it starts with 1–6 `#` on a line of their own.
They must be preceded and followed by a blank line. They are expanded into HTML
tags `<h1>` to `<h6>`.

A heading may also (optionally) be followed by (any number of) `#`.

```
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
 
```

[Setext Heading]: #heading-1-heading-2---------
[Setext Headings]: #heading-1-heading-2---------
#### `HEADING 1↲=========` `HEADING 2↲---------`

This is a Setext heading, which consist of (one or more lines) of text,
underlined by a line consisting of either `=` or `-` characters. If the
underlining uses `=` the heading expands into `<h1>`, while if the underlining
consists of `-` it expands into `<h2>`. The heading must be preceded by a blank
line, no blank line is required after the underlining.

```
Heading 1
=========
Blabla...

Heading 2
---------
Blabla...
```


[Blockquote]: #-blockquote
[Blockquotes]: #-blockquote
### `> BLOCKQUOTE`

A blockquote is any paragraph where each lines start with `>`. Blockquotes
cannot be nested, but they may contain [lists] and [span elements].

```
> Information is noise, unless it’s
> the information you’re looking for.
```

[Lists]: #lists
### Lists

[Bullet]: #-bullet--bullet---bullet
[Bullets]: #-bullet--bullet---bullet
#### `* BULLET` `+ BULLET` `- BULLET`

A bullet list item is any line that starts with `-`, `+` or `*` followed by a
space. The different bullet characters may be mixed freely within the same
list. If an item is longer than one line, then the subsequent lines must start
with space character. (In this way lists items is the only instance where
indentation matters in Baremark.)

```
- bullet one
+ bullet two, which also happens to be
  a very long multi-line bullet item
* bullet three
```

Bullet lists cannot be nested.


[Numbered]: #1-numbered-2-numbered
#### `1. NUMBERED` `2) NUMBERED`

A numbered list item is any line that starts with a number, followed by `.` or
`)` and then a space. Whether you use `.` or `)` may be mixed freely within the
same list. If an item is longer than one line, then the subsequent lines must
start with space character. (In this way lists items is the only instance where
indentation matters in Baremark.)

Like most Markdown parsers, Baremark ignores the actual numbers. (The outputted
list will always be numbered from 1.)

```
1. numbered item 1
2. numbered item 2
3. numbered item 3
4. numbered item 4
```

Numbered lists cannot be nested.


[Code Block]: #codeblock
[Code Blocks]: #codeblock
### ` ```↲CODEBLOCK↲``` `

Code blocks start and end with ` ``` ` on a line of its own. (Markdown’s
indented code blocks are not supported by Baremark.) A code block may contain
any kind of preformatted text (not just code).

```
``` 
first line of code
second line of code
etc...
``` 
```


[Dinkus]: #dinkus------
### Dinkus `---` `___` `***`

A dinkus indicates a break in the text. It is sometimes used to mark the end of
the chapter, or a scene change, or to separate stanzas in poetry. In HTML it
marked by a horizontal ruler by default. (The [CommonMark] spec calls them
“thematic breaks”.)

A dinkus consist of three or more hyphens `-`, underlines `_` or asterisks `*`,
optionally separated by spaces. It must be separated from the surrounding text
with blank lines. Examples:

```
* * *

________________________________________
 
```


[Span Elements]: #span-elements
Span Elements
-------------
*Spans elements* are the markup used for formatting text and adding links
within [block elements]. All of a span element must occur within the same block
(otherwise you’ll see the literal markup characters in the output).

[Span Elements Note]: #span-elements-note
<a id=span-elements-note></a>**NOTE:** The Markdown [bold], [italic] and
[underline] can be nested in, shall we say, *interesting* ways. For example
`*italic **bold-italic* bold**` will generate HTML which is *technically
non-standard,* since the resulting HTML tags `<i>` and `<b>` will be
overlapping (`<i>italic <b>bold-italic</i> bold</b>` → “*italic **bold-italic*
bold**”), and not neatly nested, in the way the HTML standard thinks is
appropriate. In practice, however, I’ve never seen a browser which fails to
render this correctly though.—When in doubt, I suggest you just avoid using
this “feature”. :)


[Backslash Escapes]: #backslash-escapes-x
### Backslash Escapes `\X`

Any ASCII punctuation character may be escaped by preceding it with a
backslash. An escaped character is always interpreted literally. So if you want
an actual asterisk in your text, you can use `\*` to indicate that this is an
asterisk that is not part of a Markdown tag (like for example an `*italic*`
tag). This is feature [CommonMark] compliant.

The ASCII punctuation characters are:

```
!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~
```

**NOTE:** Unescaped brackets and parentheses are not allowed in the text of
[links and images].


[Links and Images]: #links--images
### Links & Images

Both links and images exists in two types: *[inline][inline links and images]*
and *[labeled][labeled links and images]*. The *[inline form][inline links and
images]* contain the URL *right there,* in the Markdown element itself, while
the *[labeled form][labeled links and images]* and *[shortcut form][shortcut
links and images]* hides away the URL in a separate *[label definition]*,
placed elsewhere in the document, where the (often lengthy) URLs don’t wreak
havoc with the line wrapping of your text. Links are expanded into the HTML tag
`<a href="URL" title="TITLE">TEXT</a>` and images into `<img src="URL"
alt="TEXT" title="TITLE">`. (Baremark only supports `TITLE` for [labeled links
and images].)


[Inline Links and Images]: #inline-links-texturl--images-texturl
#### Inline Links `[TEXT](URL)` & Images `![TEXT](URL)`

The Markdown for inline links and images look the same, except that a leading
leading exclamation point `!` is added for the image form.

**NOTE:** `TEXT` may not contain unescaped brackets `[]` or parentheses `()`.
Put a backslash in front of these characters if you need them.

* **Link** `TEXT` may contain Markdown [span elements] (including images, but
  not links).
* **Image** `TEXT` is a literal string. It is used for the `alt` attribute of
  the outputted `<img>` tag, and browsers use it as a replacement for the image
  itself (if it fails to load, or if text is read aloud, rather than
  displayed). It should contain a brief description of the image (avoiding
  phrasings like “Picture of …”).

`URL` given may contain any valid URL. (You can use relative paths, URL
fragments, or other protocols, like `mailto:` etc.) For images the URL should
point to a valid image. This value is not further expanded (all characters,
even backslash ` \ `, are interpreted literally).

```
Links:
[Example link](http://example.com/)
[Link with relative path](..)
[Link with fragment URL](#top)

Image:
![Logo](logo.svg)

Linked image:
[![About us](logo.png)](../about.html)
```


[Labeled Links and Images]: #labeled-links-textlabel--images-textlabel
#### Labeled Links `[TEXT][LABEL]` & Images `![TEXT][LABEL]`

It is often more convenient to use the labeled form of links and images, since
this form allow you to move the (often very long) URLs out of the flow of the
text, so as interfere reading, or mess up line wrapping.

**NOTE:** `TEXT` and `LABEL` may not contain unescaped brackets `[]` or
parentheses `()`. Put a backslash in front of these characters if you need
them.

* **Link** `TEXT` may contain Markdown [span elements] (including images, but
  not links).
* **Image** `TEXT` is a literal string. It is used for the `alt` attribute of
  the outputted `<img>` tag, and browsers use it as a replacement for the image
  itself (if it fails to load, or if text is read aloud, rather than
  displayed). It should contain a brief description of the image (avoiding
  phrasings like “Picture of …”).

`LABEL` names a [label definition] which contains the link URL (and optionally
title) of the link. `LABEL` is case insensitive and whitespace is normalized
(so that a link label may be word wrapped without causing trouble).

If `LABEL` is not defined in the document, then the link will not be expanded,
but remain as-is in the output. Optionally, `LABEL` may be left empty (or
dropped altogether), see [shortcut links and images].

```
Links:
[Example link][example]
[Link with relative path][up]
[Link with fragment URL][top]

Image:
![Logotype][logo]

Linked image:
[![About us][logo]][about]

[about]: ../about.html (About Page)
[example]: http://example.com/ (An Example Page)
[logo]: baremark.svg (Our Logo)
[top]: #top
[up]: .. (Go up one page)
```


[Shortcut links and images]: #shortcut-links-text--images-text
#### Shortcut Links `[TEXT]` & Images `![TEXT]`

When writing [labeled links and images], the `[LABEL]` part at the end of the
link/image element can be left empty, `[TEXT][]` or `![TEXT][]`, or dropped
completely, `[TEXT]` or `![TEXT]`. In these cases `TEXT` will be used as both
link/image text *and* as `LABEL`.

```
Links:
[About][] page.
[About] page.

Images:
![Logo][]
![Logo]

[about]: ../about.html (About Page)
[logo]: baremark.svg (Our Logo)
```

`TEXT` is used as-is for the link (or image) text, but when looking up the link
URL it is normalized in the same way as `LABEL` (in [labeled links and
images]).—This means that, in the above example, `[About]` and `![Logo]` will
be capitalized in the output, while still using the URL and title defined in
the lower case [label definitions] `[about]: ...` and `[logo]: ...`.


[label definition]: #label-definitions-label-url-title
[label definitions]: #label-definitions-label-url-title
#### Label Definitions `[LABEL]: URL (TITLE)`

A label definition associates a `LABEL` with a `URL` and (optionally) a
`TITLE`. The label definitions themselves do not show up in the outputted HTML,
but they are used when expanding [labeled links and images]. Label definitions
can be placed anywhere in the document, but are usually placed either after the
paragraph where they are used, or at the end of the document.

A *label definition* are not required to be surrounded by blank lines, but its
`[LABEL]:` part must be the first thing on the line (without indentation).
Thereafter the URL is specified either in angle brackets `<URL>` or without
`URL`. Finally, the optional `TITLE` may be given either in single quotes
`'TITLE'`, double quotes `"TITLE"` or parentheses `(TITLE)`. They can look like
this:

```
[about]: about.html
[up]: .. (Go up one page)
[example]: http://example.com/ (An Example Page)
[logo page]: <../logo.html> "The History of Our Logo"
[ch5]: #chapter-5 'About Ancient Anthologies'
```

`LABEL` cannot contain brackets `[]` or parentheses `()` unless they are
[escaped by backslashes][backslash escapes]. The value is case insensitive, and
whitespace normalized (so that it may be word wrapped without causing trouble).

`URL` can be written either plainly, or bracketed by bigger than/less than
`<>`.

`TITLE` (which is optional) may be surrounded with either parentheses `(...)`,
double quotes `"..."` or single quotes `'...'`. `TITLE` is a literal string
(any Markdown inside it is not expanded), since this is outputted as an HTML
attribute value. This value is typically used by browsers as a hover text for
the link or image.


[italic]: #italic-italic
### `_ITALIC_` `*ITALIC*`

Asterisks `*` or underlines `_` are used to mark *italic text.* These are
expanded into HTML tags `<i>...</i>`. (See also [Note][Span Elements Note],
under “[Span Elements]”, regarding nesting of [bold], [italic] and
[underline].)

```
_italic_ or *italic*
```


[bold]: #bold-bold
### `__BOLD__` `**BOLD**`

Double asterisks `**` or underlines `__` are used to mark **bold text**. These
are expanded into HTML tags `<b>...</b>`. (See also [Note][Span Elements Note],
under “[Span Elements]”, regarding nesting of [bold], [italic] and
[underline].)

```
__bold__ or **bold**
```


[underline]: #underline-extended
### `___UNDERLINE___` (Extended)

Triple underlines `___` (but not asterisks) are used to mark ___underlined
text___. These are expanded into HTML tags `<u>...</u>`. (See also [Note][Span
Elements Note], under “[Span Elements]”, regarding nesting of [bold], [italic]
and [underline].)

```
___UNDERLINE___
```


[strikethrough]: #strikethrough-extended
### `~~STRIKETHROUGH~~` (Extended)

Double tildes `~~` is used to mark ~~strikethrough text~~. These are expanded
into HTML tags `<s>...</s>`.

```
~~STRIKETHROUGH~~
```

[quote]: #quote-extended
### `:"QUOTE":` (Extended)

Colons `:` and straight quotes `"` are used to mark :"quoted text":. These are
expanded into HTML tags `<q>...</q>`.

```
:"QUOTE":
```

**NOTE:** The quotes produced by most (all?) browsers by the HTML `<q>` tag
cannot be copied and pasted, so I tend to stay away from using this Markdown
element.


[code]: #code--code-
### `` `CODE` `` ``` `` CODE `` ```

Backticks `` ` `` are used to mark `code`. `CODE` is literal string (Markdown
inside it is not further processed, and HTML is escaped so that it shows up as
text in the browser) before being wrapped in the HTML `<tt>...</tt>`.
[Backslash escapes] cannot be used in `CODE` (they will simply show up as
backslashes in the output).

Any number of backticks may be used to start the tag, and the same number
number of backticks is used to terminate it. If `CODE` both starts and ends
with space, then exactly one space is stripped off of either end. All of which
means, that to, for example, write a singe backtick as `CODE`, you can use ```
`` ` `` ```.

```
`CODE`
```


[History]: #history
History
=======
Baremark was originally based on based on VanTigranyan’s Gist [Landmark] (which
is 2060 bytes in size) but it adds several features (such as labeled links &
images) and fixes some bugs (see below).

It was shortened by:

* Regexes are expanded by preprocessing (so that they may be written even
  shorter).
* Tabs for indentation.
* Shortening all variable names to single letter.
* Using fat arrow functions (`=>`).
* Use of `.reduce()` instead of `for` loops.
* Rules is a list-of-lists (instead of a list of objects).
* Single letter groups in regexes changed to character classes (e.g. `(-|*)` to
  `[-*]`).
* Using Javascript template strings (`` `...` ``).
* Not allowing space before `#`, `---` and `===` in headings, or before/after
  `` ``` ``.
* Replaced unnecessary `.*?` with `.*` (greediness is fine if anchored by `\n`,
  since `.` won’t match newlines).
* Use HTML `<b>` instead of `<strong>` and `<i>` instead of `<em>`.
* Removing unneccesary spaces in source.
* `escape()` rewritten.


[Baremark vs. Landmark]: #baremark-vs-landmark
Baremark vs. Landmark
---------------------


[Added Features]: #added-features
### Added Features

* Exports `escape()` method (for use in extensions).
* Handles spaces & tabs at end-of-line a bit more consistently.
* [CommonMark] compatible [dinkus] (uses 3 or more underscores `_`, hyphens `-`
  or asterisks `*`, optionally separated by space, where Landmark requires 5 or
  more asterisks `*`, and does not allow spaces between them).
* Support for [backslash escapes] `\X` (CommonMark).
* Support for [labeled links and images] `[TEXT][LABEL]` `![TEXT][LABEL]`
  (CommonMark).
* Support for [shortcut links and images] `[TEXT]` `![TEXT]` (CommonMark).


[Bugfixes]: #bugfixes
### Bugfixes

* Fixes atx style headings (`# HEADING` … `###### HEADING`).
* Bold, italics and inline code may span newlines (but not empty lines).
* Bullet lists now require space after `*` or `-` (avoids confusion with
  italics).
* Blockquotes may contain lists.
* Blank line in lists, or between lines with leading `>` starts new list or
  blockquote.


[CommonMark]: https://commonmark.org/
[Github repo]: https://github.com/zrajm/baremark/
[Landmark]: https://gist.github.com/VanTigranyan/651b7c77cfc149cb858a044c2108acbb
[Markdown]: https://daringfireball.net/projects/markdown/
[MDN docs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[MDN: The `<p>` Element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#technical_summary "MDN: The Paragraph Element: Technical summary"
[README]: https://zrajm.github.io/baremark/
[Sitemark]: http://plugnburn.github.io/sitemark/
[Source code]: https://zrajm.github.io/baremark/baremark.js
[Test suite]: https://zrajm.github.io/tests/

<!--[eof]-->
