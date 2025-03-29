/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'
import './uncomment.js' // or commented headings will be in toc

let stack = [[]], idUniq = {}
baremark().push(
  // 1. Reset variables (rule always match but change nothing).
  [/^/, () => (idUniq = {}, stack = [[]], '')],

  // 2. Add each <h#> to toc (also make sure it has 'id').
  [/<h([1-6])\b([^<>]*)>(.*?)<\/h\1\b[^<>]*>/g, processHeading],

  // 3. Replace '<toc>' with table-of-contents.
  // (1st entry of stack contains full toc.)
  [/<toc\b([^<>]*)>/gi, (_, attr) => `<div class=toc${attr}>${ul(stack[0])}</div>`],
)

/******************************************************************************/

// Process heading by:
// 1) Making sure it has an 'id' (use existing, or create new).
// 2) Putting it into the toc (<stack>).
function processHeading(w, num, attr, text) {
  // Modify or set 'id' attr, if needed (always match).
  let headingId
  // FIXME: handle id/name attributes with function? (used in 2 places)
  attr = attr.replace(/\s+id=['"]?([^\'\" ]*)['"]?|$/, (_, id) => {
    id ??= anchorize(text)
    idUniq[id] = (idUniq[id] ?? 1) - 1 || '' // first '', then -1, -2 etc
    headingId = id + idUniq[id]
    return ` id="${headingId}"`
  })
  if (headingId === 'toc') { return w }      // abort if 'id=toc'
  // Update stack.
  while (num > stack.length) {               // add subheadings
    const x = []
    stack[stack.length - 1].push(x)
    stack.push(x)
  }
  while (num < stack.length) { stack.pop() } // remove subheadings

  // FIXME: Make sure that existing heading is used
  // (and not replaced)
  text = text
    .replace(/<\/?a\b[^<>]*>/g, '')         // strip <a> tags
    .replace(/<(\w+\b)([^<>]*)>/g,          // remove name/id attributes
      (_, tag, attr) => (
        // FIXME: handle id/name attributes with function? (used in 2 places)
        `<${tag}${attr.replace(/\s*\b(id|name)=([^ \t]*|"[^"]*"|'[^']*'|)/g, '')}>`
      ))
  stack[stack.length - 1].push(              // add to TOC
    `<a href="#${headingId}">${text}</a>`)

  return `<h${num}${attr}>${text}</h${num}>` // update heading 'id' attr
}

// Replace all HTML entities '&...;' in a string with their unicode character
// equivallents. (Uses the browser for the decoding.)
function decodeHTMLEntities(txt) {
  let t = document.createElement('div')
  return txt.replace(
    /&(?:#x[0-9a-f]+|#[0-9]+|[0-9a-z]+);/ig,
    x => (t.innerHTML = x, t.textContent))
}

// Turn list-of-lists into <ul> list.
function ul(x) {
  return typeof x === 'string'
    ? `<li>${x}`
    : `<ul>${x.map(x => ul(x)).join('')}</ul>`
}

// Generate id attribute, try for Github compatibility. (Ugliness like
// '1.2  - åäö .' becoming '12----åäö-' is because of Github.)
function anchorize(txt) {
  return decodeHTMLEntities(txt).trim()
    .replace(/<[^<>]*>|/g, '')                   // strip HTML tags
    .replace(/[^\p{L}\p{N} -]/gu, '')            // keep only alnum, '-' + space
    .replace(/ /g, '-')                          // space -> '-'
    .toLowerCase()
}
//[eof]
