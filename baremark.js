(w=>{
	let l,t=x=>`((?:${x}|\n(?!\n))*?)`,b=x=>x==null?r:(l={},r.reduce((a,r)=>a.replace(...r),`\n\n${x}\n\n`).trim()),m={N:'\n',X:t('.'),Y:t('[^()[\\]\n]')},s=x=>x.trim().replace(/\s+/g,' '),q=x=>`&#${x.charCodeAt()};`,e=(x,r='&#|')=>x.replace(RegExp(`[${r}'\\\\<>\`*~_=:"![\\]()\n\t-]`,'g'),q),h=(z,x,u,a='')=>(u=e(s(u),''),a=e(a,''),z?`<img src="${u}" title="${a}" alt="${e(x,'')}">`:`<a href="${u}" title="${a}">${x}</a>`),y=z=>(w,x,r,u)=>u?h(z,x,u):(r=l[n(r||x)],r?h(z,x,...r):w),n=x=>s(x).toLowerCase(),r=[
		[/[ \t]*(\rN?|N)/,'\n'],
		[/NN>(.*(N.+)*)(?=NN)/,x=>`\n\n<blockquote>\n\n${b(x.replace(/^> ?/gm,''))}\n\n</blockquote>\n`],
		[/N+(([~`])\2\2+) *([^~`N]*)N(?:([^]*?)N)?\1\2*N*(?=N)/,(_,a,b,c='',x='')=>`\n\n<pre class="${c}">${e(x)}</pre>\n`],
		[/([^\\](?:\\\\)*)(`+)(X([^`N\\]|.N))\2(?!`)/,(_,a,b,x)=>a+`<tt>${e(x.replace(/^[ \n](.+)[ \n]$/,'$1'))}</tt>`],
		[/\\([\x21-\x2f:;<=>?@[\\\]^_`{|}~N])/,(_,x)=>x=='\n'?'<br>':q(x)],
		[/N\[Y\]: +(?:<X>|((?!<)\S+))(?: +(?:'X'|"([^"]*)"|\(([^)]*)\)|(\S+)))?(?=N)/,(_,r,u,v,a,b,c,d)=>(l[n(r)]??=[u??v,a??b??c??d],'')],
		[/!\[Y\](?:\[Y\]|\(Y\))?/,y(1)],
		[/\[Y\](?:\[Y\]|\(Y\))?/,y()],
		[/NN([-_*])( *\1){2,}(?=NN)/,'\n\n<hr>'],
		[/N(?:[-+*]|(\d+)[.)]) +(.+(N .+)*)/,(_,i,x)=>`\n\n<${i=i?'ol':'ul'}><li>${x}</li></${i}>\n`],
		[/<\/(ol|ul)>NNN<\1>/,''],
		[/NN(#{1,6}) +(\S.*?)( +#+)?(?=NN)/,(_,i,x)=>`\n\n<h${i=i.length}>${x}</h${i}>`],
		[/N(.+?(?:N.+?)*?)N(?:(=+)|-+)(?=N)/,(_,x,i)=>`\n<h${i=i?1:2}>${x}</h${i}>\n`],
		[/___X___/,'<u>$1</u>'],
		[/(\*\*|__)X\1/,'<b>$2</b>'],
		[/([*_])(?!\1)X\1/,'<i>$2</i>'],
		[/~~X~~/,'<s>$1</s>'],
		[/:"X":/,'<q>$1</q>'],
		[/NN(.+(N.+)*)(?=NN)/,(w,x)=>/<\/?(address|article|aside|blockquote|details|div|[dou]l|fieldset|fig(caption|ure)|footer|form|h[1-6r]|header|hgroup|main|menu|nav|p|pre|(no)?script|search|section|style|table)\b/i.test(x)?w:`\n\n<p>${x}</p>`]
	].map(([r,s])=>[RegExp(r.source.replace(/[NXY]/g,x=>m[x]),'g'),s])
	w.baremark=b;b.escape=e
})(self)
