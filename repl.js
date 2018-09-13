let LOG='LOG';
var self=global; self.stack=[]; self[LOG] = [];
//var writer=(opts)=>(s)=>{ opts=typeof(opts)=='number'?({depth:opts,colors:true,showHidden:true}):opts;  var opts=Object.assign({},self.repl.writer.options,opts); console.log(opts); self.stack.unshift(s); var txt=typeof(s)=="function"?hh.highlight(s.toString()):util.inspect(s,opts); self[LOG].unshift(txt); var r=process.stdout.write(txt); return s; };


var writer = (function(opts) { 
    opts=opts||{};
    var writer=(s)=>{
        opts = Object.assign({},({depth:2,colors:true}),opts);

        var txt = typeof(s)=="function"
                     ? hh.highlight(s.toString())
                     : util.inspect(s,opts); 
        //self[LOG].unshift(txt); 
        //var r=process.stdout.write(txt);
        //repl.displayPrompt();
        return txt;
    };
   return writer;
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
var db = $.db=require('dirty')(path.resolve(homedir, './dirtydb'));
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