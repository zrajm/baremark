Baremark: A Tiny Markdown Engine
================================

*Baremark* is a minimal (but extendable) [Markdown] parser written in
Javascript, originally inspired by Van Tigranyan’s Gist [Landmark], but with
added bugfixes, optimizations, support for reference links, and a little more
*CommonMark* compliance. (Note that Baremark never will be *fully* CommonMark
compliant, as the intent of Baremark is source code brevity above
featurefulness.)

* [Source code]
* [Test suite]
* [Github page]

It is currently 1860 bytes in size *without minification!*


Usage
=====
Baremark have two different methods:

* `baremark(MARKDOWN)` – Process `MARKDOWN` and return HTML. (Most of the time,
  this is the only function you need.)

* `baremark.add(REGEX, REPLACEMENT)` – Add a new processing rule. This is used
  to create custom markup. Arguments given to `add()` are passed on as-is to
  Javascript's `replace()` function during markdown processing (see: [MDN
  docs]). Each rule is applied to the entirety of the markdown source. This
  means that, for [block elements], `REGEX` may use `.*?` (with the `/s` flag),
  but that for [span elements] it is wise to make sure that `REGEX` does not
  match across blank lines (for example, using `(.+?(?:\n.+?)*` to match single
  newlines, but not two or more newlines after each other). **Nota Bene: Make
  sure `REGEX` has the `/g` flag, or it will only match once!**


Limitations
===========

(These things might change in the future.)

* Indented code blocks are not supported, but <i>fenced</i> code blocks – with
  leading and trailing `` ``` `` – can be used instead).

* Blockquotes (`> …`) are supported, but cannot be nested.

* The *CommonMark* standard allow whitespace at the end of a line (e.g. at the
  end of lines with <tt>#</tt> and <tt>```</tt>) but Baremark instead interpret
  these spaces literally.

* Somewhat simplistic insertion of `<p>` – it will be added around some HTML
  elements (like `<div>` and others) which `<p>` can't contain, so if user uses
  those, you'll get some empty `<p>` elements in the DOM (before and after
  those block elements).

* Newline and whitespace is allowed inside the brackets of the link tags, but
  not between `](` and `][`.


Markdown syntax
===============
Markdown syntax used in Baremark resembles both classical and GitHub-flavored
Markdown versions, however it does not support some advanced features (such as
tables). The following tags are supported:

- Headings, single-line form: `# Heading level 1`, `## Heading level 2` and so
  on
- Setext headings of levels 1 and 2:
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
- Both reference links and inline links are supported. Newline and whitespace
  is allowed inside the link texts, but not between the `](` and `][`.
```
    * This is an [inline link](http://example.com).
    * You can also use [reference links].
    * Which may also have [custom link text][reference link2].

    [reference links]: http://example.com
    [reference link2]: http://example.com "Optional page title here"

```
- Images: `![alt text](http://example.com/flower.jpg)`
- Horizontal rule: `***`, `---`, or `___` (three or more of either asterisk,
  dash or underscore on a line separated by blank lines).
- Paragraphs: Just as in standard Markdown, any non-special text is put inside
  `<p>` tags by default, just surround each paragraph with with blank lines.
  Between a Setext heading an a paragraph a blank line isn't required:
```
    Heading
    =======
    Some text in a paragraph.
```

Of course, you can use plain old HTML in Markdown documents, and it will be
passed through as-is, unless it's enclosed in `` ` `` or `` ``` `` (multiline
preformatted blocks), in which case it will be escaped appropriately.


History
=======
Baremark is based on based on VanTigranyan's Gist [Landmark] (2060 bytes in
size) but add several features (such as reference links) and fixes some bugs
(see below).

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


Added features
--------------
* Exports the `esc` method (so you can use it when adding rules).
* `<hr>` need only 3 chars, and may be either `_`, `-` or `*` (as Markdown standard says).
* Supports Markdown escaping (using `` \ `` character).


Bugfixes
--------
* ATX style headings (`# heading`) now work (they didn't in the original
  [Landmark]).
* Bold, italics and inline code may span newlines (but never an empty line).
* Bullet lists now require space after `*` or `-` (avoids confusion with
  italics).
* Blockquotes may contain lists.
* Blank line in lists, or between lines with leading `>` starts new list or
  blockquote.



[block elements]: https://daringfireball.net/projects/markdown/syntax#block
[Github page]: https://github.com/zrajm/baremark/
[Landmark]: https://gist.github.com/VanTigranyan/651b7c77cfc149cb858a044c2108acbb
[Markdown]: https://daringfireball.net/projects/markdown/
[MDN docs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[Sitemark]: http://plugnburn.github.io/sitemark/
[Source code]: https://zrajm.github.io/baremark/baremark.js
[span elements]: https://daringfireball.net/projects/markdown/syntax#span
[Test suite]: https://zrajm.github.io/baremark/

<!--[eof]-->
