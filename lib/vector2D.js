var Vector2D = exports.Vector2D = class Vector2D {
    constructor(x,y) {
        this.x = x || 0;
        this.y = y || 0;
    }
	
	static create(x, y) {
		var v = new Vector2D(x,y);
	}
	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}
	dot(v) { 
		return Vector2D.create(this.x*v.x, this.y*v.y)
	}
	scale(s) {
		return Vector2D.create(this.x * s, this.y * s)
	}
	norm() {
		return this.scale(1 / this.length)
	}
	orth() {
		return Vector2D.create(this.y * (-1), this.x)
	}
	angle(rad) {
		var phi = Math.asin(this.norm().y);
		if (!rad) phi *= (180 / Math.PI);
		return phi;
	}
	
	//x' = x1 + cosq * (x - x1) - sinq * (y - y1) 
	//y' = y1 + sinq * (x - x1) + cosq * (y - y1) 
	turn(phi, v) { 
		v = v || Vector2D.create();
		var v_ = Vector2D.create(); 
		v_.x = v.x + Math.cos(phi) * (this.x - v.x) - Math.sin(phi) * (this.y - v.y);
		v_.y = v.y + Math.sin(phi) * (this.x - v.y) + Math.cos(phi) * (this.y - v.y);

		return v_;
	}
	turn2(phi) { 
		var v_ = Vector2D.create(); 
		v_.x = this.x*Math.cos(phi) - this.y*Math.sin(phi); 
		v_.y=this.x*Math.sin(phi)+this.y*Math.cos(phi); 
		return v_ 
	}
	add(...v) {
		return Vector2D.create(v.map(v_ => v_.x).reduce((prev, next) => prev + next, this.x), v.map(v_ => v_.y).reduce((prev, next) => prev + next, this.y))
	}

	substract(...v) {
		return Vector2D.create(v.map(v_ => v_.x).reduce((prev, next) => prev - next, this.x), v.map(v_ => v_.y).reduce((prev, next) => prev - next, this.y))
	}
	toJSON() {
		return [this.x, this.y]
	}
	fromJSON(json) {
		return Vector2D.create(json[0], json[1])
	}
	toString() {
		//return "( " + this.x.toPrecision(3) + ", " + this.y.toPrecision(3) + " )";
		return util.inspect(this.toJSON())
    }
    static wolframAlpha(...v) {
        return "http://www.wolframalpha.com/input/?i=vector+" + encodeURI(v.map(v_ => v_.toString()).join(','));
    }
};