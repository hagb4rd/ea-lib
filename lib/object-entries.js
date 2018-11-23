var query = ($) => {
  var keys = [];
  var values = [];
  var base = typeof ($) == 'function' 
   ? $ 
   : ({});
  Object.defineProperty(base, 'getEntries', {
    value: () => {
      var entries = [];
      for (var k in $) {
        var v = $[k];
        entries.push([k,v]);
      };
      entries.sort(([aKey,aVal], [bKey,bVal]) => String(aKey).localeCompare(String(bKey))); 
      return entries;
    },
    enumerable: false
  }); 
  base.entries().reduce((obj, [k,v]) => (
    obj[k] = typeof (v) == 'function' && v.bind 
                                          ? v.bind(obj)  
                                          : v
    , obj), base); 
  Object.defineProperty(base, 'fn', {
    value: () => base.getEntries().filter(([k,v]) => typeof (v) == 'function').map(f => f.bind(base)),
    enumerable: false
  }); 
  Object.defineProperty(base, 'objects', {
    value: () => base.getEntries().filter(([k,v]) => typeof (v) != 'function'), enumerable: false
  }); 
  Object.defineProperty(base, 'keys', {
    value: () => base.getEntries().map(([k,v]) => k), enumerable: false
  });
  Object.defineProperty(base, 'values', {
    value: () => base.getEntries().map(([k,v]) => v), enumerable: false
  });
  Object.defineProperty(base, 'toString', {
    value: () => [
     base.fn().map(([k,v]) => k + '()').join(', '),
     base.objects().map(([k,v]) => k).join(', ')
    ].join(', '),
    enumerable: false
  });
  return base;
};