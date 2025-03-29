/*-*- js-indent-level: 2 -*-*/
// Copyright 2025 by zrajm. Licenses: CC BY-SA (text), GPLv2 (code).
import './baremark.js'

const tableSepLineRe = RegExp(
  /^s(?:\|s)?(:?-+:?(?:s\|s:?-+:?)*)s(?:\|s)?$/.source
    .replace(/s/g, '[ \t]*'), 'm')

// Trims off ONE leading & trailing pipe (& space outside it).
const trimPipe = (x) => x.trim().match(/^\|?(.*?)\|?$/)[1]

baremark().push(
  [/<p>((?:.*?\n)+?)\n/g, (w, p) => {      // from '<p>' to '\n\n'
    p = p.trim().replace(/<\/p>$/, '')     //   trim space + trailing '</p>'

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
  }])
//[eof]
