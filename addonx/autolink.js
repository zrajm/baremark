/*-*- js-indent-level: 2 -*-*/
// Copyright 2025-2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremarkx.js'

// Insert as first inline/span rule.
baremarkx()[1].unshift([
  /(?<!\]\(|\]: +)\b[a-z]+:\/\/[^ \n<>]*[^,;:.?!"'\)\]}<> \n]/gi, autolink])
  // /(?<!\]\()\b[a-z]+:\/\/[^ \n<>]*[^,;:.?!"'\)\]}<> \n]/gi,

function decodeHTMLEntities(txt) {
  let t = document.createElement('div')
  return txt.replace(
    /&(?:#x[0-9a-f]+|#[0-9]+|[0-9a-z]+);/ig,
    x => (t.innerHTML = x, t.textContent))
}

function autolink(x) {
  const linkText = decodeHTMLEntities(x).split(
    /([\p{S}\p{Z}\p{Pi}\p{Ps}\p{Pd}\p{Pc}\p{Po}]*(?:[\p{Lt}\p{Lu}]+\p{Ll}*|[\p{Lt}\p{Lu}]*\p{Ll}+|\p{N}+)[:/\p{Pe}\p{Pf}]*)/u)
        .filter(x => x)
        .map(x => baremarkx.escape(x))
        .join('<wbr>')
  return `<a href="${baremarkx.escape(x)}">${linkText}</a>`
}
//[eof]
