/*-*- mode: js; js-indent-level: 2 -*-*/
// Copyright 2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
//
// Baremark addon: Outputs baremark() parsing execution time on console.

import './baremark.js'

self.baremark = (baremark => (...x) => {     // baremark() wrapper
  if (x.length === 0) { return baremark() }
  const ms = performance.now(), result = baremark(...x)
  console.log(`Baremark ran in: ${performance.now() - ms} ms`)
  return result
})(self.baremark)

//[eof]
