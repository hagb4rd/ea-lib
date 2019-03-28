function* kv(obj, parentKey="", parent=null) { var keys=Object.getOwnPropertyNames(obj); for(let i=0;i<keys.length;i++) { let k=keys[i]; let v=obj[k]; if (typeof v=='object') { yield* kv(v, k, obj); }; yield({k:k,v:v,obj:obj, parent:parent, parentKey:parentKey})}};
kv.help='var a={a: {b :{c: 23}}}; [...kv(a)].filter(({k,v,obj,parent,parentKey})=>parentKey="c")';

module.exports = kv;