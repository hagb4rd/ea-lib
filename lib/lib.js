var lib = exports;
var util = require('util');
var EventEmitter = require("events").EventEmitter;
var fs = require("fs");
var path = require("path");
var ini = exports.ini = require("ini");
var json = exports.json = require("ea-json");
var iChing = exports.iChing = require("i-ching");
iChing.oracle = require("./iching").ask;
iChing.help = require("./iching").help;
//var extend = exports.extend = require("extend");



var emoji = exports.emoji = require("./emoji.json");
var logic = exports.logic = require("./logic");
var math = exports.math = require("./math");
var Gen = exports.Gen = require("./Gen");
var board = exports.board = require("./board");
var Stats = exports.Stats = require("./stats");
var string = exports.string = require("./string");
var efs = exports.efs=require("./efs");
var list = exports.list = require("./list");
var Vector2D = exports.Vector2D = require("./vector2D");
var EventTarget = exports.EventTarget = require("./eventtarget")

//Promise.defer 

//helpers
var applyMixins = exports.applyMixins = function(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

var {abs,min, max,random,floor,ceil,sin,cos,pow} = Math;

var defer = exports.defer = Promise.defer = () => { var t={}; t.p = new Promise((resolve, reject)=>{t.resolve=resolve; t.reject=reject}); t.p.resolve=t.resolve; t.p.reject=t.reject; return t.p };

var sleep = exports.sleep = (time,x) => { 
    time=time||1000; 
    var slp=()=>new Promise(resolve=>setTimeout(()=>resolve(true),time)); if(typeof(x)!="undefined") { return slp().then(()=>x) } else { return slp }
};
    

var xorString = exports.xorString = s => [...String(s)].reduce((prev, next) => prev ^= next.charCodeAt(0), 0xFF);

var srand = exports.srand = (opts) => {
    opts = opts || {};
    var _a = opts.min || 0,
        _b = opts.max || 1,
        cb = opts.cb || (x => Math.floor(x));
    var seed = xorString(opts.seed || (new Date()));
    const X = 9301,
        A = 49297,
        M = 233280;
    return (a, b) => (a = a || _a, b = b || _b, seed = (seed * X + A) % M, cb(min(a, b) + (seed / M) * (max(a, b)+1 - min(a, b))))
};
srand.help = `var rnd = lib.srand({seed:666,min:1,max:6}); var K=lib.range(1,10000).map(x=>rnd()); lib.Stats.count(K)`;
//var srand = (strseed, {min:defaultMin, max:defaultMax, callback}) => { defaultMin = defaultMin || 0; defaultMax = defaultMax || 1; callback = callback || (x=>x); var str = String(strseed||(new Date())).split(""); var seed = 0xFF, multiplicate = 9301, add = 49297, modulo = 233280; for (var i = 0; i < str.length; i++) seed ^= str[i].charCodeAt(0); return (a, b) => { a = a || 1;  b = b || 0;if(a==b) { if(a==0) { return 0; }; }; var max = Math.max([a,b]); var min = Math.min([a,b]); seed = (seed * multiplicate + add) % modulo; return callback(min + (seed / modulo) * (max - min)); } };
var round = exports.round = (number, precision) => {
    precision = precision || 0;
    var factor = 10 ** precision;
    return Math.round(parseFloat(number) * factor) / factor;
};
var rand = exports.rand = function rand(a, b) {
    if (typeof (b) == "undefined") {
        a--
    };
    b = b || 0;
    return floor(random() * (max(a, b)+1 - min(a, b))) + min(a, b)
};

var base=exports.base=(B)=>(...dx)=>{var arr=dx.map((v,i)=>[`${v}*(${B}^${(dx.length-1-i)})`, v*(2**(dx.length-1-i))]); console.log(` ${arr.map(x=>x[0]).join(" + ")} = `); return arr.map(x=>x[1]).reduce((a,b)=>a+b,0)}; 
base.help = ` base(2)(1,0,0,1) -> `;

var cmp = exports.cmp = function cmp(a, b) {
    return a - b;
};
cmp.locale = (a, b) => String(a).localeCompare(String(b));

var range = exports.range = (a, b, step) => {
    //if only 1 paramter passsed, then a is the number of elements
    if (typeof (b) == "undefined") {
        a = a || 1;
        b = 0;
    } else {
        a = a || 0;
        b = b || 0;
    }
    step = step || 1;
    var xfactor = 1000;
    var start = min(a, b) * xfactor;
    var end = max(a, b) * xfactor;
    step *= xfactor;
    var len = abs(start - end) / step;
    var r = [];
    for (var i = 0; i <= len; i++) {
        r.push((start + i * step) / xfactor);
    }
    return r;
};
// for (var r = []; r.length <= abs(b-a); r.push(min(a, b)+r.length*abs(step||1))) return r; };
var shuffle = exports.shuffle = function shuffle(o) {for(var j,x,i=o.length;i;j=Math.floor(Math.random()*i),x=o[--i],o[i]=o[j],o[j]=x);return o;};
var map = exports.map = function map(arr, f) {
    arr = Array.from(arr);
    var xs = new Array(arr.length);
    for (var i = arr.length; i-- > 0;) xs[i] = f(arr[i]);
    return xs;
};

var objectify = exports.objectify = (keyCreator) => { keyCreator=keyCreator||((elem,index)=>index); var i=0; return (prev,next)=>((prev[keyCreator(next,i++)]=next,next),{}) };

var zip=cartesian=exports.zip=exports.cartesian=(...N)=>N.reduce((A,B)=>[].concat.apply([],A.map(a=>B.map(b=>[a,b])))).map(n=>[].concat.apply([],n))
zip.help=`var ABC=["A","B","C"], DEC=[1,2,3]; zip(ABC,DEC); // [['A',1],['A',2],['A',3],['B',1],['B',2],['B',3],['C',1],['C',2],['C',3]]`;


var modulo = exports.modulo = (a, n) => ((a % n) + n) % n;

var ns = exports.ns = (literal, val, target) => { target=target||{}; if(typeof(val)=="undefined") val={}; var last; var path=literal.split('.'); var final=path.pop(); path.reduce((prev, next) => (last = prev[next] = {}, prev[next] ), target);  last[final] = val; return target; };
ns.help = `ns('net.irc.kamuela','whoop whoop') --> { net: { irc: { kamuela: 'whoop whoop' } } } // namespace `

var compose = exports.compose = (f) => x => f.reduce((prev,nextFn)=>nextFn(prev), x);
compose.help = `n> var compose=fs=>x=>fs.reduce((prev,nextFn)=>nextFn(prev),x), inc=()=>x=>++x, pow=(n=0)=>x=>x**n, arr=[0,1,2,3,4], f=inc(), g=pow(2); [arr.map(f).map(g), arr.map(compose([f,g]))] // ~> arr.map(x=>g(f(x)))`


//var elementOf = exports.elementOf = (iterable,equals=((a,b)=>a==b)) => x => [...iterable].some(e=>equals(e,x));



var elemOf=exports.elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x));
var uniq=exports.uniq=(iterable,elementOf)=>{ elementOf=elementOf||elemOf; return [...iterable].reduce((result, next)=>{ if(!elemOf(result)(next)) result.push(next); return result; },[]); };


//var uniq = exports.uniq = (arr,equals) => { equals=equals||((a,b)=>a==b); var stack=[]; arr.forEach(entry=>{ if(!stack.some(setItem=>equals(setItem,entry))) { stack.push(entry); }}); return stack; };  //uniq(array,equals); equals(a,b) equality predicate function | default: ((a,b) => a==b)
//uniq.help = `uniq = (arr,equals) => { equals=equals||((a,b)=>a==b); var stack=[]; arr.forEach(entry=>{ if(!stack.some(setItem=>equals(setItem,entry))) { stack.push(entry); }}); return stack; };  //uniq(array,equals); equals(a,b) equality predicate function | default: ((a,b) => a==b)`;


var or=exports.or=(filters)=>x=>[...filters].some(filter=>filter(x));
var and=exports.and=(filters)=>x=>[...filters].every(filter=>filter(x));

var intersect=exports.intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)]));
intersect.help=`n> var or=(filters)=>x=>[...filters].some(filter=>filter(x)), and=(filters)=>x=>[...filters].every(filter=>filter(x)), elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x)), uniq=(iterable,elementOf)=>{ elementOf=elementOf||elemOf; return [...iterable].reduce((result, next)=>{ if(!elemOf(result)(next)) result.push(next); return result; },[]); }, intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)])); intersect([2,3,5,7],[1,2,3])`


var groupBy=exports.groupBy=function(fn){ return Array.from(new Set(this.map(fn))).reduce((obj,next)=>(obj[next]=this.filter(x=>fn(x)==next),obj),{}) };
groupBy.help=`n> var firstLetter=x=>x.slice(0,1); function(fn){ return Array.from(new Set(this.map(fn))).reduce((obj,next)=>(obj[next]=this.filter(x=>fn(x)==next),obj),{}) };  groupBy.call(["watermelon","banana"],firstLetter); `

/*

// INTERSECTION Based on high order equality predicate function
// ----
n> var or=(filters)=>x=>[...filters].some(filter=>filter(x)), and=(filters)=>x=>[...filters].every(filter=>filter(x)),  elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x)), uniq=(iterable,elementOf)=>{ elementOf=elementOf||elemOf; return [...iterable].reduce((result, next)=>{ if(!elemOf(result)(next)) result.push(next); return result; },[]); }, intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)])); intersect([2,3,5,7],[1,2,3])

/* */





// globals (NOT RECOMMENDED)
// ---------
var setGlobals = exports.setGlobals = () => {
    //Array
    Array.prototype.swap = function(posA,posB) { if(!this.length) throw new Error("No elements n Array");  if([posA,posB].some(pos=>pos<0||pos>=this.length)||posA==posB) throw new Error("spap(a,b): a & b must be unique keys in Array."); var a=this[posA],b=this[posB]; this[posA]=b; this[posB]=a; return this; }
    //Function
    Function.prototype.toJSON =  function(){ return this.toString()};
}
