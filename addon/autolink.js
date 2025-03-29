/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

baremark().unshift(
  //[/(?<!\]\()\b[a-z]+:\/\/[^ \n<>]*[^,;:.?!"'\)\]}<> \n]/gi,x =>     // autolink URL
  [/(?<!\]\(|\]: +)\b[a-z]+:\/\/[^ \n<>]*[^,;:.?!"'\)\]}<> \n]/gi,x => // autolink URL
    `<a href="${baremark.escape(x)}">${baremark.escape(x)}</a>`],
)
//[eof]
