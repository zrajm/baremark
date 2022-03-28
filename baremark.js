((w,n)=>{
	let esc=x=>x.replace(/\&/g,'&amp;').replace(/['\\#<>`*~_=:"!\[\]()\n\t-]/g,m=>`&#${m.charCodeAt(0)};`),r=[
		[/\r\n?/g,'\n'],
		[/\n\n```\n([^]*?)\n```(?=\n\n)/g,(_,m)=>`\n\n<pre>${esc(m)}</pre>`],
		[/(`+)((\n?.+?)*?(\n?[^`\n]|.\n))\1(?!`)/g,(_,m,n)=>`<code>${esc(n.replace(/^(\s)(.*)\1$/,'$2'))}</code>`],
		[/\\[\x21-\x2f:;<=>?@[\\\]^_`{|}~\n]/g,m=>(x=>x==10?'<br>':`&#${x};`)(m.charCodeAt(1))],
		[/\n\n([-_*][^\S\n]*){3,}(?=\n\n)/g,'\n\n<hr>'],
		[/\n\n(#{1,6})[^\S\n]+(\S.*?)([^\S\n]+#+)?(?=\n\n)/g,(_,m,n)=>`\n\n<h${m.length}>${n.trim()}</h${m.length}>`],
		[/\n\n(.+(\n.+)*)\n=+(?=\n\n)/g,'\n\n<h1>$1</h1>'],
		[/\n\n(.+(\n.+)*)\n-+(?=\n\n)/g,'\n\n<h2>$1</h2>'],
		[/\n\>[^\S\n]*(.*)/g,'\n\n<blockquote>\n\n$1\n\n</blockquote>\n'],
		[/\n\n<\/(blockquote)>\n\n\n<\1>\n\n/g,'\n'],
		[/\n[-+*][^\S\n]+(.*)/g,'\n\n<ul><li>$1</li></ul>\n'],
		[/\n\d+[.)][^\S\n]*(.*)/g,'\n\n<ol><li>$1</li></ol>\n'],
		[/<\/([ou]l)>\n\n\n<\1>/g,''],
		[/___(\n?(.+\n)*?.+?\n?)___/g,'<u>$1</u>'],
		[/(\*\*|__)(\n?(.+\n)*?.+?\n?)\1/g,'<strong>$2</strong>'],
		[/([*_])(?!\1)(\n?(.+\n)*?.+?\n?)\1/g,'<em>$2</em>'],
		[/~~(\n?(.+\n)*?.+?\n?)~~/g,'<del>$1</del>'],
		[/:"(\n?(.+\n)*?.+?\n?)":/g,'<q>$1</q>'],
		[/\!\[([^\[]+?)\]\s*\(([^\)]+?)\)/g,'<img src="$2" alt="$1">'],
		[/\[([^\[]+?)\]\s*\(([^\)]+?)\)/g,'<a href="$2">$1</a>'],
		[/\n\n(.+(\n.+)*)(?=\n\n)/g,(w,m)=>/^\<(\/|blockquote|h\d|hr|li|ol|ul|p|pre|table)\b/.test(m)?w:`\n\n<p>${m}</p>`]]
	w[n]={
		addRule:(p,s)=>r.push([RegExp(p,'g'),s]),
		render:x=>r.reduce((x,[p,s])=>x.replace(p,s),`\n\n${x}\n\n`).trim()}
})(self,'Baremark')
