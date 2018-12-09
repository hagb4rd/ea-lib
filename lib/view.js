var cmp=(a,b)=>String(a).localeCompare(String(b));

var view=module.exports=(obj)=>{ var cx={f:[],o:[]}; for(var key in obj) { if(typeof(obj[key])=='function') { cx.f.push(key+"()") } else { cx.o.push(key) }}; cx.f.sort((a,b)=>cmp(a,b)); cx.o.sort((a,b)=>cmp(a,b)); return [cx.f.join(', '),cx.o.join(', ')].join(', '); }