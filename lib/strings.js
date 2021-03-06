var util = require('util');

//log to terminal using util.inspect
var stripAnsi = require('strip-ansi');
var hh=require('cli-highlight')



str = {};
str.stripAnsi = stripAnsi;
str.ansi2ircMap = {"1":"grey", "22": "grey","30": "black","31": "green","32": "yellow","33": "red","34": "blue","35": "purple","36": "cyan","37": "silver","39": "silver"};
str.ansi2irc = (text,colormap) => {
	var colormap=colormap||str.ansi2ircMap;
	var colorify = s => { 
		var match = s.match(/\[(\d{1,2})m(.*)/); 
		if(!match) { 
			return str.colors[str.ansi2irc.lastUsedColor](s)
			//return s 
		} else { 
			s=match[2]; 
			var c=colormap[match[1]];
			if(!c) {
				return '<font class="ansicolor'+ match[1] +'">'+s+'</font>';
			} else {
				str.ansi2irc.lastUsedColor = c;
				return str.colors[c](s); 
			}
		} 
	}
	return text.split("\x1b").map(chunk=>colorify(chunk)).join("");
};
str.ansi2irc.lastUsedColor = "silver";  


// [255, 0] -> "%FF%00"
function b(values) {
	var out = "";
	for (var i = 0; i < values.length; i++) {
		var hex = values[i].toString(16);
		if (hex.length == 1) hex = "0" + hex;
		out += "%" + hex;
	}
	return out.toUpperCase();
}

// Character to ASCII value, or string to array of ASCII values.
var chr = exports.chr = function chr(str) {
	if (str.length == 1) {
		return str.charCodeAt(0);
	} else {
		var out = [];
		for (var i = 0; i < str.length; i++) {
			out.push(chr(str[i]));
		}
		return out;
	}
}




str.format = function format(str, arr) {
	var i = -1;

	function callback(exp, p0, p1, p2, p3, p4) {
		if (exp == '%%') return '%';
		if (arr[++i] === undefined) return undefined;
		var exp = p2 ? parseInt(p2.substr(1)) : undefined;
		var base = p3 ? parseInt(p3.substr(1)) : undefined;
		var val;
		switch (p4) {
			case 's':
				val = arr[i];
				break;
			case 'c':
				val = arr[i][0];
				break;
			case 'f':
				val = parseFloat(arr[i]).toFixed(exp);
				break;
			case 'p':
				val = parseFloat(arr[i]).toPrecision(exp);
				break;
			case 'e':
				val = parseFloat(arr[i]).toExponential(exp);
				break;
			case 'x':
				val = parseInt(arr[i]).toString(base ? base : 16);
				break;
			case 'd':
				val = parseFloat(parseInt(arr[i], base ? base : 10).toPrecision(exp)).toFixed(0);
				break;
		}
		val = typeof(val) == 'object' ? JSON.stringify(val) : val.toString(base);
		var sz = parseInt(p1); /* padding size */
		var ch = p1 && p1[0] == '0' ? '0' : ' '; /* isnull? */
		while (val.length < sz) val = p0 !== undefined ? val + ch : ch + val; /* isminus? */
		return val;
	}
	var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd])/g;
	return str.replace(regex, callback);
};
str.format.help = "str.format() | http://draft.sx/2418072c1851fe5b271a2646b4f1f1e9";

String.prototype.format = function format() {
	return str.format(this, Array.prototype.slice.call(arguments));
}

str.repeat = function repeat(_count) {
	var _str = this;
	if (_str === undefined)
		throw ({
			name: "MissingArgumentException",
			message: "usage: request(str, [count])"
		});
	var _count = _count || 1;
	var count = Math.abs(parseInt(_count));
	var text = "";
	for (var i = count; i-- > 0;)
		text += _str;
	return text;
}

//Split a string into an array of chunks with a defined max. size
str.chunkify = function chunkify(str, size) {
	//A string to create chunks from
	str = str.toString();
	//Max. size of a chunk in characters
	size = parseInt(size);
	return str.match(RegExp(".{1," + size + "}", "gm"));
}
String.prototype.chunkify = function chunkify(size) {
	return str.chunkify(this, size);
}


str.rot13 = function rot13(s) {
	return s.replace(/[a-zA-Z]/g, function(c) {
		return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
	});
};

//*
String.prototype.rot13 = function rot13() {
	return str.rot13(this);
};
/* */
JSON.beautify = function(obj) {
	var result = "";
	var args = arguments;
	Object.keys(arguments).forEach(function(nextKey, nextIndex) {
		var next = args[nextKey];

		if (typeof(next) !== 'string')
			next = str.dump(next);

		next = beautify(next);

		if ((next.length > 0) && (result.length > 0))
			result += "\n";
		result += next;

	});
	return result;
}


str.shuffle = function() {
	var shuffled = [];
};

str.obj = function(o) {

	var objects = [];
	var functions = [];
	var primitives = [];

	//Object.getOwnPropertyNames(o).sort().forEach(function (prop, index) {
	Object.keys(o).sort().forEach(function(prop, index) {
		switch(typeof(o[prop])) {
			case "object":
				if (Array.isArray(o[prop])) {
					objects.push(prop + "[]");		
				} else {
					objects.push(prop);
				}
				break;
			case "function":
				functions.push(prop + '()');
				break;
			default:
				primitives.push(prop+": "+util.inspect(o[prop]))
		}
	});

	var all = objects.concat(functions, primitives);
	return all.join(", ");
}




str.echo = function() {
	//args
	var args = [].slice.call(arguments);

	//helper function to map args
	function format(o) {

		//result string
		var s = '';

		//typeof next argument
		switch (typeof(o)) {

			case 'undefined':
				s += 'undefined'
				break;

			case 'object':

				/* */
				if (o === null) {
					s += "null";
				} else if (o instanceof Error) {
					s += util.inspect(o.stack);
				} else if (o instanceof Promise) {
					s += "";
				} else if (Array.isArray(o)) {
					s += util.inspect(o);
				} else {
					s += str.obj(o);
				}
				break;

			case 'function':
				if (o.prototype && o.prototype.constructor && o.prototype.constructor.name) {
					//s += "/* [Function " + o.prototype.constructor.name + "] */ ";
				}
				s += beautify(o.toString());
				if (o.help) {
					s += "/* " + o.help + " */";
				} 
				break;

			case 'string':
				s += o;
				//s += ':'+util.inspect(o)
				break;
			default:
				s += util.inspect(o);
				break;
		}
		return s;
	}
	//format each argument
	return args.map(x => format(x)).join(', ') + " ";
}

str.dump = function(obj, wrapstart, wrapend) {
	wrapend = wrapend || "";

	//var result = "(" + typeof(obj) + ") {";
	var result = "";
	var quotation_marks;

	if (typeof(obj) != "object") {
		if (typeof(obj) == "string") {
			//quotation_marks = '';
			quotation_marks = '"';
		} else {
			quotation_marks = '';
		}

		result += quotation_marks + obj + quotation_marks;
	} else if (Array.isArray(obj)) {
		var more = false;
		result += "[ ";
		obj.forEach(function(elem, i) {
			if (more)
				result += ", ";
			result += str.dump(elem);
			more = true;
		});
		result += " ]";


	} else {
		var more = false;
		result += "{ ";
		for (var prop in obj) {
			if (more)
				result += ", "
			result += '"' + prop + '": ' + str.dump(obj[prop]);
			more = true;
		}
		result += " }";
	}

	if (wrapstart) {
		result = beautify(wrapstart + result + wrapend);
	}

	return result;
}

str.hex = function(dec) {
	var hexCode = dec.toString(16);
	if ((hexCode.length % 2) == 1) {
		hexCode = "0" + hexCode;
	}
	return "&#x" + hexCode + ";";
}

str.chr = function(text) {
	var buf = [];
	var chars = text.split('');
	chars.forEach(function(elem, index) {
		var dec = elem.charCodeAt(0);
		var hex = str.hex(dec);
		var buffer = new ArrayBuffer(2);
		var bufview = new Uint16Array(buffer);
		bufview[0] = elem.charCodeAt(0);
		buf.push({
			'char': elem,
			'dec': dec,
			'hex': hex,
			'buffer': buffer
		});
	});
	return buf;
}


str.codePointAt = function(s, position) {
	if (s == null) {
		throw TypeError();
	}
	var string = String(s);
	var size = string.length;
	// `ToInteger`
	var index = position ? Number(position) : 0;
	if (index != index) { // better `isNaN`
		index = 0;
	}
	// Account for out-of-bounds indices:
	if (index < 0 || index >= size) {
		return undefined;
	}
	// Get the first code unit
	var first = string.charCodeAt(index);
	var second;
	if ( // check if it’s the start of a surrogate pair
		first >= 0xD800 && first <= 0xDBFF && // high surrogate
		size > index + 1 // there is a next code unit
	) {
		second = string.charCodeAt(index + 1);
		if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
			// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
		}
	}
	return first;
};


str.fromArrayBuffer = function(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf));
}
str.toArrayBuffer = function(str) {
	var buf = new ArrayBuffer(str.length * 2);
	var bufView = new Uint16Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

var writer = str.writer = (function(opts) { 
    opts=opts||writer.options;
    var write=(s,opts)=>{
        opts = Object.assign({},write.options,opts);

        var txt = typeof(s)=="function"
                     ?  hh.highlight(s.toString())
                     :  typeof(s)=="string"
                        ?   util.inspect(s,opts)
                        : s; 
        //self[LOG].unshift(txt); 
        //var r=process.stdout.write(txt);
        //repl.displayPrompt();
        return txt;
    };
    write.options=Object.assign({},opts);
    return write;
});
writer.options = {depth:0, showHidden:true, colors: true};
str.buffer=(s)=>[...Buffer.from(s)].map(c=>c.toString(16)).map(data=>"0".repeat(data.length%2)+data).join("").match(/.{2}/g).join(' ');
Object.assign(str, hh);

module.exports = str;

 