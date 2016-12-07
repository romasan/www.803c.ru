/*
 * made by romasan 2013
 */
var colors = ['#f0c', '#ff0', '#0ff', '#0f0', '#00f'],
	colors2 = {
		'#f0c' : '1.png',
		'#ff0' : '2.png',
		'#0ff' : '3.png',
		'#0f0' : '4.png',
		'#00f' : '5.png'
	}
var level = 0
//------------------------------------------------------------------------------------------
var scaling = function(i) {
	var _w = document.body.clientWidth,
		_h = document.body.clientHeight,
		SCALINGFACTOR = _w / ((_w > _h)?480:320); 
	if(typeof i == 'undefined') {return {w : _w, h : _h}}
	return i * SCALINGFACTOR;
}
var hexcolortorgb = function(c) {
	var color = c.split('#')[1]
	if(color.length == 3) {
		color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
	}
	_color = parseInt(color, 16)
	return {
		r : ((((_color / 256)|0) / 256)|0),
		g : ((_color / 256)|0) % 256,
		b : _color % 256
	}
}
var splash = function(x, y, s, f, t) {
	t = (typeof t == 'undefined') ? 0 : t;
	$('body').append(
		$('<div>')
			.css({
				position      : 'absolute',
				top           : y - 50 + 'px',
				left          : x - 150 + 'px',
				width         : '300px',
				height        : '100px',
				color         : '#fff',
				'text-shadow' : '0px 1px #000',
				'text-align'  : 'center',
				'line-height' : '100px',
				'font-size'   : '1pt',
			})
			.html(s)
			.attr({
				id : 'splash'
			})
			.animate({
				'font-size' : '27pt'
			}, function() {
				setTimeout(function() {
					$('#splash')
						.animate({
							'font-size' : '1pt'
						}, function() {
							$('#splash').remove()
							if(typeof f == 'function') {f()}
						})
				}, t)
			})
	)
}
//------------------------------------------------------------------------------------------
/*
var time = 2 * 60
var timer = function() {
	time -= 1;
	var _m = (time / 60)|0,
		_s = time % 60
		_m = (_m > 9)?_m:'0' + _m
		_s = (_s > 9)?_s:'0' + _s
	if(time > 0) {
		$('#time').html(_m + '-' + _s)
		setTimeout(function(){timer()}, 1000)
	
	} else {
		splash(scaling().w / 2, scaling().h / 2, 'score : ' + points, function(){document.location.reload()}, 1000)
	}
}
*/
//-----------------------------------------------------------------------------------------
/*
var a = 0xff, b = 0, c = 0
var points = 0
var color0 = '',
	color = ''
function randbg() {
	if(a > 0xff) {a = 0xff}
    if(b > 0xff) {b = 0xff}
    if(c > 0xff) {c = 0xff}
	var _a = ((a < 0x10)?'0':'') + (a).toString(16)
	var _b = ((b < 0x10)?'0':'') + (b).toString(16)
	var _c = ((c < 0x10)?'0':'') + (c).toString(16)
    if(a < 0) {a = 0}
    if(b < 0) {b = 0}
    if(c < 0) {c = 0}
	//alert('#' + _a + _b + _c)
	$('body').css({background : color0})
	color0 = '#' + _a + _b + _c
	color = '#' +
		(((0xff - a) < 0x10)?'0':'') + (0xff - a).toString(16) +
		(((0xff - b) < 0x10)?'0':'') + (0xff - b).toString(16) +
		(((0xff - c) < 0x10)?'0':'') + (0xff - c).toString(16)
	$('#bar').css({color : color})
	if(typeof Game.ctx != 'undefined') {
		Game.redraw()
	}
    a = parseInt(a)
    b = parseInt(b)
    c = parseInt(c)
    if(a == 0xff && b < 0xff  && c == 0   ) {b += 1}
	if(a > 0     && b == 0xff && c == 0   ) {a -= 1}
	if(a == 0    && b == 0xff && c < 0xff ) {c += 1}
	if(a == 0    && b > 0     && c == 0xff) {b -= 1}
	if(a < 0xff  && b == 0    && c == 0xff) {a += 1}
	if(a == 0xff && b == 0    && c > 0    ) {c -= 1}
	setTimeout(function(){
		randbg()
	}, 0)
}
var level = 0;
*/
//-----------------------------------------------------------------------------------------
Game = {
	name : 'points2',
	start : function() {
		this.draw();
	},
	maxg    : 5,
	maxv    : 5,
	radius  : 30,
	marginx : 10,
	marginy : 50,
	step : {},
	init : function() {
		try {
			if(typeof localStorage[this.name + 'level'] == 'undefined') {
				localStorage[this.name + 'level'] = 0
			}
			level = parseInt(localStorage[this.name + 'level'])
		} catch(e) {}
	},
	checknextstep : function(a) {
		if(
			(a.x == this.step.x     && a.y == this.step.y + 1) ||
			(a.x == this.step.x     && a.y == this.step.y - 1) ||
			(a.x == this.step.x + 1 && a.y == this.step.y    ) ||
			(a.x == this.step.x - 1 && a.y == this.step.y    )
		) {
			return true;
		}
		return false;
	},
	notin : function(a ,b) {
		for(i in b) {
			if(b[i].x == a.x && b[i].y == a.y) {
				return false
			}
		}
		return true
	},
	cur : {},
	curcolor : 0,
	addtopatch : function(a) {
		if(this.curstart == false) {
			this.curstart = {x : a.x, y : a.y}
		}
		a.color = this.map[a.y][a.x].color
		this.map[a.y][a.x].colored
		if(this.patch.length == 0 && a.color == 0) {return}
		if(this.patch.length > 0 && a.color > 0 && a.color != this.curcolor) {return}
		if(this.map[a.y][a.x].colored) {return}
		//console.log('color ', a.color)
		//console.log('addtopatch', this.patch.length)
		if(!this.m) {
			console.log('not started');
			return
		}
		//console.log(this.step)
		_l = this.patch.length
		//console.log('***', _b, this.patch, _l);
		if(_l == 0) {
			if(this.notin(a, this.patch)) {
				this.patch.push(a)
				this.step = a
				this.curcolor = this.map[a.y][a.x].color
				this.map[a.y][a.x].removed = true
				//$('#bar').html('A ' + a.y + ' ' + a.x)
			}
		} else {
			//if(this.checknextstep(a) && this.step.color == a.color) {
			if(this.checknextstep(a)) {
				if(this.notin(a, this.patch)) {	
//					console.log('*', a, this.patch.length);
					this.patch.push(a)
					this.step = a
					this.map[a.y][a.x].removed = true
					//$('#bar').html('B ' + a.y + ' ' + a.x + ' length ' + this.patch.length)
				}
			}
		}
		this.redraw()
	},
	checkpoint : function(c) {
		this.cur = {x : c.x, y : c.y}
		//if(this.curstart == false) {
		//	this.curstart = {x : c.x, y : c.y}
		//}
		//this.radius
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				_x  = this.marginx + this.radius + (this.distance + 2 * this.radius) * x
				_y  = this.marginy + this.radius + (this.distance + 2 * this.radius) * y
				//_xx = c.x - _x
				//_yy = c.y - _y
				//_rr = Math.sqrt(_xx * _xx + _yy * _yy)
				//if(this.radius >= _rr) {return {x : x, y : y}}
				if(
					c.x > _x - this.radius && c.x < _x + this.radius && 
					c.y > _y - this.radius && c.y < _y + this.radius
				) {
					return {x : x, y : y}
				}
			}
		}
		return false
	},
	m : false,
	curstart : false,
	mdown : function() {
		//if(this.map[a.y][a.x].color > 0) {
			this.m = true
			this.patch = []
			this.curcolor = 0
			this.curstart = false
		//}
	},
	//mmove : function() {
	//	point = this.checkpoint(c)
	//	if(point) {
	//		this.addtopatch(point)
	//	}
	//},
	checkwin : function() {
		var count = 0
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				if(!this.map[y][x].colored && this.map[y][x].color) {
					count += 1
				}
			}
		}
		return (count == 0)
	},
	mup : function() {
		this.m = false
		var f = false
		if(this.patch.length > 1) {
			f = (
				this.curcolor == this.patch[this.patch.length - 1].color
			// && this.cur.x != this.curstart.x
			// && this.cur.y != this.curstart.y
			)
			console.log(
				this.cur.x,
				this.cur.y,
				this.curstart.x,
				this.curstart.y
			)
		}
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				if(f && this.map[y][x].removed) {
					this.map[y][x].colored = this.curcolor
				}
				this.map[y][x].removed = false;
			}
		}
		if(this.checkwin()) {
			var _this = this,
				_f = function() {
				if(levels.length > level +1) {
					level += 1
					try{
						localStorage[_this.name + 'level'] = level
					} catch(e) {
						/*alert(e)*/
					}
				}
				Game.start()
			}
			splash(scaling().w / 2, scaling().h / 2, lang.youwin, _f, 1000)
		}
		this.patch = []
		this.redraw()
	},
	drawpoint : function(_x, _y, _c, _f, _x2, _y2) {
		var colored = false
		if(typeof _x2 != 'undefined') {
			colored = this.map[_y2][_x2].colored
		}
		if(_c > 0 || _f || colored) {} else {return}
		if(_c > 0) {
			_c -= 1
		}
		if(_f) {
			_c = this.curcolor - 1
		}
		if(colored) {
			_c = this.map[_y2][_x2].colored - 1
		}
		//--------------------
		if(colored || _f) {
			this.ctx.beginPath()
				try{
					var c = hexcolortorgb(colors[_c])
					//this.ctx.fillStyle = colors[_c]
					this.ctx.fillStyle = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.3)'
					this.ctx.rect(_x - this.radius, _y - this.radius, 2 * this.radius, 2 * this.radius);
				} catch(e) {}
			this.ctx.fill()
		}
		//--------------------
		//this.ctx.beginPath()
		var width     = Math.round(((2 * this.radius)|0)),
			height    = Math.round(((2 * this.radius)|0)),
			left      = Math.round(_x - this.radius),
			top       = Math.round(_y - this.radius),
			color     = colors[_c]
		var _this = this
		try {
			_this.ctx.drawImage(_this.pics[color], left, top, width, height)
		} catch(e) {}
		//this.ctx.stroke()
	},
	redraw : function() {
		if(this.ctx.clearRect(0, 0, scaling().w, scaling().h)) {console.log(':::')}
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				_x = this.marginx + this.radius + (this.distance + 2 * this.radius) * x
				_y = this.marginy + this.radius + (this.distance + 2 * this.radius) * y
				_c = this.map[y][x].color,
				_f = this.map[y][x].removed
				//console.log('***', _f);
				this.drawpoint(_x, _y, _c, _f, x, y)
			}
		}
	},
	draw : function() {
//		randbg()
		$('body').children().remove()
		//timer()
		this.marginx  = scaling(this.marginx)
		this.marginy  = scaling(this.marginy)
		$('#resetbut')
		this.w        = scaling().w - 2 * this.marginx
		this.h        = scaling().h - 2 * this.marginy
		//this.radius   = scaling(this.radius)
		this.maxg = levels[level][0].length
		this.radius = ((this.w / this.maxg)|0) / 2
		this.maxv = levels[level].length
		this.distance = (this.w - this.radius * 2 * this.maxg) / (this.maxg - 1)
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext("2d")
		this.canvas.width  = scaling().w
		this.canvas.height = scaling().h
		this.pics = []
		for(i in colors2) {
			this.pics[i] = new Image()
			this.pics[i].src = colors2[i]
		}
		this.map = []
		var _this = this,
			_f = function() {
				for(var y = 0; y < _this.maxv; y++) {
					_this.map[y] = []
					for(var x = 0; x < _this.maxg; x++) {
						var _x = _this.marginx + _this.radius + (_this.distance + 2 * _this.radius) * x,
							_y = _this.marginy + _this.radius + (_this.distance + 2 * _this.radius) * y,
							_c = levels[level][y][x]//(Math.random() * colors.length)|0
						_this.map[y][x] = {color : _c, removed : false, colored : false}//removed = in patch
						_this.drawpoint(_x, _y, _c)
						$('body').append(
							$('<div>')
							.css({
								position : 'absolute',
								left     : _x - _this.radius + 'px',
								top      : _y - _this.radius + 'px',
								width    : 2 *  _this.radius + 'px',
								height   : 2 *  _this.radius + 'px',
								border   : '1px dashed #fff'
							})
							.data({x : x, y : y})
							.attr({
								id : 'x_y_' + x + '_' + y,
								x : x,
								y : y, 
							})
						)
					}
				}
			}
		setTimeout(_f, 100)
		document.body.appendChild(this.canvas)
		this.debug_counter = 0
		this.debug_swipe   = true;
		//--PC
		$('body').swipe({
			swipeStatus : function(event, phase, direction, distance, duration, fingers) {
				if(event.pageX == 0) {Game.debug_swipe = false}
				if(Game.debug_swipe == false) {return}
				var _c = Game.checkpoint({x : event.pageX, y : event.pageY})
				if(phase == 'start') {
					Game.mdown({x : _c.x, y : _c.y})
				}
				if(_c){
					Game.addtopatch({x : _c.x, y : _c.y})
				}
				if(phase == 'end') {
					Game.mup()
				}
			}
		})
		//--phone
		document.body.addEventListener('touchstart', function(e) {
			//var _c = Game.checkpoint({x : touch.pageX, y : touch.pageY})
			Game.mdown()
			//Game.mdown({x : _c.x, y : _c.y})
		})
		document.body.addEventListener('touchmove', function(e) {
			var touch = event.targetTouches[0]
			var _c = Game.checkpoint({x : touch.pageX, y : touch.pageY})
			if(_c){
				Game.addtopatch({x : _c.x, y : _c.y})
			}
		})
		document.body.addEventListener('touchend', function(e) {
			Game.mup()
		})
		$('body').append(
			$('<div>')
				.css({
					position      : 'absolute',
					top           : (scaling(3)|0)  + 'px',
					left          : (scaling(10)|0) + 'px',
					width         : '100%',
					height        : '50px',
					color         : '#fff',
					'font-size'   : (scaling(16)|0) + 'pt',
					'text-shadow' : '0px 1px #000'
				})
				.attr({id : 'bar'})
				//.append('points : ')
				//.append($('<span>').attr({id : 'points'}).html('0'))
				.append(' level : ')
				.append($('<span>').attr({id : 'level'}).html(level + 1))
		
		)
		$('body').append(
			$('<div>')
				.attr({id : 'resetbut'})
				.click(function(){
					document.location.reload()
				})
				.css({
					width  : this.marginy + 'px',
					height : this.marginy + 'px'
				})
		)
	}
}
//-----------------------------------------------------------------------------------------
$(document).ready(function(){
	Game.init();
	Game.start();
});