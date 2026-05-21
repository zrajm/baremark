/*-*- js-indent-level: 2 -*-*/
// Copyright 2025-2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

// Insert as first inline/span rule.
baremark()[1].unshift([/\^([^^\n]+)\^/g, '<sup>$1</sup>']) // ^...^

//[eof]
