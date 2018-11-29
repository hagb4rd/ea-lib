
var { zip, assign, es } = require('./lib');



var esc = (s) => s.replace(/\\/g, '\\\\').replace(/\t/g, '\\t')
var unesc = (s) => s.replace(/\\\\/g, '\\').replace(/\\t/g, '\t')

var parse = (s) => s.split(/\t/).map(unesc)
var stringify = (s) => { var row = Array.isArray(s) ? s : Object.values(s); return [...row].map(esc).join('\t') }



var read = exports.read = (tsv = "", keys = false) => {
  var count = 0;
  var keys;
  var stream = (tsv && tsv.pipe) ? tsv : es.readArray(tsv.split(/(\r?\n)/));


  stream
    .pipe(es.split(/(\r?\n)/))
    .pipe(es.map(function (data, callback) {
      //transform data
      try {
        var parsed = parse(data);
        //when on firstline
        if (!count++) {
          if (keys === true) {
            keys = parsed;
          }
        }
        //if keys known reduce Array to Object
        if (Array.isArray(keys)) {
          var entries = zip(keys, parsed);
          parsed = entries.reduce(assign, {});
        }

      } catch (e) {
        callback(e)
      }
      callback(null, parsed)
    }))
  var write = exports.write = () => es.map(function (data, callback) {
    //transform data
    try {
      var stringify = parse(data);
    } catch (e) {
      callback(e)
    }
    callback(null, parsed)
  })
}