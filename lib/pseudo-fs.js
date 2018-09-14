var fs=require('fs');
var path=require('fs')
var md5=require('md5');

function(workingDirectory) {
    if(!fs.exists(workingDirectory))
        throw Error('Directory not found');
}
var fileName=(filePath)=>{
    var filePath=path.resolve(current, filePath)
}
var ffs=new Proxy(require('fs'), { 
    get(targs, k) {
    }
});