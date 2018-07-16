
var generator = {
	next() {
		return ({
			done: false,
			value: Math.random(),
			valueOf:() => this.value
		})
	}
}

var rand = function(min,max) {
	var items, iterable;
	var finalize=(val)=>Math.floor(val);
	// rand(["a","b","c"]) -> ["a","b","c"]
	if(min[Symbol.iterator]) {
		iterable = [...min];
		min = 0;
		max = iterable.length;
	} else if (Array.isArray(min)) {
		iterable = [...min];
		min = 0;
		max = iterable.length;
	} else if (typeof(min)=="object") {
		var entries;
		if(typeof(min.entries)=="function") {
			entries=min.entries()
		} else {
			entries=Object.entries(min);
		}
		//console.log(entries);
		min=0;
		max=0;
		var items = entries
			.filter(([value,weight])=>Number(weight)>0)
			.reduce((all,[value,weight])=>{
                weight=Number(weight);
				max = min+weight-1;
				var item = {value: value, min: min, max: max};
				min = min+weight;
				return [...[item],...all];
			},[]);
		min=0;
		//console.log(items);
	// finalize: num=>floor(num) rand(1,6) -> [1,2,3,4,5,6]
	} else if ((typeof(min) == "number") && (typeof(max) == "number")) {
		[min,max] = [Math.min(min,max), Math.max(min,max)];
		max = max + 1;
	//  rand(["a","b","c"].length || 3) -> [0,1,2]
	} else if ((typeof(min) == "number")) { 
		max = min;
		min = 0;
	// df
	} else {
		[min,max] = [0,1];
		// finalize = (x) => x; 
	}
	var next = this.next();
	

	if(next && typeof(next.value) != "undefined")  {
		next = next.value;
	} else if (typeof(number(next)) == "number") {
	 	next = number(next);
	} else {
		next = Math.random();
	}
	//console.log(`next seed number:${next} min:${min} max:${max}`);
	var randomValue = finalize(next*(max-min)+min);
	//console.log(`final random value:${randomValue}`);

	if(items && items.length) {
		var item=items.filter(item=>(randomValue>=item.min)&&(randomValue<=item.max));
		if(item.length){
			var v=item[0].value;
			item[0].value=randomValue;
			return [v, item[0]];
		}
	} else if (iterable && iterable.length) {
		return iterable[randomValue];
	} else {
		return randomValue;
	}
};

rand.defaultGenerator = generator;

module.exports = rand.bind(generator);