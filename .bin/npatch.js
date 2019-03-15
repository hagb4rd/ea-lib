#!/usr/bin/env node
var fs=require('fs');
var path=require('path');
var {execSync,exec,spawn}=require('child_process');
var es=require('event-stream');
var lib = require('../index');
var argv = require('minimist')(process.argv.slice(2));


var log=[];
var targetDirectory = path.resolve(argv[0]||process.cwd());
var filePath=path.resolve(targetDirectory, 'package.json');
var text=fs.readFileSync(filePath,{encoding:'utf8'});
var package=JSON.parse(text);
log.push(package.name);
log.push(package.version);
var [major,minor,patch] = package.version.split('.');
patch++;
package.version = [major,minor,patch].join('.');
fs.writeFileSync(filePath,JSON.stringify(package), {encoding:'utf8'});
log.push(package.version);
console.log(log[0] + ' ' + log[1] + ' => ' +log[2]);
