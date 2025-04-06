/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

// Insert after first rule which matches a backslash at the start.
const i = baremark().findIndex(([re]) => /^\\\\/.test(re.source)) + 1

baremark().splice(i, 0, [/\s*<!--.*?(-->\s*|$)/gs, '\n\n'])
//[eof]
