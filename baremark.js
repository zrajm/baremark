(function(w,n){
	var esc=function(x){
		x=x.replace(/\&/g,'&amp;')
		var c='\'#<>`*-~_=:"![]()nt',l=c.length,i
		for(i=0;i<l;i++)x=x.replace(RegExp('\\'+c[i],'g'),function(m){return'&#'+m.charCodeAt(0)+';'})
		return x
	},r=[
		[/\r\n/g,'\n'],
		[/\n\s*```\n([^]*?)\n\s*```\s*\n/g,function(_,m){return'<pre>'+esc(m)+'</pre>'}],
		[/`(.*?)`/g,function(_,m){return'<code>'+esc(m)+'</code>'}],
		[/\n\s*(#+)(.*?)/g,function(l,m,n){l=m.length;return'<h'+l+'>'+n.trim()+'</h'+l+'>'}],
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
		[/\n([^\n]+)\n/g,function(_,m){m=m.trim();return/^\<\/?(ul|ol|bl|h\d|p).*/.test(m.slice(0,9))?m:('<p>'+m+'</p>')}],
		[/>\s+</g,'><']
	],l=r.length,i
	w[n]={
		addRule:function(p,s){r.push([RegExp(p,'g'),s])},
		render:function(x){
			if(x=x||''){
				x='\n'+x.trim()+'\n'
				for(var i=0;i<l;i++)x=x.replace(r[i][0],r[i][1])
			}
			return x
		}
	}
})(self,'Baremark')
