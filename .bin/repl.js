#!/usr/bin/env node
var repl=require('../repl')(process.argv.slice(2).join(' ')||'repl.commands.help.action.call(repl)');