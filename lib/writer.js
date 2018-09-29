var util=require('util');
var hh=require('cli-highlight');
var defaultOptions = {depth:0, showHidden:true, colors: true};
var writer = module.exports = (opts) => { 
	opts=opts||defaultOptions; 

	var write=(s,param)=>{
			var finalOpts=opts;
			if(typeof(param)=='object') {
					Object.assign(finalOpts, param);
			} else if(typeof(param)=='number' || param===null ) {
					Object.assign(finalOpts,{ depth: param });
			} else if(typeof(param)=='bool'){
					Object.assign(finalOpts,{ showHidden: param });
			}
					

			var txt = typeof(s)=="function"
									 ?  hh.highlight(s.toString())
									 :  typeof(s)=="string"
											? s
											: util.inspect(s,finalOpts); 
			return txt;
	};
	return write;
};
