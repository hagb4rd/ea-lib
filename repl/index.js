#!/usr/bin/env node

let LOG = 'LOG';
var self = global; self.stack = []; self[LOG] = [];
//var writer=(opts)=>(s)=>{ opts=typeof(opts)=='number'?({depth:opts,colors:true,showHidden:true}):opts;  var opts=Object.assign({},self.repl.writer.options,opts); console.log(opts); self.stack.unshift(s); var txt=typeof(s)=="function"?hh.highlight(s.toString()):util.inspect(s,opts); self[LOG].unshift(txt); var r=process.stdout.write(txt); return s; };


var $ = require('../index');
var writer = $.writer = require('../lib/writer');
$.$ = $;
$.$0 = $.writer({ depth: 0, showHidden: true });
$.$1 = $.writer({ depth: 1, showHidden: false });
$.$2 = $.writer({ depth: 2, showHidden: false });
$.$3 = $.writer({ depth: 3, showHidden: false });
$.$4 = $.writer({ depth: 4, showHidden: false });
$.$5 = $.writer({ depth: 5, showHidden: false });
$.$6 = $.writer({ depth: 6, showHidden: false });

//self.console=console;  
var log = function (s) { console.log(s); self.stack.unshift(s); return s; }; Object.assign(log, { backup() { self.repl.writer.optionsBackup = Object.assign({}, self.replwriter.options) }, restore() { self.repl.writer.options = Object.assign({}, self.repl.writer.optionsBackup) }, depth(v) { self.repl.writer.options.depth = v; return self.repl.writer.options } })


var fs = $.fs = require('fs');
var path = $.path = require('path');
var querystring = $.querystring = require('querystring');
var url = $.url = require('url');
var EventEmitter = $.EventEmitter = require('events').EventEmitter;
var util = $.util = require('util');
var cp = $.cp = require('child_process');
var hh = $.hh = require('cli-highlight');
var fetch = $.fetch = require('node-fetch');
var homedir = $.homedir = process.env['DATA'] || process.env['HOME'] || process.env['USERPROFILE'] || path.resolve(dir__, '../');
var db = $.db = new require('dirty')(path.resolve(homedir, './dirtydb'));
var opn = $.opn = require('opn');
var { JSDOM } = require('jsdom');
$.JSDOM = JSDOM;
var parseHTML = $.parseHTML = (s) => (fn) => { var page = new JSDOM(s); if (fn.bind) { fn.bind(page.window); }; return fn(page.window.document, page.window, page); };
var file = $.file = (filePath, utf8 = true) => fs.readFileSync(path.resolve(process.cwd(), filePath), utf8
  ? { encoding: 'utf8' }
  : null);
var vm = $.vm = require('vm');
var REPL = require('repl');
var LogSqlite = require('ea-log');
var logs = $.logs = new LogSqlite(path.resolve(homedir, './ea-lib.repl.sqlite'));
var argv = $.argv = require('minimist');
var person = require('ea-names');
var { Person, females, males } = person;
var instant = $.instant = require('../lib/instant');




var cx = vm.createContext(Object.assign(Object.create(global), $));
cx.cx = cx;
var writer = require('../lib/writer')({ depth: 1, showHidden: false })

var evil = async (cmd, context, filename, callback) => {

  context = context || cx;
  callback = callback || ((err, ...s) => console.log(writer(...s)));

  if(typeof(cmd)=='string' && cmd.length)
    logs.write(cmd, 'repl');
  /*
    if (!repl.history)
    repl.history.unshift(cmd.trimRight().replace(/\r\n$/g, ''));
  /* */
  var script = new vm.Script(cmd);

  var result;
  try {
    var result = await script.runInContext(cx, { timeout: 10 * 1000 });
    callback(null, result);
  } catch (e) {
    callback(e);
  }
  

};
var loadHistory=()=>logs.find(s = "")
    .then(l => {
      //var lines=repl.history.slice();
      var temp = l.map(x => x.text.trimRight().replace(/\r\n$/g, '')).reverse();
      return temp;
    });
var repl = module.exports = cx.repl = REPL.start({
  useGlobal: true,
  eval: evil,
  writer: writer
});

repl.defineCommand('docs', { help: '.docs <npm-module> -- opens README.md of specified package in browser', action(s) { var r = cp.exec(`npm docs ${s}`); this.displayPrompt(); } });
repl.defineCommand('s', { help: '.s <keyword> <query> -- opens browser search engine specified by keyword using query - enter no params to list search engines.', action(s = '') { console.log(instant(s)); this.displayPrompt(); } });
repl.defineCommand('history', {
  help: '.history <query*> -- prints repl history, filtered by query (fts5). example: .history ((a OR b) AND c)',
  action(s = '') {
    logs.find(s = "").then(l => {
      console.log(l.map(x => x.text.trimRight().replace(/\r\n$/g, '')).join('\r\n'));
      this.displayPrompt();
    })
  }
})
//repl.history = history;
//repl.historySize = history.length;
repl.eval=evil;
loadHistory()
  .then(history=>{
    repl.history=history;
  })

//repl.on('reset', (context)=>{ console.log("RESET", context); Object.assign(context, $); });
