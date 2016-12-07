var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
	var SIZES = {
		point     : 15,
		ball      : 0,
		pointsbar : 20,
		margin    : {
			x : 10,
			firstx : 10,
			y : 10
		},
		box       : 400,
		hexagon : {
			width  : 216,
			height : 249,
			top    : 190
		},
		cursor      : {
			size : 128,
			left : 44,
			top  : 60
		}
	}
	var WALL   = 1,
		EMPTY  = 0,
		BALL   = 2,
		FILL   = 3;
	var levels = [];
	
	var N,
	  W,  E,
		S;
	N = 1;
	W = 2;
	E = 3;
	S = 4;

	var Game = {
		width      		: 0,//9 | 7
		height     		: 0,//6 | 9
		//objectsnum 		: 5,//6
		up				: false,
		map : [],
		lamps : [],
		lampspatch : [],
		logmap : function(){// выводит первоначальный массив в консоль
			for(y in this.map) {
				var str = "";
				for(x in this.map[y]) {
					str += this.map[y][x] + ' ';
				}
				console.log(str);
			}
		},

		logarr2 : function(a){// выводит в консоль двумерный массив
			for(i in a) {
				var str = "";
				for(j in a[i]) {
					str += a[i][j] + ' ';
				}
				console.log(str);
			}
		},
		getlamp : function(x, y) {
			//console.log(x + ' ' + y);
			if(y < 0 || y > this.lamps.length - 1) {
				return 0;
			} else if(x < 0 || x > this.lamps[y].length - 1) {
				return 0;
			}
			return this.lamps[y][x];
		},
		iscorrect : function() {
			var a, b,
				c, d,
				e, f;
			for(y in this.lamps) {
				var even_y = ( y % 2 );
				for(x in this.lamps[y]) {
					var even_x = ( x % 2 );
					var _x = parseInt(x);
					var _y = parseInt(y);
					a = this.getlamp(_x, _y);
					b = this.getlamp(_x + 1, _y);
					c = this.getlamp(_x, _y + 1);
					d = this.getlamp(_x + 1, _y + 1);
					e = this.getlamp(_x, _y + 2);
					f = this.getlamp(_x + 1, _y + 2);
					if(
						(a == b && b == d && d == 1 && even_y === 0) ||
						(b == c && c == d && d == 1 && even_y === 1) ||
						(b == c && c == f && f == 1 && even_y === 1) ||
						(a == c && c == e && e == 1 && even_y === 1) ||
						(a == c && c == d && d == e && e == 1)
					) {
						console.log( 'a ' + (a == b && b == d && d == 1 && even_y === 0) );
						console.log( 'b ' + (b == c && c == d && d == 1 && even_y === 1) );
						console.log( 'c ' + (b == c && c == f && f == 1 && even_y === 1) );
						console.log( 'd ' + (a == c && c == e && e == 1 && even_y === 1) );
						console.log( 'e ' + (a == c && c == d && d == e && e == 1) );
						return false;
					}
				}
			}
			return true;
		},
		lamparoundbox : function(_x, _y) {
			var _a,
			  _b, _c,
				_d;
			_a = Game.lamps[_y * 2][_x];
			_b = Game.lamps[_y * 2 + 1][_x];
			_c = Game.lamps[_y * 2 + 1][_x + 1];
			_d = Game.lamps[_y * 2 + 2][_x];
			return _a + _b + _c + _d;
		},

		emptyaround : function(c) {
			var x = parseInt(c.x);
			var y = parseInt(c.y);
			var a, b,
			   c,   d,
			    e, f;
			var even = (c.y % 2 === 0);
			a = even
				? (y > 0)
					? (Game.map[y - 1][x] == EMPTY)
						? true
						: false
					: false
				: (y > 0 && x > 0)
					? (Game.map[y - 1][x - 1] == EMPTY)
						? true
						: false
					: false;
			b = even
				? (y > 0)
					? (Game.map[y - 1][x + 1] == EMPTY)
						? true
						: false
					: false
				: (y > 0 && x < Game.map[y].length - 1)
					? (Game.map[y - 1][x] == EMPTY)
						? true
						: false
					: false;
			c = (x > 0)
					? (Game.map[y][x - 1] == EMPTY)
						? true
						: false
					: false;
			d = (x < Game.map[y].length - 1)
					? (Game.map[y][x + 1] == EMPTY)
						? true
						: false
					: false;
			e = even
				? (y < Game.map.length - 1)
					? (Game.map[y + 1][x] == EMPTY)
						? true
						: false
					: false
				: (y < Game.map.length - 1)
					? (Game.map[y + 1][x - 1] == EMPTY)
						? true
						: false
					: false;
			f = even
				? (y < Game.map.length - 1)
					? (Game.map[y + 1][x + 1] == EMPTY)
						? true
						: false
					: false
				: (y < Game.map.length - 1 && x < Game.map[y].length - 1)
					? (Game.map[y + 1][x] == EMPTY)
						? true
						: false
					: false;
			return {
				'a' : a,
				'b' : b,
				'c' : c,
				'd' : d,
				'e' : e,
				'f' : f			}
		},
		lamponbox : function(c) {
			var _x,_y;
			_x = parseInt(c.x);
			_y = parseInt(c.y);
			var even_y = ( _y % 2 );
			if(even_y == 0) {//horizontally
				var _y0, _y1;
				_y0 = (_y / 2 - 1);
				_y1 = (_y / 2);
				if(_y0 > 0) {
					console.log('---01', _x, _y1);
					if( this.lamparoundbox(_x, _y0) > this.map[_y0][_x] && 
					this.map[_y0][_x] > 0) {
						console.log('---1');
						return false
					}
				}
				if(_y1 < this.map.length) {
					if( this.lamparoundbox(_x, _y1) > this.map[_y1][_x] && this.map[_y1][_x] > 0 ) {
					console.log('---2');
						return false
					}
				}
			} else {//vertically
				var _x0, _x1, _yy;
				_yy = _y/2|0;
				_x0 = _x - 1;
				_x1 = _x;
				if(_x0 >= 0) {
					if( this.lamparoundbox(_x0, _yy) > this.map[_yy][_x0] && this.map[_yy][_x0] > 0) {
						console.log('---3');
						return false
					}
				}
				if(_x1 < Game.map[_yy].length) {
					if( this.lamparoundbox(_x1, _yy) > this.map[_yy][_x1] && this.map[_yy][_x1] > 0) {
						console.log('---4');
						return false
					}
				}
			}
			return true;
		},
		checklampscountaround : function() {
			//console.group('lamps around');
			for(y in Game.map) {
				for(x in Game.map[y]) {
					if(Game.map[y][x] > 0) {
						var _x,_y;
						_x = parseInt(x);
						_y = parseInt(y);

						var count = Game.lamparoundbox(_x ,_y);;
						if(count !== Game.map[_y][_x]) {
							return false;
						}
					}
				}
			}
			//console.groupEnd()
			return true;
		},
// fixfix
		lamp : {
			horizontally : function(c) {
				return ( c.direction === E || c.direction === W );
			},
//			upright : function(c) {
//				return ( c.direction === N || c.direction === S );
//			},
			NE : function(c) {
				if( Game.lamp.horizontally(c) ) {
					if(c.y === 0) {return false;}
					console.log(c.y - 1, c.x + 1)
					if(Game.lamps[c.y - 1][c.x + 1] === 0) {return false;}
				} else {
					if(c.x == Game.lamps[c.y].length - 1) {return false;}
					if(Game.lamps[c.y - 1][c.x] === 0) {return false;}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x + 1):(c.x) ),
					y : c.y - 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?N:E )
				}
			},

			E : function(c) {//only for gorisontale
				if(c.x === Game.lamps[c.y].length - 1) {return false;}
				if(Game.lamps[c.y][c.x + 1] === 0) {return false;}
				return {
					x : c.x + 1,
					y : c.y,
					direction : E
				}
			},
			SE : function(c) {
				if( Game.lamp.horizontally(c) ) {
					if(c.y === Game.lamps.length - 1) {return false;}
					if(Game.lamps[c.y + 1][c.x + 1] === 0) {return false;}
				} else {
					if(c.x === Game.lamps[c.y].length - 1) {return false;}
					if(Game.lamps[c.y + 1][c.x] === 0) {return false}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x + 1):(c.x) ),
					y : c.y + 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?S:E )
				}
			},
			S : function(c) {//only for vertically
				if(c.y === Game.lamps.length - 2) {return false;}
				if(Game.lamps[c.y + 2][c.x] == 0) {return false;}
				console.log('line 174:' + Game.lamps[c.y][c.x + 2], c.y + 2, c.x);
				return {
					x : c.x,
					y : c.y + 2,
					direction : S
				}
			},
			SW : function(c) {
				console.log('i\'m here', c.x, c.y, ( ( Game.lamp.horizontally(c) === true )?S:W ));
				if( Game.lamp.horizontally(c) ) {
					if(c.y === Game.lamps.length - 1) {return false;}
					if(Game.lamps[c.y + 1][c.x] === 0) {return false;}
				} else {
					if(c.x === 0) {return false;}
					if(Game.lamps[c.y + 1][c.x - 1] === 0) {return false}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x):(c.x - 1) ),
					y : c.y + 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?S:W )
				}
			},
			W : function(c) {//only for gorisontale
				if(c.x === 0) {return false;}
				if(Game.lamps[c.y][c.x - 1] === 0) {return false;}
				return {
					x : c.x - 1,
					y : c.y,
					direction : W
				}
			},
			NW : function(c) {
				if( Game.lamp.horizontally(c) ) {
					if(c.y === 0) {return false;}
					if(Game.lamps[c.y - 1][c.x] === 0) {return false;}
				} else {
					if(c.x == 0) {return false;}
					if(Game.lamps[c.y - 1][c.x - 1] === 0) {return false;}
				}
				return {
					x : ( ( Game.lamp.horizontally(c) === true )?(c.x):(c.x - 1) ),
					y : c.y - 1,
					direction : ( ( Game.lamp.horizontally(c) === true )?N:W )
				}
			},
			N : function(c) {//only for vertically
				if(c.y === 1) {return false;}
				if(Game.lamps[c.y - 2][c.x] === 0) {return false;}
				return {
					x : c.x,
					y : c.y - 2,
					direction : N
				}
			}
		},
		checkpatch : function() {
			var c0 = 0;
			var c = 0;
			var lcount = 0;
			patchcount = 0;
			for(y in Game.lamps){
				for(x in Game.lamps[y]){
					if(Game.lamps[y][x] === 1) {
						lcount++;
						if(c0 === 0) {
							c0 = {
								'x' : parseInt(x),
								'y' : parseInt(y)
							}
							c = {
								'x' : parseInt(x),
								'y' : parseInt(y)
							}
						}
					}
				}
			}
			//Game.initlampspatch();
			
			// первый шаг так и так чётный
			// идём по часовой стрелке
			// lamp.NE(c)
			// lamp.E(c)
			// lamp.SE(c)
			
			
			c.direction = E;
			var count = 0;
			console.log('__direction0__', c.direction, count);
			c = Game.lamp.NE(c)
				? Game.lamp.NE(c)
				: Game.lamp.E(c)
					? Game.lamp.E(c)
					: Game.lamp.SE(c)
						? Game.lamp.SE(c)
						: false;
			if(!c){return false;}
			count++;
			console.log('__direction__', c.direction, count);
			console.log(c);
			console.log(c0);
			while( !(c.x == c0.x && c.y == c0.y) ) {
				//var even_y = ( c.y % 2 );
				//if( even_y === 1 ) {
				//	// --
				//} else {
				//	// |
				//}
				switch(c.direction) {
					case N :
						c = Game.lamp.NW(c)
							? Game.lamp.NW(c)
							: Game.lamp.N(c)
								? Game.lamp.N(c)
								: Game.lamp.NE(c)
									? Game.lamp.NE(c)
									: false;
						break;
					case E :
						c = Game.lamp.NE(c)
							? Game.lamp.NE(c)
							: Game.lamp.E(c)
								? Game.lamp.E(c)
								: Game.lamp.SE(c)
									? Game.lamp.SE(c)
									: false;
						break;
					case S :
						c = Game.lamp.SW(c)
							? Game.lamp.SW(c)
							: Game.lamp.S(c)
								? Game.lamp.S(c)
								: Game.lamp.SE(c)
									? Game.lamp.SE(c)
									: false;
						break;
					case W :
						c = Game.lamp.NW(c)
							? Game.lamp.NW(c)
							: Game.lamp.W(c)
								? Game.lamp.W(c)
								: Game.lamp.SW(c)
									? Game.lamp.SW(c)
									: false;
						break;
				}
				console.log('direction', c.direction);
				if(!c){return false;}
				count++;
			}
			c.count = count;
			return c;
		},
		move : function(c) {
			var even = (c.y % 2 === 0);
			var w = ( SIZES.hexagon.width / SIZES.hexagon.height * SIZES.ball );
			var _ml = ( SIZES.ball / SIZES.hexagon.height * SIZES.cursor.left );
			var _mt = ( SIZES.ball / SIZES.hexagon.height * SIZES.cursor.top );
			var _l = ( SIZES.margin.x + (w * c.x) ) + (even?(w / 2):0) + _ml;
			var _t = (SIZES.hexagon.top / SIZES.hexagon.height * SIZES.ball ) * c.y + _mt;
			
			$('#ball').animate({
				left : _l + 'px',
				top  : _t + 'px'
			}, 100);
		},
		iswin : function(c) {
			console.log('iswin');
			var l = Game.emptyaround(c);
			if(l.a || l.b || l.c || l.d || l.e || l.f) {
				//return false;
			} else {
				var count = 0;
				for(y in Game.map) {
					for(x in Game.map[y]) {
						if(Game.map[y][x] === EMPTY) {
							count++;
						}
					}
				}
				if(count === 0) {
					this.win();
					//return true;
				} else {
					
					this.gameover();
					//return false;
				}
			}
			//return false;
		},
//fixfix1
		runnw : function(c, count) {//count = 0
			if(typeof(count) === 'undefined') {count = 0}
			console.log('_a_');
			var even = (c.y % 2) == 0;
			Game.map[c.y][c.x] = FILL;
			$('#x_y_' + c.x + '_' + c.y).addClass('fill');
			if(Game.emptyaround(c).a) {
				Game.runnw({
					x : even?c.x:(c.x - 1),
					y : c.y - 1
				}, ++count)
			} else {
				console.log('nw', count, c);
				Game.move(c);
				Game.drawarrows(c);
				Game.iswin(c);
			}
		},
		runne : function(c, count) {
			if(typeof(count) === 'undefined') {count = 0}
			console.log('_b_');
			var even = (c.y % 2) == 0;
			Game.map[c.y][c.x] = FILL;
			$('#x_y_' + c.x + '_' + c.y).addClass('fill');
			if(Game.emptyaround(c).b) {
				Game.runne({
					x : even?(c.x + 1):c.x,
					y : c.y - 1
				}, ++count)
			} else {
				console.log('ne', count, c);
				Game.move(c);
				Game.drawarrows(c);
				Game.iswin(c);
			}
		},
		runw  : function(c, count) {
			if(typeof(count) === 'undefined') {count = 0}
			console.log('_c_');
			Game.map[c.y][c.x] = FILL;
			$('#x_y_' + c.x + '_' + c.y).addClass('fill');
			if(Game.emptyaround(c).c) {
				Game.runw({
					x : c.x - 1,
					y : c.y
				}, ++count)
			} else {
				console.log('w', count, c);
				Game.move(c);
				Game.drawarrows(c);
				Game.iswin(c);
			}
		},
		rune  : function(c, count) {
			if(typeof(count) === 'undefined') {count = 0}
			console.log('_d_');
			Game.map[c.y][c.x] = FILL;
			$('#x_y_' + c.x + '_' + c.y).addClass('fill');
			if(Game.emptyaround(c).d) {
				Game.rune({
					x : c.x + 1,
					y : c.y
				}, ++count)
			} else {
				console.log('e', count, c);
				Game.move(c);
				Game.drawarrows(c);
				Game.iswin(c);
			}
		},
		runsw : function(c, count) {
			if(typeof(count) === 'undefined') {count = 0}
			console.log('_e_');
			var even = (c.y % 2) == 0;
			Game.map[c.y][c.x] = FILL;
			$('#x_y_' + c.x + '_' + c.y).addClass('fill');
			if(Game.emptyaround(c).e) {
				Game.runsw({
					x : even?c.x:(c.x - 1),
					y : c.y + 1
				}, ++count)
			} else {
				console.log('sw', count, c);
				Game.move(c);
				Game.drawarrows(c);
				Game.iswin(c);
			}
		},
		runse : function(c, count) {
			if(typeof(count) === 'undefined') {count = 0}
			console.log('_f_');
			var even = (c.y % 2) == 0;
			Game.map[c.y][c.x] = FILL;
			$('#x_y_' + c.x + '_' + c.y).addClass('fill');
			if(Game.emptyaround(c).f) {
				Game.runse({
					x : even?(c.x + 1):c.x,
					y : c.y + 1
				}, ++count)
			} else {
				console.log('se', count, c);
				Game.move(c);
				Game.drawarrows(c);
				Game.iswin(c);
			}
		},
		draw6 : function(x, y){//j, i
			var even = (y % 2 === 0);
			var w = ( SIZES.hexagon.width / SIZES.hexagon.height * SIZES.ball );
			var h = SIZES.ball;
			var _l = ( SIZES.margin.x + (w * x) ) + (even?(w / 2):0);
			var _r = (SIZES.hexagon.top / SIZES.hexagon.height * SIZES.ball ) * y;
			var l = $('<div>')
				.addClass('hexagon')
				.addClass(
					(Game.map[y][x] === WALL)
						? 'wall'
						: (Game.map[y][x] === BALL)
							? 'fill'
							: 'empty' 
				)
//				.addClass( ((f)?'glamp':'vlamp') )
				.attr('id', ( 'x_y_' + x + '_' + y ) )
				.data({
					'x' : x,
					'y' : y
				})
//				.addClass('e' + Game.map[y][x])
				.css({
					left   : _l,
					top    : _r,
					width  : w,
					height : h,
				})
			return l;
		},
//fixfix2
		drawarrow : function(c, direction){//j, i
			console.log('draw arrow ' + direction, c.x, c.y);
			var even = (c.y % 2 === 0);
			var w = ( SIZES.hexagon.width / SIZES.hexagon.height * SIZES.ball );
			var h = SIZES.ball;
			var _l = ( SIZES.margin.x + (w * c.x) ) + (even?(w / 2):0);
			var _r = (SIZES.hexagon.top / SIZES.hexagon.height * SIZES.ball ) * c.y;
			var l = $('<div>')
				.addClass('hexagon')
				.attr('id', 'arrow_' + direction)
				.addClass('arrow')
				.data({
					'x' : c.x,
					'y' : c.y
				})
				.css({
					left   : _l,
					top    : _r,
					width  : w,
					height : h,
				})
			return l;
		},
		drawarrows : function(c){
			$('#map>.arrow').remove();
			c.x = parseInt(c.x);
			c.y = parseInt(c.y);
			console.log('draw arrows');
			var around = this.emptyaround(c);
			var even = (c.y % 2 === 0);
			if(around.a) {
				$('#map').append(this.drawarrow({x : c.x - (even?0:1), y : c.y - 1}, 'nw'));
			}
			if(around.b) {
				$('#map').append(this.drawarrow({x : c.x + (even?1:0), y : c.y - 1}, 'ne'));
			}
			if(around.c) {
				$('#map').append(this.drawarrow({x : c.x - 1, y : c.y}, 'w'));
			}
			if(around.d) {
				$('#map').append(this.drawarrow({x : c.x + 1, y : c.y}, 'e'));
			}
			if(around.e) {
				$('#map').append(this.drawarrow({x : c.x - (even?0:1), y : c.y + 1}, 'sw'));
			}
			if(around.f) {
				$('#map').append(this.drawarrow({x : c.x + (even?1:0), y : c.y + 1}, 'se'));
			}
			$('#arrow_nw').click(function(){
				Game.runnw(c);
				console.log('run north-west');
			});
			$('#arrow_ne').click(function(){
				Game.runne(c);
				console.log('run north-east');
			});
			$('#arrow_w').click(function(){
				Game.runw(c);
				console.log('run west');
			});
			$('#arrow_e').click(function(){
				Game.rune(c);
				console.log('run east');
			});
			$('#arrow_sw').click(function(){
				Game.runsw(c);
				console.log('run south-west');
			});
			$('#arrow_se').click(function(){
				Game.runse(c);
				console.log('run south-east');
			});
		},
		drawball : function(c){//j, i
			console.log('drawball');
			var even = (c.y % 2 === 0);
			var w = ( SIZES.hexagon.width / SIZES.hexagon.height * SIZES.ball );
			var s = ( SIZES.ball / SIZES.hexagon.height * SIZES.cursor.size );
			var _ml = ( SIZES.ball / SIZES.hexagon.height * SIZES.cursor.left );
			var _mt = ( SIZES.ball / SIZES.hexagon.height * SIZES.cursor.top );
			console.log(w, s);
			var _l = ( SIZES.margin.x + (w * c.x) ) + (even?(w / 2):0) + _ml;
			var _t = (SIZES.hexagon.top / SIZES.hexagon.height * SIZES.ball ) * c.y + _mt;
			var l = $('<div>')
				//.addClass('ball')
				.attr('id', 'ball')
				.data({
					'x' : c.x,
					'y' : c.y
				})
				.css({
					left   : _l,
					top    : _t,
					width  : s,
					height : s,
				})
			return l;
		},
		draw : function(){
			console.log('start draw');
			$('#map').html('');
			var c = {}
			for(var y in Game.map) {
				//var f = (y % 2 === 0);
				for(x in Game.map[y]) {
					if(Game.map[y][x] === BALL) {
						c = {
							'x' : x,
							'y' : y
						}
					}
					$('#map').append(this.draw6(x, y));
				}
			}
			$('#map').append(this.drawball(c));
			//console.log('ball', this.emptyaround(c));
			this.drawarrows(c);
		},
		win : function() {
			$('#splash').html(words.youwin);
			$('#splash').show();
			//$('#gamescreen').hide();
			var l = parseInt(localStorage.hexagonlevel);
			if(l < levels.length - 1) {
				localStorage.hexagonlevel = l + 1;
				setTimeout(function() {
					Game.startgame();
					$('#splash').hide();
				}, 3000);
			}
		},
		gameover : function() {
			$('#splash').html(words.gameover);
			$('#splash').show();
			setTimeout(function() {
				$('#splash').hide();
				Game.startgame();
			}, 3000);
		},
		startgame : function(){
			
			$('#points').html(localStorage['hexagonpoints']);
			$('#level').html(parseInt(localStorage['hexagonlevel']) + 1);
			
			// для каждой новой карты (другого размера)
			var l = parseInt(localStorage['hexagonlevel']);
			this.map = [];
			for(y in levels[l].map) {
				this.map[y] = [];
				for(x in levels[l].map[y]) {
					this.map[y][x] = levels[l].map[y][x];
				}
			}
			//this.map = levels[l].map;
			
			var mapsize = {
				x : Game.map[1].length,
				y : Game.map.length
			}

			if(mapsize.x > mapsize.y){
				SIZES.ball = GAMESPACE.X / mapsize.x;
			} else {
				if( GAMESPACE.X / mapsize.x * mapsize.y > GAMESPACE.Y ){
					SIZES.ball = GAMESPACE.Y / mapsize.y;
				} else {
					SIZES.ball = GAMESPACE.X / mapsize.x;
				}
			}
			$('#map').css({
				left   : SIZES.margin.firstx * SCALINGFACTOR,//( SIZES.margin.x * SCALINGFACTOR ),
				top    : ( SIZES.margin.y * SCALINGFACTOR + SIZES.pointsbar * SCALINGFACTOR ),
				width  : GAMESPACE.X,
				height : GAMESPACE.Y//, border : '1px solid #f00'
			});
			//SIZES.margin.x = ( ( DWIDTH - (SIZES.ball * mapsize.x) ) / 2 - SIZES.margin.x * SCALINGFACTOR);
			var s = ( SIZES.hexagon.width / SIZES.hexagon.height * SIZES.ball );
			SIZES.margin.x = ( ( DWIDTH - (s * mapsize.x) ) / 2 ) - SIZES.margin.firstx;
			console.log(SIZES.margin.x);
			// ----------------------------------------
			this.draw();
		},
		initmatchesarr : function() {
			//this.mathes = [];
			for(y in this.map){
				this.matches[y] = []
				for(x in this.map[y]) {
					this.matches[y][x] = 0;
				}
			}
		},
		initfallarr : function() {
			//this.mathes = [];
			for(y in this.map){
				this.fall[y] = []
				for(x in this.map[y]) {
					this.fall[y][x] = 0;
				}
			}
		},
		clearmatchesarr : function() {
			for(y in this.map){
				for(x in this.map[y]) {
					this.matches[y][x] = 0;
				}
			}
		},
		clearfallarr : function() {
			for(y in this.map){
				for(x in this.map[y]) {
					this.fall[y][x] = 0;
				}
			}
		},
		clearmatches : function() {
			$('.column').each(function() {
				var c = $(this).data();
				if( Game.matches[c.y][c.x] === 1) {
					$(this).hide('normal');
					//Game.map[c.y][c.x] = EMPTY;
				}
			});
		},
		init : function(){
			//$('#mapsplash').append(' in');
			if(
				typeof(localStorage['hexagonlevel']) === 'undefined' ||
				typeof(localStorage['hexagonpoints']) === 'undefined'
			){
				localStorage['hexagonlevel'] = 0;
				localStorage['hexagonpoints'] = 0;
			}
			//$('#points').html(localStorage['hexagonpoints']);
			//$('#level').html(localStorage['hexagonlevel']);
			//this.drawmap();
		}
	}
//----------------------------------------------------------------------------------------------------------------------------------------------------
	$(document).ready(function(){
		Game.init();
		DWIDTH = document.body.clientWidth;
		DHEIGHT	= document.body.clientHeight;
		SCALINGFACTOR = DWIDTH / 320;
		BANNERHEIGHT = SCALINGFACTOR * 50;
		SIZES.margin.x = SIZES.margin.x * SCALINGFACTOR;
		SIZES.margin.y = SIZES.margin.y * SCALINGFACTOR;
		
		GAMESPACE = {
			X : DWIDTH - ( SIZES.margin.x * 2 ),
			Y : DHEIGHT - BANNERHEIGHT - SIZES.margin.y - SIZES.pointsbar
		}
		$('#splash').css('width', (DWIDTH - 30 + 'px'));
		
		$('#pointsbar').css({
			height        : ( ( ( SIZES.pointsbar * SCALINGFACTOR )|0 ) + 'px' ),
			'line-height' : ( ( ( SIZES.pointsbar * SCALINGFACTOR )|0 ) + 'px' )
		});
		
		//Game.startgame();
		
		$('#playbutton').css({
			width : (216 * SCALINGFACTOR) + 'px',
			height : (72 * SCALINGFACTOR) + 'px',
			left : (DWIDTH / 2 - 108 * SCALINGFACTOR) + 'px',
			bottom : 150 * SCALINGFACTOR
		})
		.click(function(){
			$('#gamescreen').show();
			$('#startscreen').hide();
			Game.startgame();
		});
	});