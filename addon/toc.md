# `addon/toc.js`

Generate a table-of-content, replacing any occurrence of the string `<toc>`
with the following structure.

```
`<div class=toc>
  <ul>
    <li>1. Chapter Heading
    <ul>
      <li>1.1. Subheading
      <li>1.2. Subheading
    </ul>
    <li>2. Chapter Heading
  </ul>
</div>`],
```

Scans documents for headings, and use their existing 'id' if possible,
otherwise generate new id attribute value using the same method as Github
Flavored Markdown.

This plugin should run very late in the document processing (it MUST run after
`addon/id.js` if used) as it scans for `<h#>` (rather that markdown's atx or
Setext headings).

If a heading has 'id="toc"' it is excluded from the table-of-contents.

**NOTE:** For table-of-content generation to work, HTML comments must be
removed, so the `addon/uncomment.js` module is implicitly imported by this
plugin.

<!--[eof]-->
