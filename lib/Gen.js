var util = require('util');
var EventEmitter = require("events").EventEmitter;
//exports.story = story;
var lib = require('./lib');


var Gen = function Gen(entries,event) {
    this.event=event||"emit"; 
    this.total=0; 
    this.entries=(Array.isArray(entries)?entries:Object.entries(entries))
        .sort((a,b)=>lib.cmp(b[1],a[1]))
        .map(([key,val],i)=>(
            val=parseInt(val,10),
            [key, {
                name:key,
                rank:i,
                score:val,
                low: (this.total+1),
                high:(this.total+=val)
            }]
        )); 
    }; 
Gen.prototype=new EventEmitter(); 
Gen.prototype.next = function(n) { 
    var nxt=()=>{
        var dice = lib.rand(1,this.total)(); 
        var result = this.entries.map(e=>e[1]).filter(x=>x.low<=dice&&dice<=x.high)[0];
        return result;
    }; 
    if(n) { 
        return Array.from({length:(+n)},(v,k)=>nxt().name);
    } else { 
        return nxt().name 
    }
}
Gen.help = Gen.prototype.help = '/* Weighted Random Generator: */ var {Gen} = require("ea-lib"); var statistics = {tree:12, girl: 23, car: 3}; var rnd = new Gen(statistics); [1,2,3,4,5].map(i=>[i,rnd.next()]);'
Gen.prototype.rnd = Gen.prototype.next;
Gen.prototype.stats = function() { return this.entries.map(e=>[e[1].name,e[1].score]) };
Gen.prototype.toJSON = function() { return JSON.stringify(this.stats()); }

module.exports = Gen;