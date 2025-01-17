(w=>{
	let l,X='(\n?(?:.+\n)*?.*?)',s=x=>x.replace(/\s+/g,' ').trim(),e=x=>x.replace(/[&'\\#<>`*~_=:"![\]()\n\t-]/g,m=>`&#${m.charCodeAt(0)};`),r=[
		[/\r\n?/,'\n'],
		[/\n+```\n([^]*?)\n```\n*(?=\n)/,(_,m)=>`\n\n<pre>${e(m)}</pre>\n`],
		[/([^\\])(?<!\\)(`+)(X([^`\n\\]|.\n))\2(?!`)/,(_,p,m,n)=>p+`<tt>${e(n.replace(/^(\s)(.*)\1$/,'$2'))}</tt>`],
		[/\\[\x21-\x2f:;<=>?@[\\\]^_`{|}~\n]/,m=>m=='\\\n'?'<br>':`&#${m.charCodeAt(1)};`],
		[/\n\[X\]: +(?:<X>|((?!<)\S+))(?: +(?:'X'|"([^"]*)"|\(([^)]*)\)|(\S+)))?(?=\n)/,(_,n,a,b,c,d,e,f)=>(l[s(n)]=[b??s(a),c||d||e||f],'')],
		[/\n\n([-_*]) *(\1 *){2,}(?=\n\n)/,'\n\n<hr>'],
		[/\n\n(#{1,6}) +(\S.*?)( +#+)?(?=\n\n)/,(_,i,n)=>`\n\n<h${i=i.length}>${n}</h${i}>`],
		[/\n(.+?(?:\n.+?)*?)\n(?:(=+)|-+)(?=\n)/,(_,x,i)=>`\n<h${i=i?1:2}>${x}</h${i}>\n`],
		[/\n> *(.*)/,'\n\n<blockquote>\n\n$1\n\n</blockquote>\n'],
		[/\n\n<\/(blockquote)>\n\n\n<\1>\n\n/,'\n'],
		[/\n[-+*] +(.+(\n .+)*)/,'\n\n<ul><li>$1</li></ul>\n'],
		[/\n\d+[.)] +(.+(\n .+)*)/,'\n\n<ol><li>$1</li></ol>\n'],
		[/<\/(ol|ul)>\n\n\n<\1>/,''],
		[/___X___/,'<u>$1</u>'],
		[/(\*\*|__)X\1/,'<b>$2</b>'],
		[/([*_])(?!\1)X\1/,'<i>$2</i>'],
		[/~~X~~/,'<s>$1</s>'],
		[/:"X":/,'<q>$1</q>'],
		[/(!?)\[X\]\(X\)/,(_,q,t,u)=>q?`<img src="${s(u)}" alt="${t}">`:`<a href="${s(u)}">${t}</a>`],
		[/(!?)\[X\](?:\[X\])?/,(w,q,t,n)=>(n=s(n||t),l[n]?q?`<img src="${l[n][0]}" title="${l[n][1]||''}" alt="${t}">`:`<a href="${l[n][0]}" title="${l[n][1]||''}">${t}</a>`:w)],
		[/\n\n(.+(\n.+)*)(?=\n\n)/,(w,m)=>/^<(\/|address|article|aside|blockquote|details|div|[dou]l|fieldset|fig(caption|ure)|footer|form|h\d|header|hgroup|hr|main|menu|nav|p|pre|(no)?script|search|section|style|table)\b/.test(m)?w:`\n\n<p>${m}</p>`]
	].map(([r,s])=>[RegExp(r.source.replace(/X/g,X),'g'),s])
	w.baremark=x=>x===undefined?r:(l={},r.reduce((a,r)=>a.replace(...r),`\n\n${x}\n\n`).trim())
	w.baremark.escape=e
})(self)
