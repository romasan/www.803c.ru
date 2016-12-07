var POINTS = 0,
	BUTTONSIZE = 100,
	levels = [];
//----------------------------------------------------------------------------------------
function scaling(i) {
	//if(typeof SCALINGFACTOR == 'undefined') {
	var _w = document.body.clientWidth,
		_h = document.body.clientHeight,
		SCALINGFACTOR = _w / ((_w > _h)?480:320); 
	//}
	return i * SCALINGFACTOR;
}
function splash(x, y, s, f, t) {
	t = (typeof t == 'undefined') ? 1000 : t;
	$('body').append(
		$('<div>')
			.css({
				position      : 'absolute',
				top           : y - 50 + 'px',
				left          : x - 150 + 'px',
				'text-align'  : 'center',
				width         : '300px',
				height        : '100px',
				'line-height' : '100px',
				'font-size'   : '1pt',
				'text-shadow' : '0px 1px #fff'
			})
			.html(s)
			.attr({id : 'splash'})
			.animate({
				'font-size' : '27pt'
			}, function() {
				setTimeout(function() {
					$('#splash')
						.animate({
							'font-size' : '1pt'
						}, function() {
							$('#splash').remove();
							if(typeof f == 'function') {f();}
						})
				}, t);
			})
	);
}
//----------------------------------------------------------------------------------------
function o(){}
o.prototype.move = function() {
	$(this.el).css({
		left   : this.l,
		bottom : this.b
	});
}
//-----------------------------------------------------------------------------------------
map.o = false;
function map(g, v) {}
//-----------------------------------------------------------------------------------------
cube.colors = 5;
function cube(a) {
	this.debug = false;
	if(typeof a == 'undefined') {return;}
	if(
		typeof a.g == 'undefined' ||
		typeof a.v == 'undefined'
		//typeof a.type == 'undefined'
	) {return;}
	//this.size  = Game.w / (Game.g + Game.audience);
	this.type  = (typeof a.type  == 'undefined')?(a.g >= 0 && a.g < Game.g && a.v >= 0 && a.v < Game.v)?'in':'out':a.type;
	this.color = (typeof a.color == 'undefined')?(Math.random() * cube.colors)|0:a.color;
	this.g = a.g;
	this.v = a.v;
	this.removed = false;
	this.gvtocoord();
	if(typeof a.direction == 'undefined') {
		this.direction = 'none';
		if(this.type == 'out') {
			if(a.g < 0)       this.direction = 'right';
			if(a.g >= Game.g) this.direction = 'left';
			if(a.v < 0)       this.direction = 'down';
			if(a.v >= Game.v) this.direction = 'up';
		}
		if(this.type == 'in') {
			this.direction = 'none';
		}
	} else {
		this.direction = a.direction;
	}
	/*
	alert(
//		Game.w + ' / (' + Game.g + ' + ' + Game.audience + ')'
		'left   : ' + this.x    + 'px\n' +
		'top    : ' + this.y    + 'px\n' +
		'width  : ' + cube.size + 'px\n' +
		'height : ' + cube.size + 'px'
	);
	*/
	this.cubeid = (this.type == 'out')?(typeof Game.cubes.length == 'undefined')?0:Game.cubes.length:'z';
	this.el = $('<div>')
		.addClass('el cube')
		.addClass('color' + this.color)
		.data({cubeid : this.cubeid})
		.css({
			left   : this.x    + 'px',
			top    : this.y    + 'px',
			width  : cube.size + 'px',
			height : cube.size + 'px'
		})
		.html(
			$('<div>')
				.addClass('arrow')
				.addClass('direction_' + this.direction)
				//.html(this.g+' '+this.v)
		);
	$(Game.map).append(this.el);
	if(typeof a.debug != 'undefined') {
		console.log('constructor ', this.v, this.g, a.v, a.g, this.type, this.direction);
	}
}
cube.prototype.match3 = function(a) {
	for(var y = 0; y < Game.v - 1;y++) {
		for(var x = 0; x < Game.g - 1;x++) {
			//##
			//#
			if(
				typeof Game.cubemap[y][x]     != 'undefined' &&
				typeof Game.cubemap[y][x + 1] != 'undefined' &&
				typeof Game.cubemap[y + 1][x] != 'undefined'
			) if(
				Game.cubemap[y][x].color     == Game.cubemap[y][x + 1].color &&
				Game.cubemap[y][x + 1].color == Game.cubemap[y + 1][x].color
			) {
				Game.cubemap[y][x].removed     = true;
				Game.cubemap[y][x + 1].removed = true;
				Game.cubemap[y + 1][x].removed = true;
			}
			//##
			// #
			if(
				typeof Game.cubemap[y][x]         != 'undefined' &&
				typeof Game.cubemap[y][x + 1]     != 'undefined' &&
				typeof Game.cubemap[y + 1][x + 1] != 'undefined'
			) if(
				Game.cubemap[y][x].color     == Game.cubemap[y][x + 1].color &&
				Game.cubemap[y][x + 1].color == Game.cubemap[y + 1][x + 1].color
			) {
				Game.cubemap[y][x].removed         = true;
				Game.cubemap[y][x + 1].removed     = true;
				Game.cubemap[y + 1][x + 1].removed = true;
			}
			//#
			//##
			if(
				typeof Game.cubemap[y][x]         != 'undefined' &&
				typeof Game.cubemap[y + 1][x]     != 'undefined' &&
				typeof Game.cubemap[y + 1][x + 1] != 'undefined'
			) if(
				Game.cubemap[y][x].color     == Game.cubemap[y + 1][x].color &&
				Game.cubemap[y + 1][x].color == Game.cubemap[y + 1][x + 1].color
			) {
				Game.cubemap[y][x].removed         = true;
				Game.cubemap[y + 1][x].removed     = true;
				Game.cubemap[y + 1][x + 1].removed = true;
			}
			// #
			//##
			if(
				typeof Game.cubemap[y][x + 1]     != 'undefined' &&
				typeof Game.cubemap[y + 1][x]     != 'undefined' &&
				typeof Game.cubemap[y + 1][x + 1] != 'undefined'
			) if(
				Game.cubemap[y][x + 1].color == Game.cubemap[y + 1][x].color &&
				Game.cubemap[y + 1][x].color == Game.cubemap[y + 1][x + 1].color
			) {
				Game.cubemap[y][x + 1].removed     = true;
				Game.cubemap[y + 1][x].removed     = true;
				Game.cubemap[y + 1][x + 1].removed = true;
			}
		}
	}
	//###
	for(var y = 2; y < Game.v;y++) {
		for(var x = 2; x < Game.g;x++) {
			if(
				typeof Game.cubemap[y][x]     != 'undefined' &&
				typeof Game.cubemap[y][x - 1] != 'undefined' &&
				typeof Game.cubemap[y][x - 2] != 'undefined'
			) {
				/*
				console.log(
					Game.cubemap[y][x].color,
					Game.cubemap[y][x - 1].color,
					Game.cubemap[y][x - 2].color
				)
				*/
				if(
					Game.cubemap[y][x].color     == Game.cubemap[y][x - 1].color && 
					Game.cubemap[y][x - 1].color == Game.cubemap[y][x - 2].color
				) {
					console.log('match3g');
					Game.cubemap[y][x].removed     = true;
					Game.cubemap[y][x - 1].removed = true;
					Game.cubemap[y][x - 2].removed = true;
				}
			}
		}
	}
	//#
	//#
	//#
	for(var x = 2; x < Game.g;x++) {
		for(var y = 2; y < Game.v;y++) {
			if(
				typeof Game.cubemap[y][x]     != 'undefined' &&
				typeof Game.cubemap[y - 1][x] != 'undefined' &&
				typeof Game.cubemap[y - 2][x] != 'undefined'
			) {
				if(
					Game.cubemap[y][x].color     == Game.cubemap[y - 1][x].color && 
					Game.cubemap[y - 1][x].color == Game.cubemap[y - 2][x].color
				) {
					console.log('match3v');
					Game.cubemap[y][x].removed     = true;
					Game.cubemap[y - 1][x].removed = true;
					Game.cubemap[y - 2][x].removed = true;
				}
			}
		}
	}
	for(y in Game.cubemap) {
		for(x in Game.cubemap[y]) {
			if(Game.cubemap[y][x].removed) {
				$(Game.cubemap[y][x].el).remove();
				delete Game.cubemap[y][x];
			}
		}
	}
}
cube.prototype.correctstep = function(a) {
	switch(a.direction) {
		case 'left':
			if(typeof Game.cubemap[a.v][a.g - 1] != 'undefined') {
				return false
			}
			for(var g = Game.g - 1 ;g >= 0;g--) {
				if(typeof Game.cubemap[a.v][g] != 'undefined') {
					return {x : g + 1, y : a.v}
				}
			}
			return false;
			break;
		case 'right':
			if(typeof Game.cubemap[a.v][a.g + 1] != 'undefined') {
				return false
			}
			for(var g = 0;g < Game.g;g++) {
				if(typeof Game.cubemap[a.v][g] != 'undefined') {
					return {x : g - 1, y : a.v}
				}
			}
			return false;
			break;
		case 'up':
			if(typeof Game.cubemap[a.v - 1][a.g] != 'undefined') {
				return false
			}
			for(var v = Game.v - 1 ;v >= 0;v--) {
				if(typeof Game.cubemap[v][a.g] != 'undefined') {
					return {x : a.g, y : v + 1}
				}
			}
			return false;
			break;
		case 'down':
			if(typeof Game.cubemap[a.v + 1][a.g] != 'undefined') {
				return false
			}
			for(var v = 0;v < Game.v;v++) {
				if(typeof Game.cubemap[v][a.g] != 'undefined') {
					return {x : a.g, y : v - 1}
				}
			}
			return false;
			break;
	}
}
cube.prototype.gvtocoord = function() {
	this.x = this.g * cube.size + cube.l + cube.size * Game.audience;
	this.y = this.v * cube.size + cube.l + cube.size * Game.audience + cube.t;
}
cube.prototype.click = function() {
	//alert('boobs ' + $(this.el).data('cubeid'));
	var _g = this.g;
	var _v = this.v;
	if(_g == -1 || _g == Game.g || _v == -1 || _v == Game.v) {
		var step = this.correctstep({g  :_g, v : _v, direction : this.direction});
		if(step) {
			//alert(step.x + ' ' + step.y);
			var _g = this.g;
			var _v = this.v;
			this.g = step.x;
			this.v = step.y;
			this.gvtocoord();
			this.move();
			this.type = 'in';
			var _id = this.cubeid;
			delete Game.cubes[_id];
			this.cubeid = 'z';
			$(this.el).data({
				cubeid : this.cubeid
			});
			Game.cubemap[step.y][step.x] = this;
			this.conveyor({
				g         : _g,
				v         : _v,
				direction : this.direction,
				id        : _id
			});
			this.match3();
			this.go();
			if(this.iswin()) {
				this.splash(GAMEWIDTH / 2, GAMEHEIGHT / 2, lang.youwin, function() {
					document.location.reload();
				}, 1000);
			}
		}
		//alert('boobs ' + this.g + ' ' + this.v + ' ' + this.direction);
	}
}
cube.prototype.go = function() {
	console.log('go');
	var count = 0;
	var _x = 0;
	var _y = 0;
	for(var y = 0; y < Game.v;y++) {
		for(var x = 0; x < Game.g;x++) {
			if(typeof Game.cubemap[y][x] != 'undefined') {
				
				var _el = Game.cubemap[y][x];
				if(_el.direction != 'none') {
					switch(Game.cubemap[y][x].direction) {
						case 'left'  :	
							_x = -1;
							_y = 0;
							break;
						case 'right' :
							_x = 1;
							_y = 0;
							break;
						case 'up'    :
							_x = 0;
							_y = -1;
							break;
						case 'down'  :
							_x = 0;
							_y = 1;
							break;
					}
					if(
						x > ((_x > 0)?-1:0)         &&
						x < Game.g - ((_x > 0)?1:0) &&
						y > ((_y > 0)?-1:0)         &&
						y < Game.v - ((_y > 0)?1:0)
					) {
						if(typeof Game.cubemap[y + _y][x + _x] == 'undefined') {
							count += 1;
							console.log('>', y + ' ' + x + ' ' + _el.direction + ' ' + (y + _y) + ' ' + (x + _x), _y, _x);
							
							
							//$(Game.cubemap[y + _y][x + _x].el)	
							//	.html(y + ' ' + x);
							_el.g = (x + _x);
							_el.v = (y + _y);
							$(_el.el)
								.data({
									'x' : x + _x,
									'y' : y + _y
								});
							Game.cubemap[y + _y][x + _x] = Game.cubemap[y][x];
							Game.cubemap[y + _y][x + _x].debug = true;
							delete Game.cubemap[y][x];
						}
					}
				}
			}
		}
	}
	if(count > 0) {
		console.log('A ' + count);
		this.go();
	}
	for(var y = 0; y < Game.v; y++) {
		for(var x = 0; x < Game.g; x++) {
			if(typeof Game.cubemap[y][x] != 'undefined') {
				var _el = Game.cubemap[y][x];
				console.log('ok1 ', y, x, Game.cubemap[y][x].v, Game.cubemap[y][x].g, Game.cubemap[y][x].y, Game.cubemap[y][x].x, Game.cubemap[y][x].debug);
				Game.cubemap[y][x].debug = false;
				Game.cubemap[y][x].gvtocoord();
				Game.cubemap[y][x].move();
			}
		}
	}
	//}
}
cube.prototype.iswin = function() {
	for(y in Game.cubemap) {
		for(x in Game.cubemap[y]) {
			if(typeof Game.cubemap[y][x] != 'undefined') {
				return false;
			}
		}
	}
	return true;
}
cube.prototype.findindex = function(a) {
	//console.group('boobs');
	for(i in Game.cubes) {
		if(typeof Game.cubes[i] != 'undefined') {
			//console.log(Game.cubes[i].g, Game.cubes[i].v, a.g, a.v);
			if(
				Game.cubes[i].g == a.g &&
				Game.cubes[i].v == a.v
			) {
				//console.groupEnd();
				return i;
			}
		}
	}
	//console.groupEnd();
	return -1;
}
cube.prototype.conveyor = function(a) {
	for(var i = 1; i < Game.audience;i++) {
		//console.log('boobs', a.direction == 'left', Game.audience);
		
		var _g, _v, _l, _t;
		switch(a.direction) {
			case 'left':
				_g = a.g + i;
				_v = a.v;
				_l = -1;
				_t = 0;
				break;
			case 'right':
				_g = a.g - i;
				_v = a.v;
				_l = 1;
				_t = 0;
				break;
			case 'up':
				_g = a.g;
				_v = a.v + i;
				_l = 0;
				_t = -1;
				break;
			case 'down':
				_g = a.g;
				_v = a.v - i;
				_l = 0;
				_t = 1;
				break;
		}
		var _i = this.findindex({g : _g, v : _v});
		if(_i >= 0) {
			var _el = Game.cubes[_i];
			_el.g += _l;
			_el.v += _t;
			$(_el.el).data({g : _el.g, v : _el.v});
			_el.gvtocoord();
			_el.move();
		} else {console.log('unknown id');}
		if(i == Game.audience - 1) {
			//Game.cubes.push(new cube({g : a.g - i * _l, v : a.v - i * _t}));
		}
	}
	var _g = a.g + ((a.direction == 'right')?-1:(a.direction == 'left')?1:0) * (Game.audience - 1);
	var _v = a.v + ((a.direction == 'down')?-1:(a.direction == 'up')?1:0) * (Game.audience - 1);
	Game.cubes.push(new cube({g : _g, v : _v}));
}
cube.prototype.move = function(c) {
	$(this.el).animate({
		left : this.x + 'px',
		top  : this.y + 'px'
	});
}
function cubelog() {
	for(y in Game.cubemap) {
		for(x in Game.cubemap[y]) {
			if(typeof Game.cubemap[y][x] != 'undefined') {
				console.log(
					'log: ',
					y,
					x,
					Game.cubemap[y][x].direction,
					Game.cubemap[y][x].type,
					Game.cubemap[y][x].v,
					Game.cubemap[y][x].g
				);
			}
		}
	}
}
//-----------------------------------------------------------------------------------------
Game.map = '#map';
Game.audience = 1;
Game.g = 6;
Game.v = 8;
Game.cubes = [];
Game.cubemap = [];
Game.o = false;
function Game(a) {
	if(Game.o) {
		return;
	} else {
		Game.o = true;
	}
	this.name = "colorcubes";
	this.init();
	this.draw();
}
Game.prototype.init = function() {
	if(typeof a != 'undefined') {
		this.g = (typeof a.g === 'undefined')?Game.g:a.g;
		this.v = (typeof a.v === 'undefined')?Game.v:a.v;
	}
	this.screen = {
		w : document.body.clientWidth,
		h : document.body.clientHeight
	}
	cube.l = scaling(10);
	cube.t = scaling(30);
	Game.w = this.screen.w - cube.l * 2;
	cube.size = Game.w / (Game.g + Game.audience * 2);
	var params = ['level', 'points'];
	for(i in params) {
		if(typeof localStorage[this.name + params[i]] == 'undefined') {
			localStorage[this.name + params[i]] = 0;
		}
	}
	//this.cubes = [];
}
Game.prototype.draw = function() {
	$('#startscreen').click(function() {
		$('#screen').show();
		$(this).hide();
	});
	$('#screen').css({
		width  : this.screen.w + 'px',
		height : this.screen.h + 'px'
	});
	$('#map')
		.html('')
		.css({
			width  : this.screen.w + 'px',
			height : this.screen.h + 'px',
			top    : '0px'
		});
	var _this = this,
		_f = function() {
			_this.start()
		}
	$('startbutton').click(_f);
	for(var v = -Game.audience;v < Game.v + Game.audience;v++) {
		for(var g = -Game.audience;g < Game.g + Game.audience;g++) {
			if(
				(g < 0 || g >= Game.g || v < 0 || v >= Game.v) &&
				!(
					(g < 0       && v < 0) ||
					(g >= Game.g && v < 0) ||
					(g < 0       && v >= Game.v) ||
					(g >= Game.g && v >= Game.v)
				)
			) {
				Game.cubes.push(new cube({'g' : g, 'v' : v}));
			}
		}
	}
	var _n = 1 + (Math.random() * (Game.g + Game.v) / 2)|0;
	var _a = [];
	for(var i = 0; i < _n;i++) {
		var _x = (Math.random() * Game.g)|0;
		var _y = (Math.random() * Game.v)|0;
		var _index = '_' + _x + '_' + _y;
		if(typeof _a[_index] == 'undefined') {
			_a[_index] = {x : _x, y : _y}
		} else {
			i--;
		}
	}
	for(var _v = 0;_v < Game.v;_v++) {Game.cubemap[_v] = [];}
	for(i in _a) {
		var _x = _a[i].x,
			_y = _a[i].y
		//console.log('random>', _y, _x);
		//TODO лог кубов на поле (вернуть значение n)
		Game.cubemap[_y][_x] = new cube({'g' : _x, 'v' : _y});
		var _l = Game.cubes.length - 1;
		//Game.cubemap[_y][_x] = Game.cubes[_l];
	}
	/*
	for(i in Game.cubes) {
	console.log('N');
		var _g = Game.cubes[i].g;
		var _v = Game.cubes[i].v;
		if(_v >= 0 && _v < Game.v && _g >= 0 && _g < Game.g) {
			console.log(_v, _g);
			Game.cubemap[_v][_g] = Game.cubes[i];
		}
	}
	*/
	_f = function() {
		//$(this).html('boobs');
		var _id = $(this).data('cubeid');
		//console.log(_id);
		if(_id != 'z') {
			Game.cubes[_id].click();
		}
	}
	$('#map').delegate('.cube', 'click', _f);
}
Game.prototype.start = function() {
	//this.draw();
	$('#screen').show();
	$('#startscreen').hide();
}
Game.prototype.win = function() {
	debug.stoprepeater = true;
	clearTimeout(Game.repeatmotionf);
	//localStorage[this.gamename + 'level']
	localStorage[Game.gamename + 'level'] = 
		parseInt(localStorage[Game.gamename + 'level']) + 1;
	localStorage[Game.gamename + 'points'] = POINTS;
	this.splash(GAMEWIDTH / 2, GAMEHEIGHT / 2, lang.youwin, function() {
		document.location.reload();
	}, 1000);
}
Game.prototype.over = function() {
	debug.stoprepeater = true;
	clearTimeout(Game.repeatmotionf);
	$('#hero')
		//.addClass('herod')
		//.css({
		//	'background-size' : '100% 100%'
		//})
		.animate({
			bottom : '+=15px',
		}).animate({
			bottom : '0px',
		});
	
	splash(this.screen.w / 2, this.screen.h / 2, lang.gameover, function() {
		document.location.reload();
	}, 1000);
}
//----------------------------------------------------------------------------------------
$(document).ready(function() {
	new Game();
});