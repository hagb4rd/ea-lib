const PIE = exports.PIE = Math.PIE = 2*Math.PI;
var deg = exports.deg = x => x * (PIE/360);
var rad = exports.rad = alpha => alpha * (360/PIE);


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



var format=exports.format={
    hex : (i)=>{ var hex=Number(i).toString(16); return hex.padStart(hex.length+(hex.length%2),'0'); }
} 
