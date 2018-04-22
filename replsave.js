var dir = {
    node: "D:\\npde",
    deepblu: "D:\\node\\deepblu"
};
var stream = {
    write: {
        log: fs.createWriteStream("D:\\node\\log.txt")
    }
};

var logStart = () => process.stdout.pipe(stream.write.log);
var cd = directory => (process.chdir(directory),process.cwd());
var ls = (s) => fs.readDirectorySync(s||"./");


cd(dir.node);

var repl = {
    server: () => require('./deepblu/repl-server'),
    client: () => require('./deepblu/repl-client')
};


var lib = require('./ea-lib/index');
var log = require('./ea-logs/lib/logsqlite');


var storage = new lib.Storage();



