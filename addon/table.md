# `addon/table.js`

This is a Markdown table plugin. It is compatible with Github Flavored Markdown
(GFM) tables, except that the [delimiter row][1] is optional and may occur more
than once. If a delimiter row is present, the table will have both a `<thead>`
(with `<th>` cells) and `<tbody>` (with `<td>` cells); without it, the table
will only have a `<tbody>`.

The pipe characters (`|`) at the beginning and end of lines are optional. The
delimiter row (if present) must consist of at least one dash `-`, and either a
colon `:` or pipe `|` character (as dashes alone will be interpreted as either
a bullet point, or a dinkus).

Column alignment is specified by adding a colon `:` to either the left, right
or both sides (for centered). By default no alignment is specified (which means
centered in `<th>` cells, and left aligned in `<td>` cells unless your CSS says
otherwise).

    | left | right | centered | default |
    |:-----|------:|:--------:|---------|
    | aa   |    bb |    cc    | dd      |
    | x    |     y |    x     | y       |

[1]: https://github.github.com/gfm/#delimiter-row "GFM Spec"

<!--[eof]-->
