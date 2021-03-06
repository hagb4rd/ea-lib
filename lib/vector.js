//var {inspect}=require('util');

var deg = x => x/(2*Math.PI/360)
var rad = phi => phi*(2*Math.PI/360);

class Vector extends Array {

  constructor(array) {
    if(!Array.isArray(array) && typeof(array)=='number')
      array = new Array(array).fill(0);
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
  static createNormByAngle(degree) {
    return this.create([Math.cos(rad(degree)),Math.sin(rad(degree))]);
  }

  static scale(k, v) {
    return Vector.create(v.map((a,i)=>k*a));
  }

  scale(k) {
    for(var i=0;i<this.length;i++)
      this[i] *= k;
    return this;
  }

  static subtract(...vs) {
    var v3=Vector.create(vs[0]);
    return vs.slice(1).reduce((v1,v2)=>v1.subtract(v2),v3);
  }

  subtract(v) {
    for(var i=0;i<this.length;i++)
      this[i] -= v[i];
    return this;
  }

  static add(...vs) {
    var v3=new Vector(vs[0].length);
    return vs.reduce((v1,v2)=>v1.add(v2), v3);
  }

  add(v) {
    for(var i=0;i<this.length;i++)
      this[i] += v[i];
    return this;
  }

  static dot(v1, v2) {
    return v1.map((a,i)=>v1[i]*v2[i]).reduce((a,b)=>a+b);
  }

  dot(v2) {
    return Vector.dot(this, v2);
  }

  static size(v) {
    return Math.sqrt(v.reduce((sum,a)=>sum+a*a,0));
  }

  get size() {
    return Vector.size(this)
  }

  static norm(v) {
    var len = v.size;
    var k = (len === 0) 
      ? 0 
      : 1.0 / len;
    return Vector.scale(k, v);
  }

  get angle() {
    return Vector.angle(this);
  }
  static angle(v) {
    //return deg(Math.acos(v.norm()[0]));
    var [cos,sin] = v.norm();
    var angle = deg(Math.atan(sin/cos));
    return  angle;
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

  cross(v2) {m
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

  /*
  [inspect.custom]() {
    return super[inspect.custom]();
  }
  */
}

class Matrix {
    constructor(rows,cols) {
        if(Array.isArray(rows)) {
          this.rows=rows.map(row=>Vector.create(row));
        } else {
          this.rows=Array.from({length:rows},(e,i)=>new Vector(cols));
        }
        Object.assign(this,this.rows);
        this.length=this.rows.length;
    }
    [Symbol.iterator]() {
      return this.rows[Symbol.iterator]();
    }
    static rotation3D(roll=0, pitch=0, yaw=0) {

      roll=rad(roll);
      pitch=rad(pitch);
      yaw=rad(yaw);
	
      var {cos, sin} = Math;
    
      var cosa = cos(roll);
      var sina = sin(roll);
      var cosb = cos(yaw);
      var sinb = sin(yaw);
      var cosc = cos(-pitch);
      var sinc = sin(-pitch);
    
      return new Matrix([
        [cosa*cosb, cosa*sinb*sinc - sina*cosc, cosa*sinb*cosc + sina*sinc],
        [sina*cosb, sina*sinb*sinc + cosa*cosc, sina*sinb*cosc - cosa*sinc],
        [-sinb, cosb*sinc, cosb*cosc]
      ]);
    }
    static rotation2D(v1) {
      
      
      var [cosP, sinP] = Vector.create(v1).norm();

      /*
      var cosP=cos(phi);
      var sinP=sin(phi);
      /* */
      return new Matrix([
        [cosP, -sinP],
        [sinP, cosP]
      ]);
    }
    multiplicate(v1) {
      return Vector.create(this.rows.map(row=>Vector.dot(row,v1)));
    }
}

exports.Vector = Vector;
exports.Matrix = Matrix;
exports.v = function(){ return Vector.create.apply(Vector, arguments); }