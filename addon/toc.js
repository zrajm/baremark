/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'
import './uncomment.js' // or commented headings will be in toc

let stack = [[]], idUniq = {}

// Insert after last rule.
baremark().push(
  // 1. Reset variables (rule match once, but change nothing).
  [/^/, tocReset],
  // 2. Make sure each <h#> has 'id' attr & add it to toc.
  [/<h([1-6])\b([^<>]*)>(.*?)<\/h\1\b[^<>]*>/g, tocHeading],
  // 3. Replace first '<toc>' with table-of-contents.
  [/<toc\b([^<>]*)>/i, tocGenerate])

function tocReset() {
  idUniq = {}; stack = [[]]; return ''
}

function tocGenerate(_, attr) {
  let heading = ''
  attr = attr.replace(
    /\s*\bheading=(?:'([^']*)'|"([^"]*)"|([^ \t'"]*))/,
    (_, a, b, c) => ((heading = a ?? b ?? c), ''))
  return (heading && `<h1 id=toc><a href="#toc">${heading}</a></h1>`)
    + ul(stack[0], attr) // 1st stack entry contains full ToC
}

function tocHeading(w, num, attr, text) {
  // Modify or set 'id' attr, if needed (always match).
  let headingId
  // FIXME: handle id/name attributes with function? (used in 2 places)
  attr = attr.replace(/\s+id=['"]?([^\'\" ]*)['"]?|$/, (_, id) => {
    id ??= anchorize(text)
    idUniq[id] = (idUniq[id] ?? 1) - 1 || '' // first '', then -1, -2 etc
    headingId = id + idUniq[id]
    return ` id="${headingId}"`
  })
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
  text = `<a href="#${headingId}">${text}</a>`// add link
  stack[stack.length - 1].push(text)         // add to TOC
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
function ul(x, attr = '') {
  return typeof x === 'string'
    ? `<li>${x}`
    : `<ul${attr && ' ' + attr}>${x.map(x => ul(x)).join('')}</ul>`
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
