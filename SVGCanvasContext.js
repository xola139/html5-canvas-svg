/*!
 * HTML5 Canvas SVG v0.1
 * http://specinnovations.com/
 *
 * Copyright 2011, SPEC Innovations
 * Dual licensed under the MIT or Apache 2.0.
 * http://code.google.com/p/html5-canvas-svg/
 * Alex Rhea, Chris Ritter
 *
 * Date: Tue Aug 09 2011 -0400
 */
 
 function SVGCanvasContext( id ) {
	 
	/* Canvas Settings */
	this.canvas = document.getElementById( id );
	this.ctx = this.canvas.getContext( "2d" );
	this.xml = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	
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
	
	/* SVG Storage */
	this.elements = [];
	this.path = {
		type : "path",
		points : [],
		style : {
			"fill" : "",
			"stroke" : "", 
			"stroke-width" : 0,
			"stroke-linecap" : "",
			"stroke-miterlimit" : 0,
			"stroke-linejoin" : ""
		}
	}
	 
	this.beginPath = function() {
		this.push();
	}
	
	this.closePath = function() {
		this.push();
	}
	
	this.moveTo = function( x , y ) {
		this.push();
		this.path.points.push( { "action" : "move" , "x" : x , "y" : y } );
		this.ctx.moveTo( x , y );
	}
	
	this.lineTo = function( x , y ) {
		//console.log( this.path.points );
		this.path.points.push( { "action" : "line" , "x" : x , "y" : y } );
		this.ctx.lineTo( x , y );
	}
	
	this.stroke = function() {
		this.path.style["stroke"] = this.ctx.strokeStyle = this.strokeStyle;
		this.path.style["stroke-width"] = this.ctx.lineWidth = this.lineWidth;
		this.path.style["stroke-linecap"] = this.ctx.lineCap = this.lineCap;
		this.path.style["stroke-miterlimit"] = this.ctx.miterLimit = this.miterLimit;
		this.path.style["stroke-linejoin"] = this.ctx.lineJoin = this.lineJoin;
		this.ctx.stroke();
	}
	
	this.fill = function() {
		this.path.style["fill"] = this.ctx.fillStyle = this.fillStyle;
		this.ctx.fill();
	}
	
	this.strokeText = function( text , x , y ) {
		this.elements.push( { "type" : "text" , "text" : text , "x" : x , "y" : y , style : { "font" : this.font , "text-align" : this.textAlign , "alignment-baseline" : this.textBaseline, "fill" : this.strokeStyle } } );
		this.ctx.strokeText( text , x , y );
	}
	
	this.fillText = function( text , x , y ) {
		this.ctx.font = this.font;
		this.elements.push( { "type" : "text" , "text" : text , "x" : x , "y" : y , style : { "font" : this.font , "text-align" : this.textAlign , "alignment-baseline" : this.textBaseline, "fill" : this.fillStyle } } );
		this.ctx.fillText( text , x , y );
	}
	
	this.measureText = function( text ) {
		return this.ctx.measureText( text );	
	}
	
	this.quadraticCurveTo = function( cpx, cpy, x, y ) {
		this.path.points.push( { "action" : "quadratic" , "x" : x , "y" : y , "x1" :  cpx, "y1" : cpy } );
		this.ctx.quadraticCurveTo( cpx, cpy, x, y );
	}
	
	this.bezierCurveTo = function( cp1x, cp1y, cp2x, cp2y, x, y ) {
		this.path.points.push( { "action" : "quadratic" , "x" : x , "y" : y , "x1" :  cp1x, "y1" : cp1y , "x2" : cp2x, "y2" : cp2y  } );
		this.ctx.bezierCurveTo( cp1x, cp1y, cp2x, cp2y, x, y ) ;
	}
	
	this.arcTo = function( x1, y1, x2, y2, radius ) {
		this.moveTo( x1 , y1 );
		this.bezierCurveTo( x1 , (y1+radius) , x2 , (y2+radius) );
		this.ctx.arcTo( x1, y1, x2, y2, radius );
	}
	
	this.arc = function( x, y, radius, startAngle, endAngle, anticlockwise ) {
		this.ctx.arc( x, y, radius, startAngle, endAngle, anticlockwise );
	}
	
	this.rect = function( x , y , width , height ) {
		this.moveTo( x , y );
		this.lineTo( x+width , y );
		this.lineTo( x+width , y+height );
		this.lineTo( x ,  y+height );
		this.lineTo( x , y );
	}
	
	this.fillRect = function( x , y , width , height )  {
		this.push();
		this.moveTo( x , y );
		this.lineTo( x+width , y );
		this.lineTo( x+width , y+height );
		this.lineTo( x ,  y+height );
		this.lineTo( x , y );
		this.fill();
		this.push();
	}
	
	this.strokeRect = function( x , y , width , height )  {
		this.push();
		this.moveTo( x , y );
		this.lineTo( x+width , y );
		this.lineTo( x+width , y+height );
		this.lineTo( x ,  y+height );
		this.lineTo( x , y );
		this.stroke();
		this.push();
	}
	
	this.save = function() {
		this.ctx.save();
	}
	
	this.restore = function() {
		this.ctx.restore();
	}
	
	this.toDataURL = function( type , args ) {
		if( type == "image/svg+xml" ) {
			return this.generateSVG();
		} else {
			return this.ctx.toDataURL( type , args );
		}
		
	}
	
	this.isPointInPath = function( x, y ) {
		return this.ctx.isPointInPath( x , y );
	}
	
	this.push = function() {
		if( this.path.points.length > 0 ) {
			var elem = {
				style : this.path.style,
				points : this.path.points,
				type : this.path.type	
			}
			this.elements.push( elem );
			this.path.points = [];
		}
	}
	 
 }