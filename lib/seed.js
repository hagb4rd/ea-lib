
var seed=module.exports=(s)=>{ var xorString=s=>[...String(s)].reduce((prev, next)=>prev^=next.charCodeAt(0), 0xFF); const X=9301,A=49297,M=233280; var S=xorString(s); var min,max; return (a,b,fn)=>{ S=(S*X+A)%M; return typeof(a) == "undefined" ? S/M : (min=Math.min(a||0,b||0),max=Math.max(a||0,b||0),fn=fn||Math.floor,fn(min+(S/M)*(max-min+(typeof(b)!='undefined'?1:0)))); }};

