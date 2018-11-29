var iChing = require('i-ching');


var helponce = 0;
//var R = iChing.ask('to be or not to be?');

var format=exports.format=(R)=>[[R.hexagram.number,R.hexagram.character,R.hexagram.names.join(', ')].join(" | "),(R.Change?[`change: ${R.change.changingLines}`,`hexagram: ${R.change.to.number} ${R.change.to.character} ${R.change.to.names.join(", ")}`].join(" | "):" no change.")].join(" | ")

var ask=exports.ask=(q)=>format(iChing.ask(q));

var help = exports.help = ` .. http://en.wikipedia.org/wiki/I_Ching `;


//exports.iChing = iChing;