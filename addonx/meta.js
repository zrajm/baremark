/*-*- js-indent-level: 2 -*-*/
// Copyright 2025-2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremarkx.js'
import './uncomment.js' // or top heading might not match

let [r] = baremarkx(), meta = {}
baremarkx.meta = meta

// Insert after first rule which matches a backslash at the start.
const i = r.findIndex(([re]) => /^\\\\/.test(re.source)) + 1

// Insert before last rule which matches '\n\n' at the start.
const j = r.findLastIndex(([re]) => /^\\n\\n/.test(re.source))

r.splice(i, 0, [/^(\n*)(\w+:.*\n((\w+:|[\t ]).*\n)*)\n+/, metaHeader])
r.splice(j, 0, [/^\n*<h(\d)\b([^<>]*)>(.*?)<\/h\1>/s,     metaTitle ])

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
  ).splice(1).find(x => x) ?? undefined
  return ''
}

//[eof]
