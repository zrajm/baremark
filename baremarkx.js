(w=>{
	let l,j=x=>`(\n?(?:${x}+?\n)*?${x}*?)`,b=(x,p=r[1])=>p.reduce((a,r)=>a.replace(...r),x),m={N:'\n',X:j('.'),Y:j('[^()[\\]\n]')},s=x=>x.trim().replace(/\s+/g,' '),q=c=>`&#${c.charCodeAt()};`,e=(x,r='&#|')=>x.replace(RegExp(`[${r}'\\\\<>\`*~_=:"![\\]()\n\t-]`,'g'),q),h=(q,t,u,x='')=>(u=e(s(u),''),x=e(x,''),q?`<img src="${u}" title="${x}" alt="${e(t,'')}">`:`<a href="${u}" title="${x}">${t}</a>`),y=x=>(w,t,r,u)=>u?h(x,t,u):(r=l[v(r||t)],r?h(x,t,...r):w),v=x=>s(x).toLowerCase(),r=[[
		[/[ \t]*(\rN?|N)/,'\n'],
		[/NN>(.*(N.+)*)(?=NN)/,x=>`\n\n<blockquote>${b(x.replace(/^> ?/gm,'')+'\n\n',r[0])}</blockquote>\n`],
		[/N+(([~`])\2\2+)N(?:([^]*?)N)?\1\2*N*(?=N)/,(_,a,b,m='')=>`\n\n<pre>${e(m)}</pre>\n`],
		[/([^\\](?:\\\\)*)(`+)(X([^`N\\]|.N))\2(?!`)/,(_,p,m,n)=>p+`<tt>${e(n.replace(/^[ \n](.+)[ \n]$/,'$1'))}</tt>`],
		[/\\([\x21-\x2f:;<=>?@[\\\]^_`{|}~N])/,(_,c)=>c=='\n'?'<br>':q(c)],
		[/N\[Y\]: +(?:<X>|((?!<)\S+))(?: +(?:'X'|"([^"]*)"|\(([^)]*)\)|(\S+)))?(?=N)/,(_,n,a,b,c,d,g,f)=>(l[v(n)]??=[b??a,c||d||g||f],'')],
		[/NN([-_*])( *\1){2,}(?=NN)/,'\n\n<hr>'],
		[/N(?:[-+*]|(\d+)[.)]) +(.+(N .+)*)/,(_,i,c)=>`\n\n<${i=i?'ol':'ul'}><li>${b(c)}</li></${i}>\n`],
		[/<\/(ol|ul)>NNN<\1>/,''],
		[/NN(#{1,6}) +(\S.*?)( +#+)?(?=NN)/,(_,i,n)=>`\n\n<h${i=i.length}>${b(n)}</h${i}>`],
		[/N(.+?(?:N.+?)*?)N(?:(=+)|-+)(?=N)/,(_,x,i)=>`\n<h${i=i?1:2}>${b(x)}</h${i}>\n`],
		[/NN(.+(N.+)*)(?=NN)/,(w,m)=>/<\/?(address|article|aside|blockquote|details|div|[dou]l|fieldset|fig(caption|ure)|footer|form|h[1-6r]|header|hgroup|main|menu|nav|p|pre|(no)?script|search|section|style|table)\b/i.test(m)?b(w):`\n\n<p>${b(m)}</p>`]
	],[
		[/!\[Y\](?:\[Y\]|\(Y\))?/,y(1)],
		[/\[Y\](?:\[Y\]|\(Y\))?/,y()],
		[/___X___/,'<u>$1</u>'],
		[/(\*\*|__)X\1/,'<b>$2</b>'],
		[/([*_])(?!\1)X\1/,'<i>$2</i>'],
		[/~~X~~/,'<s>$1</s>'],
		[/:"X":/,'<q>$1</q>'],
	]].map(r=>r.map(([r,s])=>[RegExp(r.source.replace(/[NXY]/g,w=>m[w]),'g'),s]))
	w.baremarkx=x=>(l={},x==null?r:b(`\n\n${x}\n\n`,r[0]).trim())
	w.baremarkx.escape=e
})(self)
