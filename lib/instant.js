var path=require('path');
var defaultList=require('../dist/instant.json');
var opn=require('opn');

var search = (s='',list) => {
		list=list||defaultList;

    var [key, ...words]=s.split(/\s/);
    if(key) {
        var filter=list.filter(entry=>entry.key.split(/\s/).includes(key));
        if(filter.length) {
            var engine=Object.assign({}, filter[0])
            
            if(words.length) {
                var query=words.map(s=>encodeURIComponent(s)).join('+');
                engine.query=engine.url.replace('%q',query).replace('%s',query);
                try {
                    opn(engine.query);
                } catch(err) {
                    console.log(err);
                }
                //console.log(` ${engine.name}: ${words.join(' ')} => ${engine.query} `)
                return ` ${engine.name}: ${words.join(' ')} => ${engine.query} `;
            } else {
                return engine;
            }
        } else {
            return 'no search engine mapped to key';
        }
    } else {
        return list.map(entry=>`[${entry.key.split(/\s/)[0]}]${entry.name}`).join(', ');
    }
    
}
search.list = defaultList;

module.exports = search;

