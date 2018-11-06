var {inspect}=require('util');

class Vector extends Array {

  constructor(array) {
    if(!Array.isArray(array))
      throw new TypeError('expected contructor parameter must inherit Array');
    if(array.length<1) {
      throw new TypeError('expected contructor parameter must contain at least one element');
    }
    super(array.length);
    Object.assign(this, array);
  }

  get x() {
    return this[0];
  }
  set x(a) {
    this[0] = a;
    return a;
  }
  get y() {
    return this[1];
  }
  set y(a) {
    this[1] = a;
    return a;
  }
  get z() {
    return this[2];
  }
  set z(a) {
    this[2] = a;
    return a;
  }
  static create(x, ...yz) {
    if(Array.isArray(x)) {
      return new Vector(x);
    } else {
      return new Vector([x||0,...yz]);
    }
  }

  static scale(k, v) {
    return Vector.create(v.map((a,i)=>k*a));
  }

  scale(k) {
    for(var i=0;i<this.length;i++)
      this[i] *= k;
    return this;
  }

  static substract(...vs) {
    return vs.reduce((v1,v2)=>v1.substract(v2), Vector.create(new Array(vs[0].length)).fill(0));
  }

  substract(v) {
    for(var i=0;i<this.length;i++)
      this[i] -= v[i];
    return this;
  }

  static add(...vs) {
    return vs.reduce((v1,v2)=>v1.add(v2), Vector.create(new Array(vs[0].length)).fill(0));
  }

  add(v) {
    for(var i=0;i<this.length;i++)
      this[i] -= v[i];
    return this;
  }

  static dot(v1, v2) {
    return Vector.create(v1.map((a,i)=>v1[i]*v2[i]));
  }

  dot(v2) {
    return Vector.dot(this, v2);
  }

  static size(v) {
    return Vector.length(v);
  }
  static length(v) {
    return Math.sqrt(v.reduce((a,sum)=>sum+a*a,0));
  }

  get size() {
    return Vector.length(this)
  }

  static norm(v) {
    let length = Vector.size(v);
    let div = (length === 0) ? Infinity : 1.0 / length;
    return Vector.scale(div, v);
  }

  norm() {
    return Vector.norm(this);
  }

  static cross(v1, v2) {
    return Vector.create([
      v1.y * v2.z||0 - v1.z||0 * v2.y,
      v1.z||0 * v2.x - v1.x * v2.z||0,
      v1.x * v2.y - v1.y * v2.x
    ]);
  }

  cross(v2) {
    return Vector.cross(this, v2);
  }

  static wolfram(list) {
    return "http://www.wolframalpha.com/input/?i=" + encodeURI(list.map(v=>"vector+"+v.toString()).join('+')); 
  };

  toString() {
    return super.toString()
  }

  toJSON() {
    return super.toJSON();
  }

  [inspect.custom]() {
    return super[inspect.custom]();
  }
}

class Matrix {
    constructor(...rows) {
        this.rows=rows.map(row=>Vector.create(row));
    }
}

exports.Vector = Vector;
exports.v = function(){ return Vector.create.apply(Vector, arguments); }