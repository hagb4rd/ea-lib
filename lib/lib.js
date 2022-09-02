var lib = exports;
var util = require('util');
var EventEmitter = require("events").EventEmitter;
var fs = require("fs");
var path = require("path");
var url = require("url");
var querystring = require("querystring");
var ini = require("ini");
var beautify = require("js-beautify").js;
var json = exports.json = require("ea-json");

var queue = exports.queue = require('concurrent-task-queue');
//var csv = exports.csv = require('ea-csv');

//var es = exports.es = require('event-stream');
var readEnd = exports.readEnd = require('./read-end.js');

//var iChing = exports.iChing = require("i-ching");
//iChing.oracle = require("./iching").ask;
//iChing.help = require("./iching").help;
//var extend = exports.extend = require("extend");

//var str = exports.str = require('./strings');
var UUID = exports.UUID = require('./uuid');
var rand = exports.rand = require('./random');
var emoji = exports.emoji = require("./emoji.json");
var logic = exports.logic = require("./logic");
var math = exports.math = require("./math");
var Gen = exports.Gen = require("./Gen");
var board = exports.board = require("./board");
var Stats = exports.Stats = require("./stats");
//var string = exports.string = require("./string");
var bezier = exports.bezier = require('./bezier')
var kv = exports.kv = require('./kv');
//var writer = exports.writer = require('./writer');
var view = exports.view = require('./view');
var prettify=exports.prettify=(s)=>beautify(s,{ indent_size: 2, space_in_empty_paren: true });

var list = exports.list = require("./list");
var List = exports.List = require("./array");
var Vector = exports.Vector = require("./vector").Vector;
var Matrix = exports.Matrix = require("./vector").Matrix;
var v = exports.v = require("./vector").v;
var Vector2D = exports.Vector2D = require("./vector2D");
var EventTarget = exports.EventTarget = require("./eventtarget");
exports.Buffer = Buffer;

//Promise.defer 
var assign = exports.assign = (obj,[k,v])=>(obj[k]=v,obj); 
var proto = exports.proto = (target, ...objects) => {
    var emitter = new EventTarget(); 
    Object.defineProperties(emitter,Object.getOwnPropertyDescriptors(target))
    var p = new Proxy(emitter, { 
        get(src, key) {
            if(emitter[key]) {
                if(typeof(emitter[key])=='function' && emitter[key].bind) {
                    return emitter[key].bind(emitter);
                } else {
                    return emitter[key];
                }
            }
            //objects.push(require('./eventtarget').prototype);
            var objectsIndex=objects.length;
            objects.reverse();
            while(objectsIndex--) {
                var object=objects[objectsIndex];
                if(key in object) {
                    if(typeof(object[key])=='function' && object[key].bind) {
                        return object[key].bind(emitter);
                    } else {
                        return object[key];
                    }
                }
            } 
        },
        set(src,key,value){
            src[key] = typeof(value)=='object'?proto(value):value;
            src.emit('set',{ target: src, key:key, value:value});
        }
    });
    return p;
}
assign.help = `[...(new URL(location.href)).searchParams.entries()].reduce(assign,{})`
//helpers
var mixin = exports.mixin = function(baseCtors,fn) {
    fn=fn||function() {};
    var assignTo = (fn.prototype?fn.prototype:fn);

    [...baseCtors].forEach(baseCtor => {
        if(baseCtor.prototype && baseCtor.interface) {
            if(assignTo[baseCtor.interface]) {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                    var descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
                    Object.defineProperty(assignTo, name, descriptor);
                });
                baseCtor.call(assignTo);
            }
        } else if(baseCtor.prototype) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                var descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
                Object.defineProperty(assignTo, name, descriptor);
            });
            baseCtor.call(assignTo);
        } else if(typeof(baseCtor)=="object") {
            Object.getOwnPropertyNames(baseCtor).forEach(name => {
                var descriptor = Object.getOwnPropertyDescriptor(baseCtor, name);
                Object.defineProperty(assignTo, name, descriptor);
            });
        };
    });
    return fn;
}


var {abs,min, max,random,floor,ceil,sin,cos,pow} = Math;

var defer = exports.defer = Promise.defer = () => { var t={}; t.p = new Promise((resolve, reject)=>{t.resolve=resolve; t.reject=reject}); t.p.resolve=t.resolve; t.p.reject=t.reject; return t.p };

var sleep = exports.sleep = (time,x) => { 
    time=time||1000; 
    var slp=(dx)=>new Promise(resolve=>setTimeout(()=>resolve(dx),time)); if(typeof(x)!="undefined") { return slp() } else { return slp }
};
    

var xorString = exports.xorString = s => [...String(s)].reduce((prev, next) => prev ^= next.charCodeAt(0), 0xFF);

var seed = exports.seed = require('./seed');
var rand = exports.rand = require('./random');
//var srand = (strseed, {min:defaultMin, max:defaultMax, callback}) => { defaultMin = defaultMin || 0; defaultMax = defaultMax || 1; callback = callback || (x=>x); var str = String(strseed||(new Date())).split(""); var seed = 0xFF, multiplicate = 9301, add = 49297, modulo = 233280; for (var i = 0; i < str.length; i++) seed ^= str[i].charCodeAt(0); return (a, b) => { a = a || 1;  b = b || 0;if(a==b) { if(a==0) { return 0; }; }; var max = Math.max([a,b]); var min = Math.min([a,b]); seed = (seed * multiplicate + add) % modulo; return callback(min + (seed / modulo) * (max - min)); } };
var round = exports.round = (number, precision) => { precision = precision || 0; var factor = 10 ** precision; return Math.round(parseFloat(number) * factor) / factor; };
/*
var rand = exports.rand = (a, b, cb=(x)=>Math.floor(x)) => () => {
    
    var min=Math.min(a,b),max=Math.max(a,b),diff=max-min;

    return cb((rand.gen.random()*diff)+min)

};
rand.gen = Math;
rand.help = ` \\ var lib=require('ea-lib'); Object.assign(global,lib,lib.lib); rand.gen=seed('hello world'); var w4=rand(1,4); var mystiq=()=>[rand(1,10), rand(77,88), rand(1000,2000), rand(10,20)][w4()](); range(1,10).map(mystiq); `
/*  */

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
        b = 1;
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
        r.push((start + abs(i * step)) / xfactor);
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

var zip=exports.zip=(...xs)=>xs[0].map((_,i)=>xs.map(x=>x[i]));

var cartesian=exports.cartesian=(...N)=>N.reduce((A,B)=>[].concat.apply([],A.map(a=>B.map(b=>[a,b])))).map(n=>[].concat.apply([],n))
cartesian.help=`var ABC=["A","B","C"], DEC=[1,2,3]; zip(ABC,DEC); // [['A',1],['A',2],['A',3],['B',1],['B',2],['B',3],['C',1],['C',2],['C',3]]`;


var modulo = exports.modulo = (a, n) => ((a % n) + n) % n;

var ns = exports.ns = (literal, val, target) => { target=target||{}; if(typeof(val)=="undefined") val={}; var last; var path=literal.split('.'); var final=path.pop(); path.reduce((prev, next) => (last = prev[next] = {}, prev[next] ), target);  last[final] = val; return target; };
ns.help = `ns('net.irc.kamuela','whoop whoop') --> { net: { irc: { kamuela: 'whoop whoop' } } } // namespace `

var compose = exports.compose=function(...fs){ return x=>fs.reduce((x,f)=>f(x),x); };
compose.help = ` var compose=function(...fs){ return x=>fs.reduce((x,f)=>f(x),x); }, add=(n=0)=>x=>x+n, mul=(n=1)=>x=>x*n, pow=(n=0)=>x=>x**n, arr=[0,1,2,3,4], f=add(1), g=pow(2); [arr.map(f).map(g), arr.map(compose(f,g))] // ~> arr.map(x=>g(f(x))) `


//var elementOf = exports.elementOf = (iterable,equals=((a,b)=>a==b)) => x => [...iterable].some(e=>equals(e,x));



var elemOf=exports.elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x));
var uniq=exports.uniq=(I,equals=((a,b)=>a===b))=>[...I].reduce((A, x)=>((!A.some(e=>equals(e,x)) && A.push(x)),A),[]);


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
n>or=(filters)=>x=>[...filters].some(filter=>filter(x)),and=(filters)=>x=>[...filters].every(filter=>filter(x)),elemOf=(A,equals=((a,b)=>a===b))=>x=>[...A].some(e=>equals(e,x)),uniq=(iterable,elementOf)=>{elementOf=elementOf||elemOf;return[...iterable].reduce((result, next)=>{ if(!elemOf(result)(next)) result.push(next); return result; },[]); };intersect=(A,B)=>uniq(A.concat(B)).filter(and([elemOf(A),elemOf(B)])); intersect([2,3,5,7],[1,2,3])

/* 
n>protochain=function*(e){for(;null!=e;e=Object.getPrototypeOf(e))yield e;}; entries=(o)=>[...protochain(o)].flatMap(o=>Object.getOwnPropertyNames(o).map(propertyName=>[propertyName, Object.getOwnPropertyDescriptor(o,propertyName)])); assign=(obj,[k,v])=>(typeof(obj.configurable=='bool')?Object.defineProperty(obj,k,v):obj[k]=v,obj); entries({x:23}).reduce(assign, {blah:199})
*/

var protochain=exports.protochain=function*(obj) { while(obj!=null) { yield obj; obj=Object.getPrototypeOf(obj) }};
var describe=exports.describe=(obj)=>[...protochain(obj)].map(o=>[o,Object.getOwnPropertyNames(o).map(k=>[k, Object.getOwnPropertyDescriptor(o,k)])]); 


//urlcreate 
var stringMap=exports.stringMap=s=>{ var u=(url)=>{ var rx=/\[(\d+):(\d+)\]/; var m=url.match(rx); var pad=m[1].length,from=Number(m[1]),to=Number(m[2]); return Array.from({length:to-from+1},(e,i)=>i+from).map(x=>url.replace(m[0],String(x).padStart(pad,'0'))); }; var rxOuter=/\[\d+:\d+\]/; var arr=[]; var m; while(m=s.match(rxOuter)) { s=s.replace(m[0],'{{'+arr.length+'}}'); arr.push(u(m[0]));}; return cartesian.apply(null,arr).map(mx=>Object.entries(mx).reduce((prev,[k,v])=>prev.replace('{{'+k+'}}',v),s)); };
stringMap.help=`stringMap("http://elle-fanning.net/images/albums/candids/[2009:2012]/019-shermanoaks/candids_inshermanoaks[001:020].jpg");// range-map-combinator: square block [from:to] with padStart 0s as specified`;

// globals (NOT RECOMMENDED)
// ---------
var setGlobals = exports.setGlobals = () => {
    //Array
    Array.prototype.swap = function(posA,posB) { if(!this.length) throw new Error("No elements n Array");  if([posA,posB].some(pos=>pos<0||pos>=this.length)||posA==posB) throw new Error("spap(a,b): a & b must be unique keys in Array."); var a=this[posA],b=this[posB]; this[posA]=b; this[posB]=a; return this; }
    //Function
    Function.prototype.toJSON =  function(){ return this.toString()};
}
