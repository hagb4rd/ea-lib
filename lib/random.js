var rand = function(...args) {
	var a, b, random;
	if(args.length==3) {
		[a,b,random] = args;
	} else if(args.length==2) {
		if(typeof(args[1])=='function') {
			[a, random] = args;
		} else {
			[a, b] = args;
		} 
	} else if (args.length==1) {
		a = args[0];
	}
	//weighted stats should finally have the entries form [..[elem: string,weight: number]]
	var testEntries=a=>a.every(elem=>elem.length==2 && typeof(elem[0])=="string" && typeof(elem[1])=="number");

	if(typeof(random) != 'function') {
		random = Math.random;
	}

	if(typeof(b)!='undefined') { 
		var min=Math.min(a,b);
		var max=Math.max(a,b);
		return Math.floor(min+random()*(max-min+1));
	}
	if(typeof(a)=='number') {
		return Math.floor(random()*a);
	}
	if(Array.isArray(a) && !testEntries(a)) {
		return a[Math.floor(random()*a.length)];
	}
	if(typeof(a=='undefined')) {
		return random();
	}
	if(a && typeof(a.entries)=='function') {
		a=[...a.entries()];
	} else {
		a=Object.entries(a);
	}
	if(!testEntries(a)) {
		throw new TypeError(random.help);
	}

	var last=-1;
	var items=[];


	for(var i=0; i<a.length; i++) {
		var [item, weight] = a[i];
		var min=last+1; 
		var max=min+(weight-1);
		last = max;
		items.push({ item, weight, min, max});
	}

	var context = {
		random: random,
		items: items,
		max: max,
		details: true
	};

	var rnd = function(opts={}) {
		var context=Object.assign({}, this, opts);
		var value=Math.floor(context.random()*context.max)
		var item=context.items.filter(item=>item.min<=value&&value<=item.max)[0];
	
		var result=Object.assign({},context,item);
		result.value = value;
		Object.defineProperty(result, "toString", { value: function() { result.item }, enumerable: false}); 
		Object.defineProperty(result, "valueOf", { value: function() { result.item }, enumerable: false});
		result.probability = result.weight/result.max;
		result[require('util').inspect.custom] = function() { return result.item.toString(); };
		
		return context.details
			? result
			: result.item.toString();
	};
	rnd.context=context;
	return rnd.bind(rnd.context);
}; 

rand.help = ` var {range, rand, seed} = require('ea-lib'); var stats={car:5, house:8, tree:12}; var rnd=rand(stats, seed('feeling lucky')); range(1,10).map(x=>rnd().item); `

module.exports = rand;