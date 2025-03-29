// Baremark rule for reading header style metadata. Processes first paragraph
// as metadata if (and only if) it looks like an email headers (e.g. 'Author:
// <name>'). After invoking `baremark()` to parse the incoming text,
// `baremarkHeaders.get()` will return an object with metadata values.
const baremarkHeaders = (meta => Object.assign([
  /^(\n*)(\w+:.*\n((\w+:|[\t ]).*\n)*)\n+/,
  (_, nl, txt) => (txt.split(/\n(?=\w)/).forEach(x => {
    const [_, name, value] = /^(\w+):(.*)/s.exec(x)
    meta[name.toLowerCase()] = value.trim().replace(/\s+/, ' ')
  }), nl)
], { get: () => meta }))({})
//[eof]
