/*-*- mode: js; js-indent-level: 2 -*-*/
// Copyright 2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
//
// Baremark addon: Outputs baremark() parsing execution time on console.

import './baremark.js'

// Wrap baremark() and any properties it might have (e.g. baremark.meta).
self.baremark = new Proxy(self.baremark, {
  apply(orgFunc, thisArg, args) {
    if (args.length === 0) { return orgFunc.call(thisArg) }
    const ms = performance.now(), result = orgFunc.apply(thisArg, args)
    console.log(`Baremark ran in: ${performance.now() - ms} ms`)
    return result
  }
});

//[eof]
