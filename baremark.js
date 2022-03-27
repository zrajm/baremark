(function(w, libName){
	var esc=function(s){
	    s = s.replace(/\&/g, '&amp;')
	    var escChars = '\'#<>`*-~_=:"![]()nt',c,l=escChars.length,i
	    for(i=0;i<l;i++) s=s.replace(RegExp('\\'+escChars[i], 'g'), function(m){return'&#'+m.charCodeAt(0)+';'})
	    return s
	}, rules = [
            [/\r\n/g, '\n'],
            [/\n\s*```\n([^]*?)\n\s*```\s*\n/g, function(m,grp){return'<pre>'+esc(grp)+'</pre>'}],
            [/`(.*?)`/g, function(m,grp){return'<code>'+esc(grp)+'</code>'}],
            [/\n\s*(#+)(.*?)/g, function(m,hset,hval){m=hset.length;return'<h'+m+'>'+hval.trim()+'</h'+m+'>'}],
            [/\n\s*(.*?)\n={3,}\n/g, '\n<h1>$1</h1>\n'],
            [/\n\s*(.*?)\n-{3,}\n/g, '\n<h2>$1</h2>\n'],
            [/___(.*?)___/g, '<u>$1</u>'],
            [/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>'],
            [/(\*|_)(.*?)\1/g, '<em>$2</em>'],
            [/~~(.*?)~~/g, '<del>$1</del>'],
            [/:"(.*?)":/g, '<q>$1</q>'],
            [/\!\[([^\[]+?)\]\s*\(([^\)]+?)\)/g, '<img src="$2" alt="$1">'],
            [/\[([^\[]+?)\]\s*\(([^\)]+?)\)/g, '<a href="$2">$1</a>'],
            [/\n\s*(\*|\-)\s*([^\n]*)/g, '\n<ul><li>$2</li></ul>'],
            [/\n\s*\d+\.\s*([^\n]*)/g, '\n<ol><li>$1</li></ol>'],
            [/\n\s*(\>|&gt;)\s*([^\n]*)/g, '\n<blockquote>$2</blockquote>'],
            [/<\/(ul|ol|blockquote)>\s*<\1>/g,  ' '],
            [/\n\s*\*{5,}\s*\n/g, '\n<hr>'],
            [/\n{3,}/g, '\n\n'],
            [/\n([^\n]+)\n/g, function(m, grp){grp=grp.trim();return /^\<\/?(ul|ol|bl|h\d|p).*/.test(grp.slice(0,9)) ? grp : ('<p>'+grp+'</p>')}],
            [/>\s+</g, '><']
	], l = rules.length, i
 
	w[libName] = {
		addRule:function(ruleString, replacement) {rules.push([RegExp(ruleString, 'g'), replacement])},
		render:function(text) {
		    if(text = text || '') {
		    	text = '\n' + text.trim() + '\n'
			for(var i=0;i<l;i++) text = text.replace(rules[i][0], rules[i][1])
		    }
		    return text
		}
	}
})(self, 'Baremark')
