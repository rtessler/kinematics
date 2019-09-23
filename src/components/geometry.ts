export class Circle {
    x: number;
    y: number;
    radius: number;

    original_x: number;
    original_y: number;			

    dx?: number;
    dy?: number;
}

export class Vector {
  x: number;
  y: number;
}

export default class Geometry {

  pointInside(o: Circle, x: number, y: number) {
  
    return (x >= o.x - o.radius && x <= o.x + o.radius && y >= o.y - o.radius && y <= o.y + o.radius);
  }

  dotproduct(v1: Vector, v2: Vector) {
  
    return v1.x*v2.x + v1.y*v2.y;
  }

  crossProduct(v1: Vector, v2: Vector)
  { 
    return {x: v1.x * v2.x, y: v1.y * v2.y};
  }

  scale(v: Vector, s: number) : Vector {

    return {x: v.x * s, y: v.y * s}
  }

  subtract(a: Vector, b: Vector) : Vector {

    return {x: a.x -b.x, y: a.y - b.y}
  }

  reflected(normal: Vector, v: Vector) : Vector {

    // get the reflected vector

    // https://www.fabrizioduroni.it/2017/08/25/how-to-calculate-reflection-vector.html

    // assume normal and v are unit vectors

    return this.subtract( this.scale(normal, 2 * this.dotproduct(normal, v)), v)
  }

  magnitude(v: Vector)
  {
    return Math.sqrt(v.x*v.x + v.y*v.y);
  }

  normalize(v: Vector) : Vector
  {
    var len = this.magnitude(v);

    return {x: v.x/len, y: v.y/len};
  }

  reverse(v: Vector) : Vector {
    return {x: -v.x, y: -v.y}
  }
}