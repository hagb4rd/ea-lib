var fs=require("fs");
var path = require("path");
var {URL} = require("url");
var {promisify,inspect} = require("util");
var cp = require('child_process');

//check if harmony flag is set
var isHarmony = () => process.execArgv.includes("--harmony");



var readdir = promisify(fs.readdir);
var stat = promisify(fs.stat);
var lstat = promisify(fs.lstat);
var exec = promisify(cp.exec);

var ls = exports.ls = async(folder,filter) => {
  folder = folder || process.cwd();
  folder = path.resolve(folder);
  var names = await readdir(folder);
  var list = names.map(fileName => path.resolve(folder, fileName));

  var files = await Promise.all(list.map(async(filepath)=>({...path.parse(filepath),...({path: filepath, isDirectory: (await stat(filepath)).isDirectory()})})));
  
  if(filter) {
    return files.filter(filter)
  } else {
    return files;
  }
}
var lsR = exports.lsR = function*(folder,filter) {
  

}

var dir = exports.dir = async(folder,cmd=((folder,opts='')=>`dir ${opts} /s /b "${folder}"`)) => {
  folder = folder || process.cwd();
  folder = path.resolve(folder);
  var command = cmd(folder);
  //console.log(command);
  console.time(command);
  var stdout = (await exec(command)).stdout;
  console.timeEnd(command);
  return stdout.trim().split(/\r\n|\n/);
}


//experimental
var walk;
try {
  var fn = () => eval(`walk=(async function*(filepath=".") { var files=await ls(filepath); for(var i=0,l=files.length,x=files[i];i<l;i++) if(x.isDirectory) { yield* walk(x.path); } else { yield x; }; })`);
  if(isHarmony()) {
    console.log("HARMONY: ", isHarmony(), fn().toString());
    walk = fn();

  }   
} catch(e) {
 
}
exports.walk = walk||(()=>{ throw TypeError("not implemented yet!") });

var splitLines=(text)=>text.replace(/\r\n/g,'\n').trim().split("\n");
var toArray=exports.toArray=async(filepath)=>util.promisify(fs.readFile)(filepath,{encoding:"utf-8"}).then(splitLines);