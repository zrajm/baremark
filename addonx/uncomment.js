/*-*- js-indent-level: 2 -*-*/
// Copyright 2025-2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

// Insert after first rule which matches a backslash at the start.
const [r] = baremark(), i = r.findIndex(([re]) => /^\\\\/.test(re.source)) + 1

r.splice(i, 0, [/\s*<!--.*?(-->\s*|$)/gs, '\n\n'])
//[eof]
