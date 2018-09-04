var List = module.exports = class List extends Array {
    constructor(length, offset=0,step=1) {
        super(length).fill(0);
        for(var i=0;i<this.length;i++) {
            this[i]=i*step+offset;
        }
    }
    static from(object,fn) {
        fn=fn||((e,i)=>typeof(e)!="undefined"?e:i);
        var list = new List();
        for(var i=0;i<object.length;i++) {
            list[i]=fn(object[i],i)
        };
        return list;
    }
    insert(elements, indexTo) { 
        indexTo=indexTo||this.length; 
        var head=this.slice(0, indexTo);
        var tail=this.slice(indexTo);
        var body=elements[Symbol.iterator]?elements:[elements];
        indexTo-=head.length;
        var newList = [...head, ...body, ...tail];
        newList.forEach((x,i)=>this[i]=x); 
        return this; 
    }
    move(indexFrom, indexTo) { this.insert(this.splice(indexFrom,1), indexTo) }
}
Object.assign(List.prototype, require('./eventtarget'));