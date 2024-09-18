Landmark: The Simplest Markdown Engine for the Browser
======================================================
Landmark is a small but extensible JavaScript library that allows to render Markdown documents into HTML. VanTigranyan's [original gist](https://gist.github.com/VanTigranyan/651b7c77cfc149cb858a044c2108acbb) is the engine used for [Sitemark](http://plugnburn.github.io/sitemark/) and some other projects.

Usage
-----

Landmark features only 2 methods:

- `Landmark.render(text)` - takes the Markdown source and returns ready HTML code (you'll only need this most of the time)
- `Landmark.addRule(regexp, replacement)` - adds a new processing rule that allows you to specify custom Markdown tags: `regexp` must be an escaped regular expression string in JavaScript syntax, and `replacement` can be either a string, or a function (see [string replacement documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) for the reference)

Markdown syntax
---------------

Markdown syntax used in Landmark resembles both classical and GitHub-flavored Markdown versions, however it does not support some advanced features such as tables or reference-style links. Supported tags are:

- Headings, single-line form: `# Heading level 1`, `## Heading level 2` and so on
- Headings of levels 1 and 2, two-line form:
```
    Heading level 1
    ===============
    
    Heading level 2
    ---------------
```
- Inline formatting: `**bold**` or `__bold__`, `*italic*` or `_italic_`, `~~strike~~`, `:"quote":` and even non-standard `___underline___` (triple underscore) tag!
- Preformatted inline blocks:`` `inline code` ``
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
- Horizontal rules: `****************` (5 and more asterisks on a new line)
- Paragraphs: just like in standard Markdown, any non-special text is enclosed into paragraphs by default, just surround it with newlines.
 
Of course, you can use plain old HTML in Markdown documents, and it will pass as is, unless it's enclosed into inline or multiline preformatted blocks, in which case it will be escaped appropriately.

Zrajm's Fork
------------
VanTigranyan's [original gist](https://gist.github.com/VanTigranyan/651b7c77cfc149cb858a044c2108acbb) is 2060 bytes in size, this one is 1309 bytes. :)

Shortened by:

* Tabs for indentation.
* Shortening all variable names to single letter.
* Using fat arrow functions (`=>`).
* Use of `.reduce()` instead of `for` loops.
* Rules is a list-of-lists (instead of a list of objects).
* Single letter groups in regexes changed to character classes (e.g. `(-|*)` to `[-*]`).
* Using template strings (with \`).
* Not allowing space before `#`, `---` and `===` in headings, and before/after \`\`\`.
* Replaced unnessesary `.*?` with `.*` (greediness is fine if anchored by `\n`, since `.` won't match newlines).
* Use HTML `<b>` instead of `<strong>` and `<i>` instead of `<em>`.
* Removing unneccesary spaces in source.
* `esc` rewritten.

Added features:

* Exports the `esc` method (so you can use it when adding rules).
* `<hr>` need only 3 chars, and may be either `_`, `-` or `*` (as Markdown standard says).
* Supports Markdown escaping (using `\` character).

Bugfixes:

* `#` headings now work (it didn't in VanTigranyan's [original gist](https://gist.github.com/VanTigranyan/651b7c77cfc149cb858a044c2108acbb)).
* Bold, italics and inline code may span newlines (but never an empty line).
* Bullet lists now require space after `*` or `-` (avoids confusion with italics).
* Blockquotes may contain lists.
* Blank line in lists, or between lines with leading `>` starts new list or blockquote.

Known bugs:

* Blockquotes can't be nested.
* Somewhat simplistic insertion of `<p>` -- it will be added around some HTML elements (like `<div>` and others) which `<p>` can't contain, so if user uses those, you'll get some empty `<p>` elements in the DOM (before and after those block elements).

<!--[eof]-->
