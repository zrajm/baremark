// -*- mode: js; js-indent-level: 2 -*-
// Copyright (c) 2026 by zrajm. License: GPLv2
//
// Drop this into any HTML page to get a floating search widget
// that finds text inside <details><summary> elements.
const css = `
  #find {
    position: fixed;
    top: 0; right: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
    font: 16px/22px sans-serif;
    & .box {
      position: relative;
      left: 0%;
      /* unfocused empty input = hide */
      &:has(input:not(:focus)):has(input:placeholder-shown) { left: calc(100% - 40px) }
      transition: left 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0;
      overflow: hidden;
      background: #222;
      border: 1.5px solid currentColor;
      border-radius: 22px;
      padding: 0 6px;
      box-shadow: 0 4px 8px #000;
      color: #777;
      &:has(input:focus) { color: #aaa; }
      & > svg {
        margin: 2px 0 0 8px;
        opacity: .8;
      }
    }
    & input {
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      padding: 8px 12px;
      width: 200px;
      font: inherit;
      &::placeholder { color: #7778; }
      caret-color: #fff;
    }
    & .divider {
      width: 1px;
      height: 22px;
      opacity: .5;
      background: currentColor;
      flex-shrink: 0;
    }
    & .count {
      padding: 0 10px;
      min-width: 60px;
      text-align: center;
      white-space: nowrap;
    }
    & button {
      background: transparent;
      border: none;
      cursor: pointer;
      color: inherit;
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
    background: #88fa;
    color: inherit;
    padding: 0 1px;
    transition: background 0.12s;
  }
  mark.find-hilite-current {
    background: #88f;
    color: #000;
    box-shadow: 0 0 0 1.5px #f5c40055;
  }`
const html = `
  <style>${css}</style>
  <div id="find">
    <div class="box">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="m22 24-8-8 2-2 8 8zM16.1 9.4a6.7 6.7 0 1 0-13.4 0 6.7 6.7 0 0 0 13.4 0zm2.7 0A9.4 9.4 0 1 1 0 9.4a9.4 9.4 0 0 1 18.8 0z" fill="currentColor"></path>
      </svg>
      <input type="text" placeholder="Search test names…" autocomplete="off" spellcheck="false">
      <div class="divider"></div>
      <span class="count">—</span>
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
  $count.textContent = $input.value.trim()
    ?`${currentIdx + 1}/${matches.length}` : '—'
}

// Core search
function doSearch(queryStr) {
  clearAllHighlights()
  matches = []
  currentIdx = -1
  updateCount()
  queryStr = queryStr.trim()
  if (!queryStr) { return }

  // Each whitespace-separated token is searched independently
  const queryWords = queryStr.split(/\s+/)
    .filter(Boolean)
    .map(x => x.toLowerCase())
  if (!queryWords.length) { return }

  for (const [summary, text] of searchIndex()) {
    const allPresent = queryWords.every(x => text.includes(x))
    if (!allPresent) { continue }

    // Open ancestor <details> so this summary is reachable
    openAncestors(summary)

    // Highlight matching words inside the summary
    const created = highlightInElement(summary, queryWords)
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
const $find  = document.querySelector('#find')
const $input = document.querySelector('#find input[type="text"]')
const $count = document.querySelector('#find .count')
const $btnUp = document.querySelector('#find-prev')
const $btnDn = document.querySelector('#find-next')

///////////////////////////////////////////////////////////////////////////////
// Events

// Next/previous match keys.
$btnDn.addEventListener('click', e => { event.stopPropagation(); navigate( 1) })
$btnUp.addEventListener('click', e => { event.stopPropagation(); navigate(-1) })
$find .addEventListener('click', e => { $input.focus() })

// Enter/Shift-Enter & Escape in <input>.
let prevInputStr = ''
$input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    const inputStr = $input.value.trim()
    if (inputStr !== prevInputStr) {
      doSearch(prevInputStr = inputStr)
    }
    navigate(e.shiftKey ? -1 : 1)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    $input.value = ''
    $input.blur()
  }
})
// Any keypress in document that results in a character being inputted, will
// first focus the search field.
document.addEventListener('keydown', e => {
  if (e.key.length === 1                       // if would input a character
      && !(e.ctrlKey || e.metaKey || e.altKey) //   and doesn't use qualifier
      && e.target !== $input) {                //   <input> isn't selected
    $input.focus()
  }
})

export default function searchIndex(...elements) {
  searchIndex.index ??= []
  if (elements.length) {
    searchIndex.index.push(...elements.map(
      el => [el, el.textContent.toLowerCase()]))
  }
  return searchIndex.index
}

//[eof]
