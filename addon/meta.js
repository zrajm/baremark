/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'
import './uncomment.js' // or top heading might not match

let meta = {}
baremark.meta = meta

// Email-style metadata.
baremark().unshift([
  /^(\n*)(\w+:.*\n((\w+:|[\t ]).*\n)*)\n+/,
  (_, nl, txt) => (txt.split(/\n(?=\w)/).forEach(x => {
    const [_, name, value] = /^(\w+):(.*)/s.exec(x)
    meta[name.toLowerCase()] = value.trim().replace(/\s+/, ' ')
  }), nl)
])

// Top heading of page.
baremark().push([
  /^\n*<h(\d)\b([^<>]*)>(.*?)<\/h\1>/s,
  (w, _, attr, title) =>
    meta.title ? w : (      // skip, already have 'title'
      meta.title   = title,
      meta.titleId = (      // if setting 'title', always set 'titleId'
        attr.match(/id=(?:"([^<>"]*)"|'([^<>']*)'|([^<>"' \t]*))/) ?? []
      ).splice(1).find(x => x) ?? 'top',
      '')
])
//[eof]
