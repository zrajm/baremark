// -*- mode: js; js-indent-level: 2 -*-
// Copyright (c) 2026 by zrajm. License: GPLv2
//
// Drop this into any HTML page to get a floating search widget
// that finds text inside <details><summary> elements.
const css = `
  #find {
    position: fixed;
    top: 10px;
    right: 12px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
    font-family: 'DM Mono', 'Fira Mono', 'Cascadia Code', monospace;
    font-size: 13px;
    & .box {
      display: flex;
      align-items: center;
      gap: 0;
      overflow: hidden;
      background: #222;
      border: 1.5px solid #777;
      border-radius: 20px;
      padding: 0 6px;
      box-shadow: 0 4px 8px #000;
      &:focus-within { border-color: currentColor; }
    }
    & input {
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      padding: 8px 12px;
      width: 200px;
      font: inherit;
      &::placeholder { color: #777; }
    }
    & .divider {
      width: 1px;
      height: 20px;
      background: #555;
      flex-shrink: 0;
    }
    & .count {
      color: #aaa;
      padding: 0 10px;
      min-width: 60px;
      text-align: center;
      white-space: nowrap;
    }
    & button {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #555;
      padding: 7px 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      &:hover { color: #ccc; background: rgba(255,255,255,0.05); }
      &:active { background: rgba(255,255,255,0.09); }
      & svg { display: block; }
    }
  }
  mark.find-hilite {
    background: #970;
    color: inherit;
    border-radius: 2px;
    padding: 0 1px;
    transition: background 0.12s;
  }
  mark.find-hilite-current {
    background: #fc0;
    color: #000;
    border-radius: 2px;
    box-shadow: 0 0 0 1.5px #f5c40055;
  }`
const html = `
  <style>${css}</style>
  <div id="find">
    <div class="box">
      <input type="text" placeholder="Type to search…" autocomplete="off" spellcheck="false">
      <div class="divider"></div>
      <span class="count"></span>
      <div class="divider"></div>
      <button id="find-prev" title="Previous (Shift+Enter)">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 8L6 4L10 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button id="find-next" title="Next (Enter)">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>`

///////////////////////////////////////////////////////////////////////////////
// Highlight helpers
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Walk text nodes inside `el`, wrap occurrences of any word in `words` with
// <mark class="find-hilite"> elements. Returns all created marks.
function highlightInElement(el, words) {
  const pattern = words.map(escapeRegex).join('|')
  const regex   = new RegExp(`(${pattern})`, 'gi')
  const created = []
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      // Quick test first (resets lastIndex via new regex below)
      if (!regex.test(text)) { regex.lastIndex = 0; return }
      regex.lastIndex = 0

      // split with capturing group → odd indices are matches
      const parts = text.split(regex)
      if (parts.length <= 1) { return }

      const frag = document.createDocumentFragment()
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {               // matched word
          const mark = document.createElement('mark')
          mark.className   = 'find-hilite'
          mark.textContent = parts[i]
          frag.appendChild(mark)
          created.push(mark)
        } else if (parts[i]) {
          frag.appendChild(document.createTextNode(parts[i]))
        }
      }
      node.parentNode.replaceChild(frag, node)
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'MARK') {
      // iterate over a static copy to avoid mutation issues
      [...node.childNodes].forEach(walk)
    }
  }
  [...el.childNodes].forEach(walk)
  return created
}

// Remove all ssw highlight marks from the document.
function clearAllHighlights() {
  document.querySelectorAll('mark.find-hilite').forEach(mark => {
    const parent = mark.parentNode
    if (!parent) { return }
    parent.replaceChild(document.createTextNode(mark.textContent), mark)
    parent.normalize()
  })
}

// Open all ancestor <details> of `summaryEl` EXCEPT the direct parent
// (we don't want to expand the found summary's own content).
function openAncestors(summaryEl) {
  const directParent = summaryEl.closest('details')
  if (!directParent) { return }
  let ancestor = directParent.parentElement &&
                 directParent.parentElement.closest('details')
  while (ancestor) {
    ancestor.open = true
    ancestor = ancestor.parentElement &&
               ancestor.parentElement.closest('details')
  }
}

///////////////////////////////////////////////////////////////////////////////
// Navigation helpers

// State
// Each entry: { summary: Element, marks: [mark elements] }
let matches = []
let currentIdx = -1

// Apply / remove the "current" class based on currentIdx.
function refreshCurrentClass() {
  matches.forEach(({ marks }, i) => {
    const isCurrent = i === currentIdx
    marks.forEach(mark => {
      mark.classList[isCurrent ? 'add' : 'remove']('find-hilite-current')
    })
  })
}

// Scroll the current match into view.
function scrollToCurrent() {
  if (currentIdx < 0 || currentIdx >= matches.length) return
  const { marks } = matches[currentIdx]
  if (marks.length > 0) {
    marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Update the "N/M" counter label.
function updateCount() {
  const q = $input.value.trim()
  if (!q) {
    $count.textContent = ''
    return
  }
  if (matches.length === 0) {
    $count.textContent = '0'
  } else {
    $count.textContent = `${currentIdx + 1}/${matches.length}`
  }
}

// Core search
function doSearch() {
  clearAllHighlights()
  matches = []
  currentIdx = -1
  updateCount()
  const query = $input.value.trim()
  if (!query) { return }

  // Each whitespace-separated token is searched independently
  const words = query.split(/\s+/).filter(Boolean)
  if (!words.length) { return }

  const summaries = [...document.querySelectorAll('details > summary')]
  for (const summary of summaries) {
    const text = summary.textContent.toLowerCase()
    const allPresent = words.every(w => text.includes(w.toLowerCase()))
    if (!allPresent) { continue }

    // Open ancestor <details> so this summary is reachable
    openAncestors(summary)

    // Highlight matching words inside the summary
    const created = highlightInElement(summary, words)
    if (created.length > 0) {
      matches.push({ summary, marks: created })
    }
  }
  if (matches.length > 0) {
    currentIdx = 0
    refreshCurrentClass()
    scrollToCurrent()
  }
  updateCount()
}

function navigate(dir) {
  if (!matches.length) { return }
  currentIdx = (currentIdx + dir + matches.length) % matches.length
  refreshCurrentClass()
  scrollToCurrent()
  updateCount()
}

function append(html, el = document.body) {
  const range = document.createRange()
  range.selectNode(el)
  const frag = range.createContextualFragment(html)
  return el.appendChild(frag)
}

///////////////////////////////////////////////////////////////////////////////
// DOM
append(html)

// $input (mainly)
// $count (number of matches)
// $btnUp, $btnDn (for events)
const $input = document.querySelector('#find input')
const $count = document.querySelector('#find .count')
const $btnUp = document.querySelector('#find-prev')
const $btnDn = document.querySelector('#find-next')

///////////////////////////////////////////////////////////////////////////////
// Events

{
  let debounceTimer
  $input.addEventListener('input', () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(doSearch, 120)
  })
}

$btnDn.addEventListener('click', () => navigate(1))
$btnUp.addEventListener('click', () => navigate(-1))
$input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    navigate(e.shiftKey ? -1 : 1)
  } else if (e.key === 'Escape') {
    $input.value = ''
    doSearch()
  }
})
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey       // keycombo with a qualifier
      || e.key === 'Shift'                     // shift alone
      || e.key === 'CapsLock'                  // shift alone
      || $input.contains(e.target)) {
    return
  }
  $input.focus()
  $input.select()
})

//[eof]
