(w=>{
	let l,m={X:'(\n?(?:.+?\n)*?.*?)',Y:'(\n?(?:[^()[\\]\n]+\n)*[^()[\\]\n]*)'},s=x=>x.trim().replace(/\s+/g,' '),q=c=>`&#${c.charCodeAt()};`,e=(x,r='&#')=>x.replace(RegExp(`[${r}'\\\\<>\`*~_=:"![\\]()\n\t-]`,'g'),q),h=(q,t,u,x='')=>(u=e(s(u),''),q?`<img src="${u}" title="${e(x,'')}" alt="${e(t,'')}">`:`<a href="${u}" title="${e(x,'')}">${t}</a>`),y=x=>(w,t,r,u)=>u?h(x,t,u):(r=l[v(r||t)],r?h(x,t,...r):w),v=x=>s(x).toLowerCase(),r=[
		[/[ \t]*(\r\n?|\n)/,'\n'],
		[/\n+```\n([^]*?)\n```\n*(?=\n)/,(_,m)=>`\n\n<pre>${e(m)}</pre>\n`],
		[/([^\\])(?<!\\)(`+)(X([^`\n\\]|.\n))\2(?!`)/,(_,p,m,n)=>p+`<tt>${e(n.replace(/^(\s)(.*)\1$/,'$2'))}</tt>`],
		[/\\([\x21-\x2f:;<=>?@[\\\]^_`{|}~\n])/,(_,c)=>c=='\n'?'<br>':q(c)],
		[/\n\[X\]: +(?:<X>|((?!<)\S+))(?: +(?:'X'|"([^"]*)"|\(([^)]*)\)|(\S+)))?(?=\n)/,(_,n,a,b,c,d,g,f)=>(l[v(n)]=[b??a,c||d||g||f],'')],
		[/!\[Y\](?:\[Y\]|\(Y\))?/,y(1)],
		[/\[Y\](?:\[Y\]|\(Y\))?/,y()],
		[/\n> *(.*)/,'\n\n<blockquote>\n\n$1\n\n</blockquote>\n'],
		[/\n\n<\/(blockquote)>\n\n\n<\1>\n\n/,'\n'],
		[/\n\n([-_*]) *(\1 *){2,}(?=\n\n)/,'\n\n<hr>'],
		[/\n\n(#{1,6}) +(\S.*?)( +#+)?(?=\n\n)/,(_,i,n)=>`\n\n<h${i=i.length}>${n}</h${i}>`],
		[/\n(.+?(?:\n.+?)*?)\n(?:(=+)|-+)(?=\n)/,(_,x,i)=>`\n<h${i=i?1:2}>${x}</h${i}>\n`],
		[/\n[-+*] +(.+(\n .+)*)/,'\n\n<ul><li>$1</li></ul>\n'],
		[/\n\d+[.)] +(.+(\n .+)*)/,'\n\n<ol><li>$1</li></ol>\n'],
		[/<\/(ol|ul)>\n\n\n<\1>/,''],
		[/___X___/,'<u>$1</u>'],
		[/(\*\*|__)X\1/,'<b>$2</b>'],
		[/([*_])(?!\1)X\1/,'<i>$2</i>'],
		[/~~X~~/,'<s>$1</s>'],
		[/:"X":/,'<q>$1</q>'],
		[/\n\n(.+(\n.+)*)(?=\n\n)/,(w,m)=>/^<(\/|address|article|aside|blockquote|details|div|[dou]l|fieldset|fig(caption|ure)|footer|form|h\d|header|hgroup|hr|main|menu|nav|p|pre|(no)?script|search|section|style|table)\b/.test(m)?w:`\n\n<p>${m}</p>`]
	].map(([r,s])=>[RegExp(r.source.replace(/[XY]/g,w=>m[w]),'g'),s])
	w.baremark=x=>x===undefined?r:(l={},r.reduce((a,r)=>a.replace(...r),`\n\n${x}\n\n`).trim())
	w.baremark.escape=e
})(self)
