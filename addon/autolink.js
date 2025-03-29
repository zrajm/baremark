/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

const i = baremark().findIndex(([re]) => /^\\\\/.test(re.source)) + 1

baremark().splice(i, 0, [
  /(?<!\]\(|\]: +)\b[a-z]+:\/\/[^ \n<>]*[^,;:.?!"'\)\]}<> \n]/gi, autolink])
  // /(?<!\]\()\b[a-z]+:\/\/[^ \n<>]*[^,;:.?!"'\)\]}<> \n]/gi,

function autolink(x) {
  return `<a href="${baremark.escape(x)}">${baremark.escape(x)}</a>`
}
//[eof]
