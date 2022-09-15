(w=>{
	let l,e=x=>x.replace(/[&'\\#<>`*~_=:"![\]()\n\t-]/g,m=>`&#${m.charCodeAt(0)};`),r=[
		[/\r\n?/g,'\n'],
		[/\n\n```\n(.*?)\n```(?=\n\n)/gs,(_,m)=>`\n\n<pre>${e(m)}</pre>`],
		[/\n\[(.+?)\]:\s+(?:<\s*([^>]*)\s*>|(\S+))(?:\s+(?:'([^']*)'|"([^"]*)"|\(([^)]*)\)|(\S+)))?$/gm,(_,n,a,b,c,d,e,f)=>(l[n]=[a||b,c||d||e||f],'')],
		[/(`+)(\n?(.+\n)*?.*?([^`\n]|.\n))\1(?!`)/g,(_,m,n)=>`<tt>${e(n.replace(/^(\s)(.*)\1$/,'$2'))}</tt>`],
		[/\\[\x21-\x2f:;<=>?@[\\\]^_`{|}~\n]/g,m=>m=='\\\n'?'<br>':`&#${m.charCodeAt(1)};`],
		[/\n\n([-_*])[ \t]*(\1[ \t]*){2,}(?=\n\n)/g,'\n\n<hr>'],
		[/\n\n(#{1,6})[ \t]+(\S.*?)([ \t]+#+)?(?=\n\n)/g,(_,m,n)=>`\n\n<h${m.length}>${n.trim()}</h${m.length}>`],
		[/\n\n(.+(\n.+)*)\n=+(?=\n\n)/g,'\n\n<h1>$1</h1>'],
		[/\n\n(.+(\n.+)*)\n-+(?=\n\n)/g,'\n\n<h2>$1</h2>'],
		[/\n>[ \t]*(.*)/g,'\n\n<blockquote>\n\n$1\n\n</blockquote>\n'],
		[/\n\n<\/(blockquote)>\n\n\n<\1>\n\n/g,'\n'],
		[/\n[-+*][ \t]+(.*)/g,'\n\n<ul><li>$1</li></ul>\n'],
		[/\n\d+[.)][ \t]*(.*)/g,'\n\n<ol><li>$1</li></ol>\n'],
		[/<\/(ol|ul)>\n\n\n<\1>/g,''],
		[/___(\n?(.+\n)*?.*?)___/g,'<u>$1</u>'],
		[/(\*\*|__)(\n?(.+\n)*?.*?)\1/g,'<b>$2</b>'],
		[/([*_])(?!\1)(\n?(.+\n)*?.*?)\1/g,'<i>$2</i>'],
		[/~~(\n?(.+\n)*?.*?)~~/g,'<s>$1</s>'],
		[/:"(\n?(.+\n)*?.*?)":/g,'<q>$1</q>'],
		[/!\[(.+?)\]\s*\((.+?)\)/g,'<img src="$2" alt="$1">'],
		[/\[(.+?)\](?:\[(.+?)\])?/g,(w,t,n)=>(n=n||t,l[n]?`<a href="${l[n][0]}" title="${l[n][1]||''}">${t}</a>`:w)],
		[/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>'],
		[/\n\n(.+(\n.+)*)(?=\n\n)/g,(w,m)=>/^<(\/|blockquote|h\d|hr|li|ol|ul|p|pre|table)\b/.test(m)?w:`\n\n<p>${m}</p>`]]
	w.baremark=x=>(l={},r.reduce((a,r)=>a.replace(...r),`\n\n${x}\n\n`).trim())
	w.baremark.add=(p,s)=>r.push([RegExp(p,'g'),s])
})(self)
