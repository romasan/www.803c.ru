
     

var a = {
		x : 76,
		y : 293
	}
var b = {
		x : 202,
		y : 209
	}
var c = {
		x : 116,
		y : 241,
		r : 3
	}
var l = ( (b.y - a.y) * c.x + (a.x - b.x) * c.y ) / Math.sqrt( (b.y - a.y)*(b.y - a.y) + (a.x - b.x)*(a.x - b.x) )