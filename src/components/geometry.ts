export class Circle {
    x: number;
    y: number;
    radius: number;

    original_x: number;
    original_y: number;			

    direction: Vector;
}

export class Vector {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  copy() : Vector {
    return new Vector(this.x, this.y)
  }

  dotproduct(v1: Vector, v2: Vector) : number {
  
    return v1.x*v2.x + v1.y*v2.y;
  }

  crossProduct(v1: Vector, v2: Vector) : Vector
  { 
    return new Vector(v1.x * v2.x, v1.y * v2.y)
  }

  scale(v: Vector, s: number) : Vector {

    return new Vector(v.x * s,v.y * s)
  }

  subtract(a: Vector, b: Vector) : Vector {

    return new Vector(a.x -b.x, a.y - b.y)
  }

  reflected(normal: Vector) : Vector {

    // get the reflected vector

    // https://www.fabrizioduroni.it/2017/08/25/how-to-calculate-reflection-vector.html

    // assume normal and v are unit vectors

    return this.subtract( this.scale(normal, 2 * this.dotproduct(normal, this)), this)
  }

  magnitude() : number
  {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  normalize()
  {
    let len = this.magnitude();

    return new Vector(this.x/len, this.y/len)
  }

  reverse() {
    this.x = -this.x
    this.y = -this.y
  }
}

export default class Geometry {

  pointInside(o: Circle, x: number, y: number) {

    // actually this is point inside square
  
    return (x >= o.x - o.radius && x <= o.x + o.radius && y >= o.y - o.radius && y <= o.y + o.radius);
  }
}