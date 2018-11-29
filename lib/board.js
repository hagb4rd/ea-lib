//var matrix=(cols, rows) => { var i2xy=i=>({x:i%cols,y:Math.floor(i/cols)}); var xy2i=(x,y)=>y*cols+x; var mx=Array.from({length: cols*rows}, (e,i)=>i2xy(i)); var f=(x,y)=>{ if ((x<0||x>=this.cols)||(y<0||y>=this.rows)) return undefined;	return this[y*cols+x] }; mx.cols=cols; mx.rows=rows; f.mx=mx; return f.bind(f.mx);};
var EventEmitter = require("events").EventEmitter;

var board = module.exports = (cols, rows) => { 
    var i2xy=i=>Object.create(new EventEmitter(),Object.getOwnPropertyDescriptors({x:i%cols,y:Math.floor(i/cols),value:undefined,valueOf(){ return Number(this.v||0)},get v(){ return this.value; }, set v(v){var temp=this.value; this.value=v; if(this.v!==temp) this.emit("change"); }})); 
    var xy2i=(x,y)=>y*cols+x; 
    var mx=Array.from({length: cols*rows}, (e,i)=>i2xy(i)); 
    var f = function(x,y) { 
        if ((x<0||x>=this.cols)||(y<0||y>=this.rows)) {
            return undefined;
        } 
        return this[y*cols+x] 
    }; 
    mx.cols=cols; 
    mx.rows=rows; 
    f.mx=mx; 
    return f.bind(f.mx);
};
board.help = `var RedQueen={inspect:()=>"{RedQueen}"}; var p=board(8,8); p(2,3).items = [ RedQueen ]; p(2,3) --> { x: 2, y: 3, items: [ {RedQueen} ] } `;
