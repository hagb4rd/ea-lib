const PIE = exports.PIE = Math.PIE = 2*Math.PI;
var deg = exports.deg = x => x/Math.PI*180;
var rad = exports.rad = alpha => alpha*Math.PI/180;


//var divisors = n =>{ var t1=Date.now(); var result=Array.from({length: Math.floor(n/2)},(e,i)=>i+1).filter(x=>n%x==0); var t2=Date.now(); console.log(`[brute force] computing divisors: ${n} .. ${t2-t1}ms `); return result; };
var divisors = exports.divisors = n => { 
    if(n==1) {
        return [n];
    } else {
    var t1=Date.now(); 
    var result=Array.from({length: Math.floor(n/2)},(e,i)=>i+1)
        .filter(x=>n%x==0); 
    result.push(n);
    var t2=Date.now(); 
    console.log(`[brute force] computing divisors: ${n} .. ${t2-t1}ms `); 
    return [1].concat(result); 
    }
    
};

var divi=n=>{var t1=Date.now(),r=[1],i=1,m=n/2|0; while(++i<=m) n%i==0 && r.push(i); n>1 && r.push(n); console.log(`Divisors of ${n} are ${r} [ ${(Date.now()-t1)/1000} s ].`); return r; };


var format=exports.format={
    hex : (i)=>{ var hex=Number(i).toString(16); return hex.padStart(hex.length+(hex.length%2),'0'); }
} 
