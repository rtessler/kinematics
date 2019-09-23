import React, { Component } from 'react'
import Geometry, {Circle, Vector} from './geometry'
import { getBrowserName } from './utils'

enum AnimType { EXPLODE = 1, BOUNCE = 2, FUNNEL = 3};

// function requestAnimFrame() {

//   return window.requestAnimationFrame || 
//     window.webkitRequestAnimationFrame || 
//     window.mozRequestAnimationFrame    || 
//     window.oRequestAnimationFrame      || 
//     window.msRequestAnimationFrame     ||  
//     function( callback ) {
//       window.setTimeout(callback, 1000 / 60);
//     }
// }

// window.requestAnimFrame = (function() {

//   return  window.requestAnimationFrame || 
//     window.webkitRequestAnimationFrame || 
//     window.mozRequestAnimationFrame    || 
//     window.oRequestAnimationFrame      || 
//     window.msRequestAnimationFrame     ||  
//     function( callback ) {
//       window.setTimeout(callback, 1000 / 60);
//     };
// })();

interface CanvasAnimationData {
  animType: AnimType;
  frameCount: number;
  frameRate: number;
  animDuration: number; // seconds
  totalFrames: number;  // frame_rate * anim_duration
  pointNo: number;   // how many circles to draw
  t: number[];        // pre-calculated values of parametric t values after being put through easing function
  points: Circle[]
}

export default class CanvasAnimation extends Component {

  browser: string
  data: CanvasAnimationData
  easingFunctions: any
  geom: Geometry;

  constructor(props: any) {

    super(props)

    this.geom = new Geometry()

    this.data = {

      animType: AnimType.EXPLODE,
      frameCount: 0,
      frameRate: 60,
      animDuration: 1,
      totalFrames: 60,
    
      pointNo: 120,
      t: [],
      points: []
    }
  
    this.easingFunctions = {
      // no easing, no acceleration
      linear: function (t: number) { return t },
      // accelerating from zero velocity
      easeInQuad: function (t: number) { return t*t },
      // decelerating to zero velocity
      easeOutQuad: function (t: number) { return t*(2-t) },
      // acceleration until halfway, then deceleration
      easeInOutQuad: function (t: number) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
      // accelerating from zero velocity 
      easeInCubic: function (t: number) { return t*t*t },
      // decelerating to zero velocity 
      easeOutCubic: function (t: number) { return (--t)*t*t+1 },
      // acceleration until halfway, then deceleration 
      easeInOutCubic: function (t: number) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
      // accelerating from zero velocity 
      easeInQuart: function (t: number) { return t*t*t*t },
      // decelerating to zero velocity 
      easeOutQuart: function (t: number) { return 1-(--t)*t*t*t },
      // acceleration until halfway, then deceleration
      easeInOutQuart: function (t: number) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
      // accelerating from zero velocity
      easeInQuint: function (t: number) { return t*t*t*t*t },
      // decelerating to zero velocity
      easeOutQuint: function (t: number) { return 1+(--t)*t*t*t*t },
      // acceleration until halfway, then deceleration 
      easeInOutQuint: function (t: number) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    }
  }

  componentDidMount() {

    this.init()
  }

  preCalculateEasingParametricValues()
  {
    this.data.t = []

    for (let i = 0; i <= this.data.totalFrames; i++)
    {
      const t = i / this.data.totalFrames

      this.data.t.push( this.easingFunctions.easeOutQuad(t) )
    }
  }
  
  drawCircle(o: Circle)
  {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d')

    // transform to canvas coordinates

    var center_x = canvas.width/2
    var center_y = canvas.height/2

    context.beginPath();
    context.arc(o.x + center_x, o.y + center_y, o.radius, 0, 2 * Math.PI, false);
    //context.fillStyle = "rgba(0, 255, 0, 0.3)";
    context.fillStyle = "rgba(191, 217, 86, 0.3)";
    context.fill();
  }
  
  draw()
  {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0, len = this.data.points.length; i < len; i++)
      this.drawCircle(this.data.points[i]);		
  }

  move()
  {
    //var t = this.frame_count / this.total_frames;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    switch (this.data.animType)
    {
      case AnimType.EXPLODE:

        const t = this.data.t[this.data.frameCount];
    
        this.data.points.forEach((v,i) => {

          const x = t * v.original_x * canvas.width
          const y = t * v.original_y * canvas.height

          v.dx = (x - v.x)*8
          v.dy = (y - v.y)*8

          v.x = x
          v.y = y	
        })

        break;

      case AnimType.BOUNCE:

        for (let i = 0, len = this.data.points.length; i < len; i++) {
        //this.data.points.forEach((v,i) => {
        
          let v = this.data.points[i];

          if (v.x + v.radius > canvas.width / 2 || v.x - v.radius < -canvas.width / 2)
            v.dx *= -1

          if (v.y + v.radius > canvas.height / 2 || v.y - v.radius < -canvas.height / 2)
            v.dy *= -1

          // let v2: Vector
          // let incident = this.geom.reverse(this.geom.normalize({x: v.dx, y: v.dy}))

          // if (v.x + v.radius > canvas.width / 2) 
          //   v2 = this.geom.reflected({x: -1, y: 0}, incident)

          // if (v.x - v.radius < -canvas.width / 2)
          //   v2 = this.geom.reflected({x: 1, y: 0}, incident)

          // if (v.y + v.radius > canvas.height / 2 )
          //   v2 = this.geom.reflected({x: 0, y: -1}, incident)

          // if (v.y - v.radius < -canvas.height / 2)
          //   v2 = this.geom.reflected({x: 0, y: 1}, incident)

/*

          var n;

          if (v.x + v.radius > canvas.width / 2)					
            n = {x:-1, y:0};					
          else if (v.x - v.radius < -canvas.width / 2)					
            n = {x:1, y:0};					
          else if (v.y + v.radius > canvas.height / 2)					
            n = {x:0, y: -1};					
          else if (v.y - v.radius < -canvas.height / 2)					
            n = {x: 0, y: 1};					

          var q = {x: dx, y: dy};

          q = this.normalize(q);

          var dp = 2 * this.dotproduct(n, q);

          //R = 2N(N*L)-L

          //v2 = dp * n - v

          v.dx = dp * n.x - v.dx;
          v.dy = dp * n.y - v.dy;
*/

          v.x += v.dx;
          v.y += v.dy;
        }

        break;

      case AnimType.FUNNEL:

        for (let i = 0, len = this.data.points.length; i < len; i++)
        {
          var v = this.data.points[i];

          v.x += v.dx;
          v.y += v.dy;
        }
        break;
    }
  }
  
  animloop() {

    switch (this.data.animType)
    {
      case AnimType.EXPLODE:

        if (this.data.frameCount > this.data.totalFrames)
        {
          this.data.animType = AnimType.BOUNCE;
        }
        else
        {
            this.move()
            this.draw()
            this.data.frameCount++
        }

        window.requestAnimationFrame(() => this.animloop())
        break

        case AnimType.BOUNCE:

          this.move()
          this.draw()
          window.requestAnimationFrame(() => this.animloop())
          break

        case AnimType.FUNNEL:

        if (this.data.frameCount > this.data.totalFrames)
          return

        this.move()
        this.draw()
        this.data.frameCount++

        window.requestAnimationFrame(() => this.animloop())	
        break
      }
    }
  
    createCanvas()
    {
      // cant sepecify canvas width and height in css, have to do it in canvas html
  
      var e = document.getElementsByClassName("canvas-container")[0] as HTMLElement;
  
      if (!e)
        console.log("createCanvas: cannot find canvas-container");
  
      var q = document.getElementsByClassName("right-panel")[0] as HTMLElement;
  
      var w = q.clientWidth;
      var h = q.clientHeight;
  
      var x = document.createElement("canvas");
  
      x.setAttribute("id", "canvas");
      x.setAttribute("width", w.toString());
      x.setAttribute("height", h.toString());
  
      e.appendChild(x);
    }
/*  
    startListening()
    {
      var self = this;
  
      $(".display").click(function(e) {
  
        self.frame_count = 0;			
  
        if (self.anim_type == self.ANIM_TYPE_BOUNCE)
        {
          self.anim_type = 0;
  
          self.initFunnelAnimation();
  
          self.anim_type = self.ANIM_TYPE_FUNNEL;
  
          self.animloop();
        }
        else
        {
          self.anim_type = 0;
  
          self.initExplodeAnim();
  
          self.anim_type = self.ANIM_TYPE_EXPLODE;
  
          self.animloop();
        }
      });
  
      var e = $("#canvas");
  
      if (!e)
        console.log("no canvas element");
  
      var self = this;
  
      e.on("mousedown", function(x) { self.canvasEvent(x); });
      e.on("mousemove", function(x) { self.canvasEvent(x); });
      e.on("mouseup", function(x) { self.canvasEvent(x); });
  
      // var canvas = document.getElementById('canvas');
  
      // canvas.addEventListener("mousedown", this.canvasEvent.bind(this));
      // canvas.addEventListener("mousemove", this.canvasEvent.bind(this));
      // canvas.addEventListener("mouseup", this.canvasEvent.bind(this));
  	
    $(".open-data img.icon").on("mouseover", function(e) {
  
        let x = $(e.currentTarget);
  
        let text = x.parent().find('.tooltiptext').html();	
        let heading = x.parent().parent().find('.heading').html();
  
        text = 'Not yet implmented'
        headin = 'watch this space';
  
        var offset =x.offset();
        var w = x.width();
  
        $(".dialog").fadeIn();
        $(".dialog").css({left: offset.left - w/2, top: offset.top - w/2 });
        $(".dialog .circle").addClass("grow");
        
        $(".dialog .text").html("<b>" + heading + "</b><br><br>" + text);
        //$(".dialog").css({left: e.pageX - 75, top: e.pageY - 75});		
      });
  
      $(".open-data:not(img.icon)").on('click', function(e) {
  
           $(".dialog .circle").removeClass("grow");
           $(".dialog").fadeOut();
      });
  
      //$(document).on('mouseup',function(e){
      $(".dialog .circle").on("mouseleave", function(e) {
  
        // doesn't fire if mouse moves quickly
  
    
        // if ($(".open-data img").is(e.target))
        //   return;
  
        //     var container = $('.dialog');
  
        //     if (!container.is(e.target)                  // we clicked on something other than the container
        //         && container.is(":visible")
        //         && container.has(e.target).length === 0) // ... nor a descendant of the container
        //     {
            
               $(".dialog .circle").removeClass("grow");
               $(".dialog").fadeOut();
            //}
        //});
  
        $(".open-data .heading.first").on("mouseover", function(e) {
  
        var text = $(e.currentTarget).parent().find('.tooltiptext').html();	
        var heading = $(e.currentTarget).parent().parent().find('.heading').html();
  
        var offset = $(e.currentTarget).offset();
        var w = $(e.currentTarget).width();
  
        $(".dialog").fadeIn();
        $(".dialog").css({left: offset.left + w/2 - 75, top: offset.top + w/2 - 225 });
        $(".dialog .circle").addClass("grow");
        
        $(".dialog .text").html("<b>" + heading + "</b><br><br>" + text);
        });
    },
  
    canvasEvent(ev: any)
    {
      // handle mousedown, mousemove, mouseup events
          // there are differences in mouse position data between browsers
  
          //if (ev.layerX || ev.layerX == 0) // Firefox
  
          if (this.browser == "firefox")
          {
              var position = this.$el.offset();
  
              ev._x = ev.pageX - position.left;
              ev._y = ev.pageY - position.top;
          } 
          else if (ev.offsetX || ev.offsetX == 0) 
          { 
              ev._x = ev.offsetX;
              ev._y = ev.offsetY;
          }
  
          switch (ev.type)
          {
              case "mousedown": this.mousedown(ev); break;
              case "mousemove": this.mousemove(ev); break;
              case "mouseup": this.mouseup(ev); break;
          }
    },
  
  
    mousedown(e: any)
    {
      var arr = this.hitTest(e._x, e._y);
    }
  
    mousemove(e: any)
    {
  
    }
  
    mouseup(e: any)
    {
  
    }
  
    hitTest(x: number, y: number) {
  
      // return an array of objects under the mouse
  
      var ret = [];
  
      for (let i = 0; i < this.data.points.length; i++)
      {
        var o = this.data.points[i];

          if (this.geom.pointInside(o, x, y))
            ret.push(o);
      }

      return ret;
    }
*/    
  
    initFunnelAnimation()
    {
      this.data.animDuration = 2
      this.data.totalFrames = this.data.frameRate * this.data.animDuration
  
      var canvas = document.getElementById('canvas') as HTMLCanvasElement
      // var context = canvas.getContext('2d')
  
      // var center_x = canvas.width / 2
      // var center_y = canvas.height / 2
  
      for (var i = 0, len = this.data.points.length; i < len; i++)
      {
        var v =  this.data.points[i];
  
        v.dx = -v.x / this.data.totalFrames;
        v.dy = (canvas.height - v.y) / this.data.totalFrames;
      }
    }
  
    initExplodeAnim()
    {
      this.data.animDuration = 1
      this.data.totalFrames = this.data.frameRate * this.data.animDuration

      var circle_radius_no = 4  // number of different sizes

      this.data.points = []
  
      for (let i = 0, len = this.data.pointNo; i < len; i++)
      {
        var x = Math.random() - 0.5;		// x: -0.5..0.5
        var y = Math.random() - 0.5;		// y: -0.5..0.5				
  
        // radius: [10,20,30,40,50]
  
        var r = (Math.floor(Math.random() * circle_radius_no) + 1) * 10;
  
        const o = {          
          x: x,
          y: y,
          radius: r,
          original_x: x,
          original_y: y,				
          //dx: dx,
          //dy: dy,
        }
  
        this.data.points.push(o)
      }
  
      // calculate t values before we go into the animation loop, its time consuming
  
      this.preCalculateEasingParametricValues()
  }
  
  init()
  {
    console.log('init')

    this.browser = getBrowserName()

    this.createCanvas()

    this.initExplodeAnim()

    this.data.animType = AnimType.EXPLODE

    var self = this;

    //setTimeout(() => {

      self.animloop()
      //self.startListening()

   // }, 200)
  }

  render() {

    return <div className='canvas-container'></div>
    
  }
}