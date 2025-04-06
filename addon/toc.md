[« Back to Docs](./)


# Baremark Addon: `toc.js`

Source: [`addon/toc.js`](addon/toc.js)

Adds a table-of-contents to a document. To do this, it first builds up a list
of all the headings of the document, then replace any occurrences of the string
`<toc>` in the Markdown with the generated table-of-contents. During
table-of-content generation, headings are also modified to make sure that they
each have an `id` attribute set (necessary for the links in the
table-of-contents to work), and contain a self-link (a link linking back to the
heading itself, meant to help the user find these links).

This means that a Markdown header that looks like this:

```
1. Chapter Heading
==================
```

In the end will produce output like this:

```
<h1><a href="#1-chapter-heading">1. Chapter Heading</a></h1>
```

And the table-of-contents it is part of might look like this:

```
<div class=toc>
  <ul>
    <li><a href="#1-chapter-heading">1. Chapter Heading</a>
    <ul>
      <li><a href="#11-subheading">1.1. Subheading</a>
      <li><a href="#12-subheading">1.2. Subheading</a>
    </ul>
    <li><a href="#2-chapter-heading">2. Chapter Heading</a>
  </ul>
</div>
```


## Ignored Headings

If there is a heading found in the document with the attribute `id="toc"`, it
will be excluded from the table-of-contents.


## `<toc>` Arguments

All attributes given in the `<toc>` tag are copied to the `<div class=toc>`
element which surrounds the table-of-contents. There is also one special
attribute:

* `heading`: If given, adds a heading to the table-of-content with the
  specified text. For example, `<toc heading=Contents>` will generate a
  table-of-contents heading `<h1 id=toc>Contents</h1>`. This allows a heading
  to be specified which will only show up where the `<toc>` tag was actually
  expanded into a table-of-content, while in other environments (for example on
  Github) which do not expand `<toc>` into a table-of-contents the heading
  won’t be displayed either.


## Note: Run Last

This addon processes headings in their HTML format (that is, it looks for the
HTML tags `<h1>` … `<h6>` and their content, rather than their Markdown
equivalent). This means that it should be addon should be imported *very late*
(probably last) among the addons you’re using.—If this addon is used together
with the `id.js` addon, `id.js` must be imported *before* `toc.js` (otherwise
this plugin won’t pick up the `id` attributes set by `id.js`).


## Note: Self-Link Appearance

The self-links inserted by this addon will turn your headings blue under the
default stylesheet. Below is a decent starting point for your CSS if you want
them to look a little bit prettier:

```
h1 a, h2 a, h3 a, h4 a, h5 a, h6 a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; }
a[href^="#"]:hover:before {
  display: inline-block;
  content: "#";
  color: #666;
  width: .5em;
  margin-left: -.5em;
  text-decoration: none;
}
```


## Note: HTML Comments

For table-of-contents generation to work reliably, HTML comments needs to be
removed. To do so, this addon imports the addon `uncomment.js`. This is needed
to prevent headings that are commented out to show up in the table-of-contents.

<!--[eof]-->
