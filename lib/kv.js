function* kv(obj, parentKey = "", parent = null) { 
    var keys=Object.getOwnPropertyNames(obj);
    for(let i=0;i<keys.length;i++) {
        let k=keys[i];
        let v=obj[k];
        if (typeof v=='object') { yield* kv(v, k, obj) } else { yield({ k: k, v: v, obj: obj, parent: parent, parentKey: parentKey }) }
    }
}
kv.find = (target, fn, offset=0) => {
    let i=0;
    for(var next of kv(target)) {
        if(fn(next) && i==offset) {
            return next;
        }
        i++;
    }
}

module.exports = kv;