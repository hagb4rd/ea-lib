var lib = require("./lib");

class Stats {
    constructor(obj) {
        if (obj) {
            this.stats = new Map(Object.entries(obj));
        } else {
            this.stats = new Map();
        }
        this.logs = [];
    }
    count(arr) {
        arr = arr || [];
        var addItem = c => {
            var stored = this.stats.get(c);
            if (typeof (stored) == "undefined") {
                stored = 0;
            }
            stored += 1;
            this.stats.set(c, stored);
            return [c, stored];
        };
        var countlog = arr.map(addItem);
        this.logs = this.logs.concat(countlog);
        return Array.from(this.stats).sort((a, b) => lib.cmp(a[0], b[0]));
    }
    static count(arr) { console.time("counting elements in array"); arr=arr||[]; var stats=new Stats();  console.timeEnd("counting elements in array");  return stats.count(arr) }
}

module.exports = Stats;