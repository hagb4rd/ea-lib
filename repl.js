"use strict";
let LOG='LOG';
var self=global; self.stack=[]; self[LOG] = [];
//var writer=(opts)=>(s)=>{ opts=typeof(opts)=='number'?({depth:opts,colors:true,showHidden:true}):opts;  var opts=Object.assign({},self.repl.writer.options,opts); console.log(opts); self.stack.unshift(s); var txt=typeof(s)=="function"?hh.highlight(s.toString()):util.inspect(s,opts); self[LOG].unshift(txt); var r=process.stdout.write(txt); return s; };


var lib=require('../index');
var writer=require('../lib/writer');

var $=Object.assign(
    writer({depth:0, showHiddden:true}), 
    lib, 
    lib.range(0,6).map((v,i)=>writer({depth:v, showHidden:false})));
//$.$=$;
//self.console=console;  
//var log=function(s){ console.log(s); self.stack.unshift(s);  return s; }; 
//Object.assign(log,{ backup(){self.repl.writer.optionsBackup=Object.assign({},self.replwriter.options)}, restore(){self.repl.writer.options=Object.assign({},self.repl.writer.optionsBackup)}, depth(v){ self.repl.writer.options.depth=v; return self.repl.writer.options }})
var fs=$.fs=require('fs');
var path=$.path=require('path');
var querystring=$.querystring = require('querystring');
var url=$.url=require('url');
var EventEmitter=$.EventEmitter = require('events').EventEmitter;
var util=$.util=require('util');
var cp=$.cp=require('child_process');
var hh=$.hh=require('cli-highlight');
var fetch=$.fetch=require('node-fetch');
var writer=$.writer=require('./writer');
var homedir=$.homedir=process.env['DATA']||process.env['HOME']||process.env['USERPROFILE']||process.cwd();
var db=$.db=new require('dirty')(path.resolve(homedir, './dirtydb'));
var opn=$.opn=require('opn');
var {JSDOM}=require('jsdom');
$.JSDOM=JSDOM;
var parseHTML = $.parseHTML=(s)=>(fn)=>{ var page=new JSDOM(s); if(fn.bind) { fn.bind(page.window); }; return fn(page.window.document,page.window,page); };
var file=$.file=(filePath,utf8=true)=>fs.readFileSync(path.resolve(process.cwd(),filePath),utf8
    ? {encoding:'utf8'}
    : null);
var vm=$.vm=require('vm');
var REPL=require('repl');

var cx = vm.createContext({
    ['$']: $
});

var repl=cx.repl=REPL.start({
    useGlobal: true,
    eval:   async(cmd, context, filename, callback) => {
        
        var script=new vm.Script([`"use strict";`,"\r\n",cmd].join(''));
        
        var result;
        try { 
            var result = await script.runInContext(cx, {timeout: repl.timeOut||10*1000});
            
        } catch(e) {
            callback(e);
        }
        callback(null, result);
    },
    writer: $[0]
});
repl.timeOut=10e3;

module.exports = cx;
//repl.on('reset', (context)=>{ console.log("RESET", context); Object.assign(context, $); });