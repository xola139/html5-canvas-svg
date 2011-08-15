/*!
 * HTML5 Canvas SVG Alpha 2.0
 * http://specinnovations.com/
 *
 * Copyright 2011, SPEC Innovations
 * Dual licensed under the MIT or Apache 2.0.
 * http://code.google.com/p/html5-canvas-svg/
 * Alex Rhea, Chris Ritter
 *
 * Date: Tue Aug 09 2011 -0400
 */
 
var SVGCanvas = (function() {
	
	// default canvas settings
	var settings = {
		strokeStyle   : "black",
		lineWidth     : 1,
		lineCap       : "butt",
		lineJoin      : "miter",
		miterLimit    : 10,
		fillStyle     : "black",
		shadowOffsetX : 0,
		shadowOffsetY : 0,
		shadowBlur    : 0,
		shadowColor   : "transparent black",
		font          : "10px sans-serif",
		textAlign     : "start",
		textBaseline  : "alphabetic"
	}
	
	// current path template
	var currentPath = {
		type : "path",
		points : new Array(),
		style : {}
	}
	
	// canvas DOM element
	var canvas = null;
	
	// canvas context
	var ctx = null;
	
	// elements drawn to the canvas
	var elements = [];
	
	var SVGCanvas = function( id ) {
		canvas = document.getElementById( id );
		ctx = canvas.getContext( "2d" );
		
		/* Settings */
		this.strokeStyle = "black";
		this.lineWidth = 1;
		this.lineCap = "butt";
		this.lineJoin = "miter";
		this.miterLimit = 10;
		this.fillStyle = "black";
		this.shadowOffsetX = 0;
		this.shadowOffsetY = 0;
		this.shadowBlur = 0;
		this.shadowColor = "transparent black";
		this.font = "10px sans-serif";
		this.textAlign = "start";
		this.textBaseline = "alphabetic";
		
	}
	
	SVGCanvas.prototype = {
		constructor : SVGCanvas,
		getCanvas : function() { return canvas; },
		getContext : function() { return ctx; },
		
		beginPath : function() {
			pushToStack();
			ctx.beginPath();
		},
		
		closePath : function() {
			pushToStack();
			ctx.closePath();
		},
		
		moveTo : function( x , y ) {
			currentPath.points.push({ "action" : "move" , "x" : x , "y" : y });
			ctx.moveTo( x , y );
		},
		
		lineTo : function( x , y ) {
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y });
			ctx.lineTo( x , y );
		},
		
		quadraticCurveTo : function( cpx, cpy, x, y ) {
			currentPath.points.push({ "action" : "quadratic" , "x" : x , "y" : y , "x1" :  cpx, "y1" : cpy });
			ctx.quadraticCurveTo( cpx, cpy, x, y );
		},
		
		bezierCurveTo : function( cp1x, cp1y, cp2x, cp2y, x, y ) {
			currentPath.points.push({ "action" : "bezier" , "x" : x , "y" : y , "x1" :  cp1x, "y1" : cp1y , "x2" : cp2x, "y2" : cp2y  } );
			ctx.bezierCurveTo( cp1x, cp1y, cp2x, cp2y, x, y ) ;
		},
		
		arcTo : function( x1, y1, x2, y2, radius ) {
			currentPath.points.push({ "action" : "move" , "x" : x1 , "y" : y1 });
			this.bezierCurveTo( x1 , (y1+radius) , x2 , (y2+radius) );
			ctx.arcTo( x1, y1, x2, y2, radius );
		},
		
		arc : function( x, y, radius, startAngle, endAngle, anticlockwise ) {
			ctx.arc( x, y, radius, startAngle, endAngle, anticlockwise );
		},
		
		rect : function( x , y , width , height ) {
			currentPath.points.push({ "action" : "move" , "x" : x , "y" : y });
			currentPath.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			currentPath.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			currentPath.points.push({ "action" : "line" , "x" : x , "y" : y });
			ctx.rect( x , y , width , height );
		},
	
		fillRect : function( x , y , width , height )  {
			pushToStack();
			var rect = { type : "path" , style : {} };
			rect.points = new Array();
			rect.points.push({ "action" : "move" , "x" : x , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y });
			rect.style["fill"] = ctx.fillStyle = this.fillStyle;
			elements.push( rect );
			ctx.fillRect( x , y , width , height );
		},
	
		strokeRect : function( x , y , width , height )  {
			pushToStack();
			var rect = { type : "path" , style : {} };
			rect.points = new Array();
			rect.points.push({ "action" : "move" , "x" : x , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y });
			rect.points.push({ "action" : "line" , "x" : x+width , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y+height });
			rect.points.push({ "action" : "line" , "x" : x , "y" : y });
			rect.style["stroke"] = ctx.strokeStyle = this.strokeStyle;
			rect.style["stroke-width"] = ctx.lineWidth = this.lineWidth;
			rect.style["stroke-linecap"] = ctx.lineCap = this.lineCap;
			rect.style["stroke-miterlimit"] = ctx.miterLimit = this.miterLimit;
			rect.style["stroke-linejoin"] = ctx.lineJoin = this.lineJoin;
			elements.push( rect );
			ctx.strokeRect( x , y , width , height );
		},
	
		isPointInPath : function( x, y ) {
			return ctx.isPointInPath( x , y );
		},
		
		stroke : function() {
			var path;
			if( currentPath.points.length > 0 ) {
				path = currentPath;
			} else {
				path = elements[elements.length-1];
			}
			path.style["stroke"] = ctx.strokeStyle = this.strokeStyle;
			path.style["stroke-width"] = ctx.lineWidth = this.lineWidth;
			path.style["stroke-linecap"] = ctx.lineCap = this.lineCap;
			path.style["stroke-miterlimit"] = ctx.miterLimit = this.miterLimit;
			path.style["stroke-linejoin"] = ctx.lineJoin = this.lineJoin;
			ctx.stroke();
		},
		
		fill : function() {
			var path;
			if( currentPath.points.length > 0 ) {
				path = currentPath;
			} else {
				path = elements[elements.length-1];
			}
			path.style["fill"] = ctx.fillStyle = this.fillStyle;
			ctx.fill();
		},
		
		strokeText : function( text , x , y ) {
			ctx.font = this.font;
			elements.push( { "type" : "text" , "text" : text , "x" : x , "y" : y , style : { "font" : this.font , "text-align" : this.textAlign , "alignment-baseline" : this.textBaseline, "fill" : this.strokeStyle } } );
			ctx.strokeText( text , x , y );
		},
		
		fillText : function( text , x , y ) {
			ctx.font = this.font;
			elements.push( { "type" : "text" , "text" : text , "x" : x , "y" : y , style : { "font" : this.font , "text-align" : this.textAlign , "alignment-baseline" : this.textBaseline, "fill" : this.fillStyle } } );
			ctx.fillText( text , x , y );
		},
		
		measureText : function( text ) {
			return ctx.measureText( text );
		},
		
		save : function() {
			ctx.save();
		},
	
		restore : function() {
			ctx.restore();
		},
	
		toDataURL : function( type , args ) {
			if( type == "image/svg+xml" ) {
				return generateSVG();
			} else {
				return ctx.toDataURL( type , args );
			}
			
		}
	}
	
	function pushToStack() {
		if( currentPath.points.length > 0 ) {
			console.log( currentPath );
			elements.push( currentPath );
			currentPath = {
				type : "path",
				points : new Array(),
				style : {}
			}
		}
	}
	
	function generateSVG() {
		
		var xml = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
		
		for( var i=0; i<elements.length; i++ ) {
			var elem = elements[i];
			var style ="";
			for( var attr in elem.style ) {
				style += attr+":"+elem.style[attr]+"; ";
			}
			if(elem.type == "text") {
				xml += '<text x="'+elem.x+'" y="'+elem.y+'" style="'+style+'" >'+ elem.text +'</text>';
			} else if(elem.type == "path") {
				var points = "";
				for( var j=0; j<elem.points.length; j++ ) {
					var point = elem.points[j];
					if( point.action == "move" ) {
						points += "M"+point.x+" "+point.y+" ";
					} else if( point.action == "line" ) {
						points += "L"+point.x+" "+point.y+" ";	
					} else if( point.action == "quadratic" ) {
						points += "Q"+point.x1+" "+point.y1+" "+point.x+" "+point.y+" ";	
					} else if( point.action == "bezier" ) {
						points += "C"+point.x2+" "+point.y2+" "+point.x1+" "+point.y1+" "+point.x+" "+point.y+" ";	
					}
				}
				
				xml += '<path d="'+points+'" style="'+style+'" />';
			}
		}
		
		xml += "</svg>"
		
		return xml;
		
	}
	
	return SVGCanvas;
	
})();
