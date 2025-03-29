/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'
import './uncomment.js' // or top heading might not match

let meta = {}
baremark.meta = meta

const i = baremark().findIndex    (([re]) =>   /^\\\\/.test(re.source)) + 1
const j = baremark().findLastIndex(([re]) => /^\\n\\n/.test(re.source))

baremark().splice(i, 0, [/^(\n*)(\w+:.*\n((\w+:|[\t ]).*\n)*)\n+/, metaHeader])
baremark().splice(j, 0, [/^\n*<h(\d)\b([^<>]*)>(.*?)<\/h\1>/s,     metaTitle ])

// Email-style metadata.
function metaHeader(_, nl, txt) {
  txt.split(/\n(?=\w)/).forEach(x => {
    const [_, name, value] = /^(\w+):(.*)/s.exec(x)
    meta[name.toLowerCase()] = value.trim().replace(/\s+/, ' ')
  })
  return nl
}

// Top heading of page.
function metaTitle(w, _, attr, title) {
  if (meta.title) { return w }   // skip, already have 'title'
  meta.title   = title
  meta.titleId = (      // if setting 'title', always set 'titleId'
    attr.match(/id=(?:"([^<>"]*)"|'([^<>']*)'|([^<>"' \t]*))/) ?? []
  ).splice(1).find(x => x) ?? 'top'
  return ''
}

//[eof]
