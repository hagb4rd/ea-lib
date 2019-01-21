var readEnd = module.exports = (stream,onData,onEnd) => {
    return new Promise((resolve,reject)=>{
        var buffer=[];
        
            stream.on('data', function(e) { 
                buffer.push(onData?onData(e):e);

            })
            stream.on('end', (e)=>{
                resolve(onEnd?onEnd(buffer):buffer)
            })
    })
}
readEnd.help = 'readEnd(fs.createReadStream("./package.json"), data=>data.toString(), buffer=>JSON.parse(buffer.join("\r\n"))); //readStream(stream,onData*,onEnd*)';