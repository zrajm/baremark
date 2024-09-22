Baremark: A Tiny Markdown Engine
================================
**22 September 2024 – Breaking changes.** Where previously `baremark.add(…)`
was used to extend rules, now use `baremark().push([…])`. (*Note the added
brackets!*) – This makes Baremark smaller *and* adds more flexibility! All
Javascript array methods may now be used to work with the ruleset. (For
example, one may now use `baremark().unshift([…])` to add a rule to be executed
first, which wasn’t previously possible.)

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
Baremark can be invoked in two ways.

* `baremark(MARKDOWN)` – Process `MARKDOWN` and return HTML. (Most of the time,
  this is the only function you need.)

* `baremark()` – Returns the list of rules used internally by Baremark. This is
  used to extend the Baremark rules (for supporting your own non-standard
  Markdown). See below.


Extending Baremark
------------------
Baremark’s internals are very simple. It consists of a list of rules, which are
applied, in order, to the inputted Markdown text. Each rule is passed on
*exactly as-is* to the Javascript `replace()` string method. Yet, from this
simplicity come remarkable versatility.

Let’s take an example. The below rule turns `[#text]` into `<a id="text"></a>`,
allowing you to use add fragment URL anchors to your text (so that you to put
`#text` into your URL to scroll to that part of the page). – This rule is added
to the end of the current ruleset using `baremark().push()` (meaning that it
will be applied *after* the previously existing rules).

```
    // Fragment URL anchor: Turns `[#text]` into <a id="text"></a>.
    baremark().push([/\[#([^.:\[\]\s]+)\][\t ]*/g, '<a id="$1"></a>'])

```

Below’s is another, more involved, example of a Baremark rule. This one parses
the first paragraph of the Markdown input as metadata if possible. (If the
first paragraph *isn’t* formatted like an email or HTTP header then it is left
untouched, otherwise it’s removed and the metadata is stored in a variable for
later use.) This rule needs to be processed first, before any other rules, and
so it is added using `baremark().unshift()`.

First a small Javascript module called `baremarkHeaders` is created (this acts
as a container for the returned metadata). It consists of an internal scope
(with the private `meta` variable hidden in it), and a Javascript array with an
extra method `get()` that can be used to return the metadata after invoking
`baremark()`.

```
    // Baremark rule for reading header style metadata. Processes first paragraph
    // as metadata if (and only if) it looks like an email headers (e.g. 'Author:
    // <name>'). After `baremark()` cal `baremarkHeaders.get()` to get object
    // with metadata values.
    const baremarkHeaders = (meta => Object.assign([
        /^(\n*)((\w+:.*\n)+)\n+/,
        (_, nl, txt) => {
            meta = {}
            txt.split(/^/m).forEach(x => {
                const [_, name, value] = /^(\w+):\s*(.*)\n/.exec(x)
                meta[name.toLowerCase()] = value
            })
            return nl
        }],
        { get: () => meta })
    )()

    // Invoking it.
    baremark().unshift(baremarkHeaders)        // add rule
    const html = baremark(markdown)
    const meta = baremarkHeaders.get()         // get metadata
```

Finally, since rules are passed exactly as-is to the Javascript string method
`replace()`, the [MDN docs] on the subject is recommended reading.


Common Gotchas when Extending Baremark
--------------------------------------
**Forgetting the `[` and `]` around the rules.** – If you forget the brackets
when adding rules (with `baremark().push([…])` or `baremark().unshift([…])`)
you’ll get a very cryptic error message upon running `baremark(markdown)`.

```
    Uncaught TypeError: r is not iterable
```

**Forgetting the `/g` flag on the regex.** – If you forget this flag, your
regex will only be applied once. This is very seldom the right choice and can
lead to some hand-to-find errors. (Though, for a counterexample look at the
`baremarkHeaders` rule above.)

**Each regex is applied to the *whole* of the Markdown source.** – Thus, for
inline elements, you need to make *extra* sure that you allow exactly *one
newline* to match inside your Markdown tag, but never *two newlines after each
other* (or your tag will match across paragraph borders). The rule for
`**bold**`, for example, look like this:

```
[/(\*\*|__)(\n?(.+\n)*?.*?)\1/g,'<b>$2</b>']
```

Notice the `(\n?(.+\n)*?.*?)` part in the middle? That matches, ‘one optional
newline’ (`\n?`), followed by ‘as few as possible, optional, lines that has at
least one non-newline character, and ends in newline’ (`(.+\n)*?`), followed by
‘as few as possible, optional, non-newline characters’ (`.*?`). – That’s a
pretty elaborate way to say that `**…**` shouldn’t match if there are two
newlines next to each other inside it.


Limitations
===========
These limitations might change in the future.

* Indented code blocks are not supported, but <i>fenced</i> code blocks – with
  leading and trailing `` ``` `` – can be used instead).

* Blockquotes (`> …`) are supported, but cannot be nested.

* The *CommonMark* standard allow whitespace at the end of a line (e.g. at the
  end of lines with <tt>#</tt> and <tt>```</tt>) but Baremark instead interpret
  these spaces literally.

* Somewhat simplistic insertion of `<p>` – it will be added around some HTML
  elements (like `<div>` and others) which `<p>` can’t contain, so if user uses
  those, you’ll get some empty `<p>` elements in the DOM (before and after
  those block elements).

* Newline and whitespace is allowed inside the brackets and parentheses of the
  link tags, but not between `](`, `][` or inside URLs.


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
  Between a Setext heading an a paragraph a blank line isn’t required:
```
    Heading
    =======
    Some text in a paragraph.
```

Of course, you can use plain old HTML in Markdown documents, and it will be
passed through as-is, unless it’s enclosed in `` ` `` or `` ``` `` (multiline
preformatted blocks), in which case it will be escaped appropriately.


History
=======
Baremark is based on based on VanTigranyan’s Gist [Landmark] (2060 bytes in
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
  since `.` won’t match newlines).
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
* ATX style headings (`# heading`) now work (they didn’t in the original
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
