function* kv(obj, parentKey="", parent=null) { var keys=Object.getOwnPropertyNames(obj); for(let i=0;i<keys.length;i++) { let k=keys[i]; let v=obj[k]; if (typeof v=='object') { yield* kv(v, k, obj) } else { yield({k:k,v:v,obj:obj, parent:parent, parentKey:parentKey})}}};
var find = kv.find =(iterable,fn,offset=0)=>{ var i=0; var pos=-1; for (var n of iterable) { console.log(`iteration:${i} offset: ${offset} pos:${pos} fn(${n}):${fn(n)} offset==pos:${offset===pos} | `); if(fn(n)) {  pos++; if(pos===offset) { return n; } } i++; } };

module.exports = kv;