var util=require('util');
var hh=require('cli-highlight');
var beautify=require('js-beautify').js;
var prettify=(s)=>beautify(s,{ indent_size: 2, space_in_empty_paren: true });
var defaultOptions = {depth:0, showHidden:true, colors: true};
var writer = module.exports = (opts) => { 
	var options=Object.assign({},defaultOptions,opts);

	var write=(s,param)=>{
			var finalOpts=Object.assign({},options);
			if(typeof(param)=='object') {
					Object.assign(finalOpts, param);
			} else if(typeof(param)=='number' || param===null ) {
					Object.assign(finalOpts,{ depth: param });
			} else if(typeof(param)=='bool'){
					Object.assign(finalOpts,{ showHidden: param });
			}
					

			var txt = typeof(s)=="function"
									 ?  hh.highlight(prettify(s.toString()))
									 :  typeof(s)=="string"
											? s
											: util.inspect(s,finalOpts); 
			return txt;
	};
	return write;
};
