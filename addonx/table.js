/*-*- js-indent-level: 2 -*-*/
// Copyright 2025-2026 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

// Insert before last rule which matches '\n\n' at the start.
let [r] = baremark(), i = r.findLastIndex(([re]) => /^\\n\\n/.test(re.source))

r.splice(i, 0, [/\n\n(.+(\n.+)*)(?=\n\n)/g, table])

const tableSepLineRe = RegExp(
  /^s(?:\|s)?(:?-+:?(?:s\|s:?-+:?)*)s(?:\|s)?$/.source
    .replace(/s/g, '[ \t]*'), 'm')

// Trims off ONE leading & trailing pipe (& space outside it).
const trimPipe = (x) => x.trim().match(/^\|?(.*?)\|?$/)[1]

function table(w, p) {
  // Find separator line.
  const [_, sepLine = ''] = p.match(tableSepLineRe) ?? []
  if (!sepLine && !p.includes('|')) { return w } // no table, abort

  const align = sepLine.split('|').map(x => {
    const [_, l, r] = x.trim().match(/^(:?).*?(:?)$/)
    return l ? (r ? 'center' : 'left') : (r ? 'right'  : '')
  })

  let c = sepLine ? 'th' : 'td'
  return '\n\n' + [
    '<table>',
    (sepLine ? '<thead>' : '<tbody>'),
    ...p.split('\n').map(row => {
      return row.match(tableSepLineRe)   // is this separator line
        ? (c = 'td', '</thead><tbody>')  //   switch to <thead>
        : [                              //   otherwise output <tr>
          '<tr>',
          ...trimPipe(row).split('|').map((col, i) =>
            `<${c} align="${align[i] ?? ''}">${col.trim()}</${c}>`),
          '</tr>'
        ].join('')
    }),
    '</tbody>',
    '</table>',
  ].join('\n') + '\n\n'
}

//[eof]
