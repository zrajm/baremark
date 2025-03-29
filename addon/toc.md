# Baremark Addon: `toc.js`

Source: [`addon/toc.js`](addon/toc.js)

Replace all occurrences of the string `<toc>` with a table of contents, with
the following structure (generated from the headings in the document):

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

Scans the document for headings, and use their existing `id` if possible,
otherwise generates a new `id` attribute value based on the text of the heading
(using the same method as Github Flavored Markdown).

This plugin should run very late in the document processing (it *must* run
after `addon/id.js` if used, as it otherwise won’t pick up the `id` attributes
set by that addon) as it scans for `<h#>` (rather that markdown’s atx or Setext
headings).

A heading that has `id="toc"` it is excluded from the table-of-contents.

**NOTE:** For table-of-contents generation to work, HTML comments must be
removed, so the `addon/uncomment.js` module is implicitly imported by this
plugin. (Headings that are commented out would appear in the table-of-contents
if the HTML comments were not removed.)

<!--[eof]-->
