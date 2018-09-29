var cmp=(a,b)=>String(a).localeCompare(String(b));

var inspect=module.exports=(obj)=>{ var cx={f:[],o:[]}; for(key in obj) { if(typeof(obj[key])=='function') { cx.f.push(key+"()") } else { cx.o.push(key) }}; cx.f.sort((a,b)=>cmp(a,b)); cx.o.sort((a,b)=>cmp(a,b)); return [cx.f.join(', '),cx.o.join(', ')].join(', '); }