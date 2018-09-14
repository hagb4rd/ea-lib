let LOG='LOG';
var self=global; self.stack=[]; self[LOG] = [];
//var writer=(opts)=>(s)=>{ opts=typeof(opts)=='number'?({depth:opts,colors:true,showHidden:true}):opts;  var opts=Object.assign({},self.repl.writer.options,opts); console.log(opts); self.stack.unshift(s); var txt=typeof(s)=="function"?hh.highlight(s.toString()):util.inspect(s,opts); self[LOG].unshift(txt); var r=process.stdout.write(txt); return s; };


var writer = (function(opts) { 
    opts=opts||writer.options;
    var write=(s,opts)=>{
        var opts = Object.assign({},write.options,opts);

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
writer.options = {depth:0, showHidden:false, colors: true};

var $=global.$=writer({depth:null, showHidden:false});
$[0]=writer({depth:0, showHidden:true});
$[1]=writer({depth:1, showHidden:true});
$[2]=writer({depth:2, showHidden:true});
$[3]=writer({depth:3, showHidden:true});
$[4]=writer({depth:4, showHidden:true});
$[5]=writer({depth:5, showHidden:true});
$[6]=writer({depth:6, showHidden:true});

self.console=console;  
var log=function(s){ console.log(s); self.stack.unshift(s);  return s; }; Object.assign(log,{ backup(){self.repl.writer.optionsBackup=Object.assign({},self.replwriter.options)}, restore(){self.repl.writer.options=Object.assign({},self.repl.writer.optionsBackup)}, depth(v){ self.repl.writer.options.depth=v; return self.repl.writer.options }})

var lib = require('./index');
Object.assign($,Object,String,lib,lib.lib);

var fs = $.fs = require('fs');
var path = $.path = require('path');
var querystring = $.querystring = require('querystring');
var url = $.url = require('url');
var EventEmitter = $.EventEmitter = require('events').EventEmitter;
var util = $.util = require('util');
var cp = $.cp=require('child_process');
var hh = $.hh=require('cli-highlight');
var fetch = $.fetch=require('node-fetch');
var homedir = $.homedir=process.env['DATA']||process.env['HOME'] || process.env['USERPROFILE']||process.cwd();
var db = $.db=new require('dirty')(path.resolve(homedir, './dirtydb'));
var opn = $.opn=require('opn');
var {JSDOM}=require('jsdom');
var parse = $.parse=(s)=>(fn)=>{ var page=new JSDOM(s); if(fn.bind) { fn.bind(page.window); }; return fn(page.window.document,page.window,page); };
var file=$.file=(path)=>fs.readFileSync(path.resolve(process.cwd(),path));
var vm=$.vm=require('vm');
var REPL=require('repl');

var repl=REPL.start({
    useGlobal: true,
    eval:   async(cmd, context, filename, callback) => {
        
        //var cx=vm.createContext(context);
        var script=new vm.Script(cmd);
        var result;
        try { 
            var result = await script.runInContext(vm.createContext(global), {timeout: 10*1000});
            
        } catch(e) {
            callback(e);
        }
        callback(null, result);
    },
    writer: $[0]
});
repl.on('reset', (context)=>{ console.log("RESET", context); Object.assign(context, $); });


var S=$.S = class extends require('stream').Transform {constructor(opts){super(opts);this.buffer='';} 
static create(){return new S()} 
_transform(s,encoding,callback){ var str=[...Buffer.from(s)].map(c=>c.toString(16)).map(data=>"0".repeat(data.length%2)+data).join("").match(/.{2}/g).join(' '); this.buffer+=(this.buffer.length?"":" ")+str; callback(null,str); }}; var s=S.create(); s.on('data', console.log); s.write('hello');

$.S = class extends require('stream').Duplex { constructor(opts){super(opts);this.buffer=[];} static create(){ return new S() } _read(size) { this.push(Buffer.from(this.buffer.splice(0,size).join(''))) } _write(s,encoding,callback){ this.buffer=this.buffer||[]; var s='thomas: '+ require("util").inspect(s,{depth:1,showHidden:true,colors:true}); s.split('').forEach(c=>this.buffer.push(c)); callback() }}; S.create()