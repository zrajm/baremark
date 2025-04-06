/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

// Insert after last rule.
baremark().push([/(?:<(\w+)\b([^<>]*)>)?\[#([^.:\[\]\s]+)\][\t ]*/g, idInsert])

function idInsert(_, tag, tagAttr, id) {
  return (tag && !/\bid=/.test(tagAttr))
    ? `<${tag}${tagAttr} id="${id}">`
    : (tag ? `<${tag}${tagAttr}>` : '') + `<a id="${id}"></a>`
}

//[eof]
