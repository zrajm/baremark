Baremark: The Simplest Markdown Engine for the Browser
======================================================
Baremark is a small but extensible JavaScript library that allows to render
Markdown documents into HTML. It is based on [Landmark], which is the engine
used for [Sitemark] and some other projects. There is a [test suite] (which is
kinda-sorta based on the CommonMark test suite), and the source code is
available on [Github].

Usage
-----
Baremark features only 2 methods:

- `baremark(MARKDOWN)` – Process `MARKDOWN` and return HTML. (Most of the time,
  this is the only function you'll need.)
- `baremark.add(REGEX, REPLACEMENT)` – Add a new processing rule. This is used
  to create custom markup. Arguments given to `add()` are passed on as-is to
  Javascript's `replace()` function during markdown processing (see: [MDN
  docs]). Each rule is applied to the entirety of the markdown source. This
  means that, for [block elements], `REGEX` may use `.*?` (with the `/s` flag),
  but that for [span elements] it is wise to make sure that `REGEX` does not
  match across blank lines (for example, using `(.+?(?:\n.+?)*` to match single
  newlines, but not two or more newlines after each other). **Nota Bene: Make
  sure `REGEX` has the `/g` flag, or it will only match once!**

Markdown syntax
---------------
Markdown syntax used in Baremark resembles both classical and GitHub-flavored
Markdown versions, however it does not support some advanced features (such as
tables). The following tags are supported:

- Headings, single-line form: `# Heading level 1`, `## Heading level 2` and so
  on
- Headings of levels 1 and 2, two-line form:
```
    Heading level 1
    ===============

    Heading level 2
    ---------------
```
- Inline formatting: `**bold**` or `__bold__`, `*italic*` or `_italic_`,
  `~~strike~~`, `:"quote":` and even non-standard `___underline___` (triple
  underscore) tag!
- Preformatted inline blocks: `` `inline code` ``
- Preformatted multiline blocks:
```
    ```
    first line of preformatted text
    second line of preformatted text
    etc...
    ```
```
- Block quotes:
```
    > first line of quote
    > second line of quote
    > etc...
```
- Lists:
```
    - unordered item 1
    - unordered item 2

    * another unordered item 1
    * another unordered item 2
    * another unordered item 3

    1. ordered item 1
    2. ordered item 2
    3. ordered item 3
    4. ordered item 4
```
- Links: `[link text](http://example.com)`
- Images: `![alt text](http://example.com/flower.jpg)`
- Horizontal rule: `***`, `---`, or `___` (three or more of either asterisk,
  dash or underscore on a line separated by blank lines).
- Paragraphs: just like in standard Markdown, any non-special text is enclosed
  into paragraphs by default, just surround it with newlines.

Of course, you can use plain old HTML in Markdown documents, and it will pass
as is, unless it's enclosed into inline or multiline preformatted blocks, in
which case it will be escaped appropriately.


Baremark
--------

Baremark is based on VanTigranyan's [Landmark], which is 2060 bytes in size.
The current version Baremark is 1860 bytes in size (without minification!). :)

It was shortened by:

* Tabs for indentation.
* Shortening all variable names to single letter.
* Using fat arrow functions (`=>`).
* Use of `.reduce()` instead of `for` loops.
* Rules is a list-of-lists (instead of a list of objects).
* Single letter groups in regexes changed to character classes (e.g. `(-|*)` to
  `[-*]`).
* Using Javascript template strings (`` `…` ``).
* Not allowing space before `#`, `---` and `===` in headings, and before/after
  `` ``` ``.
* Replaced unnecessary `.*?` with `.*` (greediness is fine if anchored by `\n`,
  since `.` won't match newlines).
* Use HTML `<b>` instead of `<strong>` and `<i>` instead of `<em>`.
* Removing unneccesary spaces in source.
* `esc` rewritten.

Added features:

* Exports the `esc` method (so you can use it when adding rules).
* `<hr>` need only 3 chars, and may be either `_`, `-` or `*` (as Markdown standard says).
* Supports Markdown escaping (using `` \ `` character).

Bugfixes:

* ATX style headings (`# heading`) now work (they didn't in the original
  [Landmark]).
* Bold, italics and inline code may span newlines (but never an empty line).
* Bullet lists now require space after `*` or `-` (avoids confusion with
  italics).
* Blockquotes may contain lists.
* Blank line in lists, or between lines with leading `>` starts new list or
  blockquote.

Known bugs:

* Blockquotes can't be nested.
* Somewhat simplistic insertion of `<p>` -- it will be added around some HTML
  elements (like `<div>` and others) which `<p>` can't contain, so if user uses
  those, you'll get some empty `<p>` elements in the DOM (before and after
  those block elements).


[Landmark]: https://gist.github.com/VanTigranyan/651b7c77cfc149cb858a044c2108acbb
[Sitemark]: http://plugnburn.github.io/sitemark/
[MDN docs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[block elements]: https://daringfireball.net/projects/markdown/syntax#block
[span elements]: https://daringfireball.net/projects/markdown/syntax#span
[test suite]: https://zrajm.github.io/baremark/
[Github]: https://github.com/zrajm/baremark/

<!--[eof]-->
