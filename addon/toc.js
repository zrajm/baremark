{
  // Decode HTML '&...;' using browser.
  const decodeHTMLEntities = (() => {
    let e = document.createElement('div')
    return str => str.replace(
      /&(?:#x[0-9a-f]+|#[0-9]+|[0-9a-z]+);/ig,
      x => (e.innerHTML = x, e.textContent))
  })()

  // Generate id attribute, try for Github compatibility. (Ugliness like
  // '1.2  - åäö .' becoming '12----åäö-' is because of Github.)
  const htmlToId = x => decodeHTMLEntities(x).trim()
    .replace(/<[^<>]*>|/g, '')                 // strip HTML tags
    .replace(/[^\p{L}\p{N} -]/gu, '')          // keep only alnum, '-' + space
    .replace(/ /g, '-')                        // space -> '-'
    .toLowerCase()

  let tocHtml = '', tocLvl = 0, idUniq = {}
  baremark().push([
    /<h([1-6])\b([^<>]*)>(.*?)<\/h\1\b[^<>]*>|$/g, // Find <h#> heading tags
    (_, hLvl, attr, text, pos, fullStr) => {
      if (pos === fullStr.length) {            // DONE (matched `$`)
        tocHtml += '</ul>\n'.repeat(tocLvl)
        return ''
      }
      if (tocLvl !== hLvl) {
        tocHtml += (tocLvl < hLvl)
          ?  '<ul>\n'.repeat(hLvl - tocLvl)
          : '</ul>\n'.repeat(tocLvl - hLvl)
        tocLvl = hLvl
      }
      // Make sure id attribute exists and has unique value.
      // (Replace existing id attribute, or insert new one at end of tag.)
      attr = attr.replace(/\s+id=['"]?([^\'\" ]*)['"]?|$/, (_, id) => {
        id ??= htmlToId(text)
        idUniq[id] = (idUniq[id] ?? 1) - 1 || '' // first '', then -1, -2 etc
        id = id + idUniq[id]
        tocHtml += `<li><a href="#${id}">${text}</a>`
        return ` id="${id}"`
      })
      return `<h${hLvl}${attr}>${text}</h${hLvl}>`
    },
  ], [
    // Replace '<toc>' with table-of-contents.
    /<toc\b[^<>]*>/gi, () => `<div class=toc>${tocHtml}</div>`,
  ])
}
//[eof]
