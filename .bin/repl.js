#!/usr/bin/env node
var repl=require('../repl');
var command=(process.argv.slice(2).join(' ')||'repl.commands.help.action.call(repl)');
repl.eval(command);