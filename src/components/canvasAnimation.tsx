import React, { Component } from 'react'
import Geometry, {Circle, Vector} from './geometry'
import { getBrowserName } from './utils'

import './canvasAnimation.scss'

interface CanvasAnimationProps {
  numberOfPoints: number,
  circleSizes: number
}


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

export default class CanvasAnimation extends Component<CanvasAnimationProps> {

  browser: string
  data: CanvasAnimationData
  easingFunctions: any
  geom: Geometry;

  constructor(props: any) {

    super(props)

    console.log('CanvasAnimation props = ', props)
    this.geom = new Geometry()

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

  componentDidUpdate() {

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
    context.arc(o.x + center_x, o.y + center_y, o.radius, 0, 2 * Math.PI, false)
    //context.fillStyle = "rgba(0, 255, 0, 0.3)"
    context.fillStyle = "rgba(191, 217, 86, 0.3)"
    context.fill()
  }
  
  draw()
  {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, canvas.width, canvas.height)

    for (var i = 0, len = this.data.points.length; i < len; i++)
      this.drawCircle(this.data.points[i])
  }

  move()
  {
    //var t = this.frame_count / this.total_frames;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const w = canvas.width
    const h = canvas.height
    const w2 = canvas.width / 2
    const h2 = canvas.height / 2
    const maxRadius = 50
    

    switch (this.data.animType)
    {
      case AnimType.EXPLODE:

        const i = this.data.frameCount < this.data.t.length ? this.data.frameCount : this.data.t.length-1

        const t = this.data.t[i]
    
        this.data.points.forEach((v,i) => {

          const x = t * v.original_x * (w - 80)
          const y = t * v.original_y * (h - 80)

          v.x = x
          v.y = y	
        })

        break;

      case AnimType.BOUNCE:

        const normRight = new Vector(-1,0)
        const normLeft = new Vector(1, 0)
        const normBottom = new Vector(0, -1)
        const normTop = new Vector(0,1)

        this.data.points.forEach((v,i) => {

          // if (v.x + v.radius > w / 2 || v.x - v.radius < -w / 2)
          //   v.dx *= -1

          // if (v.y + v.radius > h / 2 || v.y - v.radius < -h / 2)
          //   v.dy *= -1

          if (v.x + v.radius > w2 || v.x - v.radius < -w2)
            v.direction.x *= -1

          if (v.y + v.radius > h2 || v.y - v.radius < -h2)
            v.direction.y *= -1

          // let incident = v.direction.copy()
          // incident.reverse()

          // // off right

          // if (v.x + v.radius > w2) 
          //   v.direction = incident.reflected(normRight)

          // // off left

          // if (v.x - v.radius < -w2)
          //   v.direction = incident.reflected(normLeft)

          // // off bottom

          // if (v.y + v.radius > h2 )
          //   v.direction = incident.reflected(normBottom)

          // // off top

          // if (v.y - v.radius < -h2)
          //   v.direction = incident.reflected(normTop)

          v.x += v.direction.x;
          v.y += v.direction.y;

        })

        break;

      case AnimType.FUNNEL:

        for (let i = 0, len = this.data.points.length; i < len; i++)
        {
          var v = this.data.points[i];

          v.x += v.direction.x;
          v.y += v.direction.y;

          // v.x += v.dx;
          // v.y += v.dy;
        }
        break;
    }
  }
  
  animloop() {

    switch (this.data.animType)
    {
      case AnimType.EXPLODE:

        if (this.data.frameCount >= this.data.totalFrames)
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
      var element = document.getElementById("canvas");
      
      if (element) 
        element.parentNode.removeChild(element);

      // cant sepecify canvas width and height in css, have to do it in canvas html
  
      var e = document.getElementsByClassName("canvas-container")[0] as HTMLElement;
  
      if (!e)
        console.log("createCanvas: cannot find canvas-container");
  
      var q = document.getElementsByClassName("right-panel")[0] as HTMLElement;
  
      var w = e.clientWidth;
      var h = e.clientHeight - 80;
  
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
        var v =  this.data.points[i]
  
        v.direction.x = -v.x / this.data.totalFrames
        v.direction.y = (canvas.height - v.y) / this.data.totalFrames

        // v.dx = -v.x / this.data.totalFrames
        // v.dy = (canvas.height - v.y) / this.data.totalFrames
      }
    }
  
    initExplodeAnim()
    {
      this.data.animDuration = 1
      this.data.totalFrames = this.data.frameRate * this.data.animDuration

      var circle_radius_no = this.props.circleSizes  // number of different sizes

      this.data.points = []
  
      for (let i = 0, len = this.data.pointNo; i < len; i++)
      {
        var x = Math.random() - 0.5		// x: -0.5..0.5
        var y = Math.random() - 0.5		// y: -0.5..0.5				
  
        // radius: [10,20,30,40,50]
  
        var r = (Math.floor(Math.random() * circle_radius_no) + 1) * 10

        let direction = new Vector(x,y).normalize()
  
        const o = {          
          x: x,
          y: y,
          radius: r,
          original_x: x,
          original_y: y,				
          direction: direction
        }
  
        this.data.points.push(o)
      }
  
      // calculate t values before we go into the animation loop, its time consuming
  
      this.preCalculateEasingParametricValues()
  }
  
  init()
  {
    this.data = {

      animType: AnimType.EXPLODE,
      frameCount: 0,
      frameRate: 25,
      animDuration: 1,
      totalFrames: 0,
    
      pointNo: this.props.numberOfPoints,
      t: [],
      points: []
    }
  
    this.browser = getBrowserName()

    this.createCanvas()

    this.initExplodeAnim()

    this.data.animType = AnimType.EXPLODE

    var self = this;

    setTimeout(() => {

      self.animloop()
      //self.startListening()

   }, 200)
  }

  render() {

    return <div className='canvas-container'></div>
    
  }
}