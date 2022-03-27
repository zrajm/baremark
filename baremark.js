((w,n)=>{
	let esc=x=>x.replace(/\&/g,'&amp;').replace(/['#<>`*~_=:"!\[\]()\n\t-]/g,m=>`&#${m.charCodeAt(0)};`),
	r=[
		[/\r\n/g,'\n'],
		[/\n\s*```\n([^]*?)\n\s*```\s*\n/g,(_,m)=>`<pre>${esc(m)}</pre>`],
		[/`(.*?)`/g,(_,m)=>`<code>${esc(m)}</code>`],
		[/\n\s*(#+)(.*?)/g,(_,m,n)=>`<h${m.length}>${n.trim()}</h${m.length}>`],
		[/\n\s*(.*?)\n={3,}\n/g,'\n<h1>$1</h1>\n'],
		[/\n\s*(.*?)\n-{3,}\n/g,'\n<h2>$1</h2>\n'],
		[/___(.*?)___/g,'<u>$1</u>'],
		[/(\*\*|__)(.*?)\1/g,'<strong>$2</strong>'],
		[/(\*|_)(.*?)\1/g,'<em>$2</em>'],
		[/~~(.*?)~~/g,'<del>$1</del>'],
		[/:"(.*?)":/g,'<q>$1</q>'],
		[/\!\[([^\[]+?)\]\s*\(([^\)]+?)\)/g,'<img src="$2" alt="$1">'],
		[/\[([^\[]+?)\]\s*\(([^\)]+?)\)/g,'<a href="$2">$1</a>'],
		[/\n\s*(\*|\-)\s*([^\n]*)/g,'\n<ul><li>$2</li></ul>'],
		[/\n\s*\d+\.\s*([^\n]*)/g,'\n<ol><li>$1</li></ol>'],
		[/\n\s*(\>|&gt;)\s*([^\n]*)/g,'\n<blockquote>$2</blockquote>'],
		[/<\/(ul|ol|blockquote)>\s*<\1>/g,' '],
		[/\n\s*\*{5,}\s*\n/g,'\n<hr>'],
		[/\n{3,}/g,'\n\n'],
		[/\n([^\n]+)\n/g,(_,m)=>{m=m.trim();return/^\<\/?(ul|ol|bl|h\d|p).*/.test(m.slice(0,9))?m:`<p>${m}</p>`}],
		[/>\s+</g,'><']
	]
	w[n]={
		addRule:(p,s)=>r.push([RegExp(p,'g'),s]),
		render:x=>r.reduce((x,[p,s])=>x.replace(p,s),`\n${x}\n`)}
})(self,'Baremark')
