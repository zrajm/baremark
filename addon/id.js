/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

baremark().push([
  //    name   attr          id
  /(?:<(\w+)\b([^<>]*)>)?\[#([^.:\[\]\s]+)\][\t ]*/g,
  (_, tag, tagAttr, id) => {      // [#id]
    return (tag && !/\bid=/.test(tagAttr))
      ? `<${tag}${tagAttr} id="${id}">`
      : (tag ? `<${tag}${tagAttr}>` : '') + `<a id="${id}"></a>`
  }
])
//[eof]
