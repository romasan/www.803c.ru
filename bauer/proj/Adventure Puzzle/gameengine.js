var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
	var SIZES = {
		point : 15,
		flag : { x : 40, y : 55 },
		//comumn : 30 + 2,
		column : 50,
		pointsbar : 20,
		margin : {
			x : 20,// * SCALINGFACTOR
			y : 70
		}/*,
		frame : {
			w : 720
			h : 50
		}*/
	}
	
	var SWORD = 1;
	var MAGIC = 2;
	
	var player = 'playerA';
	
	var Game = {
		name : 'match3rpg',
		width      		: 6,//9 | 7
		height     		: 9,//6 | 9
//		points     		: 0,
		objectsnum 		: 5,//6
//		level			: 1,
//		maxlevelsnum	: 10, // mappoints.length
		timestep		: 100,
		timer           : false,
		up				: {
			playerA : false,
			playerB : false,
			move : 2,
			block : false
		},
		player : {
			fullhp : 100,
			barw : 100,
			barh : 10
		},
		hero : {
			starthp : 300,
			hp : 300,
			plushp : 10
		},
		op : 0,
		optime : 0,
		ophp : 0,
		opstarthp : 100,
		opponents : [
			{
				name : 'кот',
//				hp : 100,
				force : 10,
				time : 10000,
				damages : {
					magic : 2,//0,
					sword : 2,
					other : 0
				}
			},
			{
				name : 'голем',
//				hp : 100,
				force : 15,
				time : 8000,
				damages : {
					magic : 2,//0,
					sword : 1,
					other : 0
				}
			},
			{
				name : 'монстр женщина',
//				hp : 100,
				force : 15,
				time : 12000,
				damages : {
					magic : 1,//0,
					sword : 2,
					other : 0
				}
			},
			
		],
		S : {
			combatbar : {
				w : 312,//400,
				h : 156,//200,
				bar : {
					w : 160,
					h : 72,
					l : 30,
					t : 45
				},
				progress : 0,
				time : 50,
				step : 0,
			},
			playerprogress : {
				w : 0,
				h : 3
			}
		},
		ani : false,
		map : [],
		randmap : function() { // рандомно забивает кату
			for(var i = 0; i < this.height; i++) {
				this.map[i] = [];
				for(var j = 0; j < this.width; j++) {
					this.map[i][j] = (Math.random() * this.objectsnum + 1)|0;
				}
			}
		},
		randempty : function(){ // рандомно забивает кату
//			for(var i = 0; i < this.height; i++) {
//				for(var j = 0; j < this.width; j++) {
//					if(this.map[i][j] === 0) {
//						this.map[i][j] = (Math.random() * this.objectsnum + 1)|0;
//					}
//				}
//			}
			for(y in this.map) {
				for(x in this.map[y]) {
					if(this.map[y][x] === 0) {
						this.map[y][x] = (Math.random() * this.objectsnum + 1)|0;
					}
				}
			}
		},
		replace : function(ax, ay, bx, by){
			// не менять местами одинаковые
			// менять местами только стоящие рядом
			var xx = ((bx - ax) > 0)?(bx - ax):(ax - bx);
			var yy = ((by - ay) > 0)?(by - ay):(ay - by);
			//console.log('--- ' + xx + ' ' + yy);
			if((xx + yy) < 2){
				//console.log('ok!');
			} else {
			
//				$('#playeris').html(lang.player + Game.up.move).css({'font-size' : '0pt', transform : 'rotate(' + ( (Game.up.move == 1)?0:180 ) + 'deg)'}).show().animate({'font-size' : '30pt'}, 1500, function(){
//					$('#playeris').hide();
//				});
				Game.up.playerA = false;
				Game.up.playerB = false;
//				Game.up.move = ( Game.up.move != 1 )?1:2;
				Game.up.block = false;
				
				console.log('error!');
				$('#x_y_' + ax + '_' + ay).addClass('error');
				$('#x_y_' + bx + '_' + by).addClass('error');
				setTimeout(function(){
					$('#x_y_' + ax + '_' + ay).removeClass('error');
					$('#x_y_' + bx + '_' + by).removeClass('error');
				}, 500);
				return false;
			};
			
			//TODO показать что такой ход не возможен X
			if(ax === bx && ay === by){
				console.log('abra kadabra');
//				$('#playeris').html(lang.player + Game.up.move).css({'font-size' : '0pt', transform : 'rotate(' + ( (Game.up.move == 1)?0:180 ) + 'deg)'}).show().animate({'font-size' : '30pt'}, 1500, function(){
//					$('#playeris').hide();
//				});
				Game.up.playerA = false;
				Game.up.playerB = false;
//				Game.up.move = ( Game.up.move != 1 )?1:2;
				Game.up.block = false;
				console.log('player', Game.up.move);
				//TODO X1
				$('#x_y_' + ax + '_' + ay).addClass('error');
				setTimeout(function(){
					$('#x_y_' + ax + '_' + ay).removeClass('error');
				}, 500);
				return false;
			}
			// не менять местами с "куском" (.point7)
//			if(this.map[ax][ay] === (this.objectsnum + 1) || this.map[bx][by] === (this.objectsnum + 1)){
				//TODO X2
//				return false;
//			} 
			
			//console.log(ax + ' ' + ay + ' ' + bx + ' ' + by);
			
			var arrtmp = [];
			for(i in this.map){
				arrtmp[i] = [];
				for(j in this.map[i]){
					arrtmp[i][j] = this.map[i][j];
				}
			}
			
			var tmp = arrtmp[ay][ax];
			arrtmp[ay][ax] = arrtmp[by][bx];
			arrtmp[by][bx] = tmp;
			//arrtmp[ax][ay] = arrtmp[ax][ay] + arrtmp[bx][by];
			//arrtmp[bx][by] = arrtmp[ax][ay] - arrtmp[bx][by];
			//arrtmp[ax][ay] = arrtmp[ax][ay] - arrtmp[bx][by];
			
			//Game.deja(true);
			
			//console.log('=========================');
			//Game.logarr2(arrtmp);
			//console.log('profit ' + this.deja2arr(arrtmp));
			
			// менять только если от этого будет профит
			if(this.deja2arr(arrtmp)) {
				//console.log('profit');
				
				//меняем местами на экране
				
				// hide animation
//				var i = ($('#x_y_3_3').width() / 2);
//				var i = (SIZES.column / 2);
//				$('#x_y_3_3').animate({left:'+=' + i,top:'+=' + i,width:'0px',height:'0px'})

				//$('#map>.row:eq(' + ax + ')>.column:eq(' + ay + ')')//.html('a')
//					.removeClass('point' + this.map[ax][ay])
//					.addClass('point' + this.map[bx][by]);
//				$('#map>.row:eq(' + bx + ')>.column:eq(' + by + ')')//.html('b')
//					.removeClass('point' + this.map[bx][by])
//					.addClass('point' + this.map[ax][ay]);

				// меняем местами
				var c = {
					a : {
						x : $('#x_y_' + ax + '_' + ay).offset().left,
						y : $('#x_y_' + ax + '_' + ay).offset().top
					},
					b : {
						x : $('#x_y_' + bx + '_' + by).offset().left,
						y : $('#x_y_' + bx + '_' + by).offset().top
					}
				}
				$('#x_y_' + ax + '_' + ay).animate({left : c.b.x, top : c.b.y}, 100);
				$('#x_y_' + bx + '_' + by).animate({left : c.a.x, top : c.a.y}, 100);
				
				// a.data() <=> b.data()
				$('#x_y_' + ax + '_' + ay).data({x : bx, y : by});
				$('#x_y_' + bx + '_' + by).data({x : ax, y : ay});
				//a_id <=> b_id
				$('#x_y_' + ax + '_' + ay).attr('id', 'tmp');
				$('#x_y_' + bx + '_' + by).attr('id', 'x_y_' + ax + '_' + ay);
				$('#tmp').attr('id', 'x_y_' + bx + '_' + by)
				
				//this.map[ax][ay] = this.map[ax][ay] + this.map[bx][by];
				//this.map[bx][by] = this.map[ax][ay] - this.map[bx][by];
				//this.map[ax][ay] = this.map[ax][ay] - this.map[bx][by];
				// меняем местами в массиве
				var tmp = this.map[ay][ax];
				this.map[ay][ax] = this.map[by][bx];
				this.map[by][bx] = tmp;
				
				return true;
			} else {
				
//				$('#playeris').html(lang.player + Game.up.move).css({'font-size' : '0pt', transform : 'rotate(' + ( (Game.up.move == 1)?0:180 ) + 'deg)'}).show().animate({'font-size' : '30pt'}, 1500, function(){
//					$('#playeris').hide();
//				});
				Game.up.playerA = false;
				Game.up.playerB = false;
//				Game.up.move = ( Game.up.move != 1 )?1:2;
				Game.up.block = false;
				
				$('#x_y_' + ax + '_' + ay).addClass('error');
				$('#x_y_' + bx + '_' + by).addClass('error');
				setTimeout(function(){
					$('#x_y_' + ax + '_' + ay).removeClass('error');
					$('#x_y_' + bx + '_' + by).removeClass('error');
				}, 500);
				return false;
				//TODO X3
			}
		},
		logmap : function(){// выводит первоначальный массив в консоль
			for(var i = 0; i < this.height; i++) {
				var str = "";
				for(var j = 0; j < this.width; j++) {
					str += this.map[i][j] + ' ';
				}
				console.log(str);
			}
		},
		deja : function(clear){//находим все одинаковые, возвращает массив и помечает на карте как 0
			var ret = [];
			ret.found = false;
			for(var i = 0; i < this.height; i++){
				ret[i] = [];
				for(var j = 0; j < this.width; j++){ret[i][j] = 0}
			}
			for(var i = 0; i < this.height; i++) {
				for(var j = 2; j < this.width; j++) {
					if(this.map[i][j] === this.map[i][j - 1] && this.map[i][j - 1] === this.map[i][j - 2] && this.map[i][j - 2] != 0){
						ret[i][j] = ret[i][j - 1] = ret[i][j - 2] = 1;
						ret.found = true;
					}
				}
			}
			for(var i = 0; i < this.width; i++) {
				for(var j = 2; j < this.height; j++) {
					if(this.map[j][i] === this.map[j - 1][i] && this.map[j - 1][i] === this.map[j - 2][i] && this.map[j - 2][i] != 0){
						ret[j][i] = ret[j - 1][i] = ret[j - 2][i] = 1;
						ret.found = true;
					}
				}
			}
			if( clear ) {
				var points = 0;
				var magic = 0;
				var sword = 0;
				var other = 0;
				for( i in ret ) {
					for( j in ret[i] ) {
						if( ret[i][j] === 1 ) {
							//this.points++;
							points++;
							if( this.map[i][j] == MAGIC ) {
								//points += 2;
								magic++;
							} else if( this.map[i][j] == SWORD ) {
								//points += 2;
								sword++;
							} else {
								//points++;
								other++;
							}
							
							this.map[i][j] = 0;
						}
					}
				}
				//if( magic + sword + other > 0 ) {
				if( points > 0 ) {
					
					var combat = 0
					combat += magic * Game.opponents[Game.op].damages.magic;
					combat += sword * Game.opponents[Game.op].damages.sword;
					combat += other * Game.opponents[Game.op].damages.other;
					combat = combat|0;
					
					this.ophp -= combat;
					
					console.log( 'hero combat', combat, 'ophp', this.ophp );
					
					//if( Game.opponents[Game.op].hp > combat ) {
					if( Game.ophp > combat ) {
						Game.ophp -= combat;
						
						if( combat > 0 ) {
							$('#opponent>.splashhp').css({'font-size' : '1pt'}).html('-' + combat).show().animate({'font-size' : '32pt'}).animate({'font-size' : '1pt'}, function(){$('#opponent>.splashhp').hide()});
						}
						
						var _w = ( this.S.playerprogress.w * this.ophp ) / this.opstarthp;//this.opponents[this.op].hp;
					
						console.log( '_w', _w );
						
						$('#opponent .progress').css({
							width : _w + 'px'
						});
						$('#ophp').html(this.ophp);
						
						// add splash -combat points
					} else {
						// new op
						console.log('create new opponent');
						
						clearTimeout(Game.timer);
						$('#opponent').hide('slow');
						$('.ahide').hide('slow');
						localStorage[Game.name + 'level'] = parseInt(localStorage[Game.name + 'level']) + 1;
						var plus = parseInt(localStorage[Game.name + 'level']) * 5;
						Game.ophp = Game.opstarthp + plus;// + 5
						Game.hero.hp = ( ( Game.hero.starthp - 5 ) > Game.hero.hp ) ? ( Game.hero.hp + 5 ) : Game.hero.starthp;
						$('#herohp').html(Game.hero.hp);
						$('#player>.icon').removeClass('playerbg0').addClass('playerbg1');
						Game.animation('#player>.icon', Game.w1, 0, 2);
						$('#player>.icon').css({
							'background-position' : '0px 0px'
						});
						
						var ff = function() {
							$('#player>.icon').removeClass('playerbg1').addClass('playerbg0');
							clearTimeout( Game.ani );
							$('#opponent').removeClass('op' + this.op);
							Game.op = ( Math.random() * Game.opponents.length )|0;
							
							$('#opponent').addClass('op' + Game.op).show();
							$('.ahide').show();
							console.log('this.op', Game.op);
							Game.optime = Game.opponents[Game.op].time;
							Game.repeater();
							//this.opponents[this.op].hp;
							
							$('#opponent .progress').css({
								width : Game.S.playerprogress.w + 'px'
							});
							$('#ophp').html(Game.ophp);
						
						}
						$('#player').animate({
							left : DWIDTH + 'px'
						}, 5000)
						.animate({
							left : -Game.w1 + 'px'
						}, 0)
						.animate({
							left : '0px'
						}, 300, ff);
						
						
						
						
					}
					
					
					
					// TODO redraw op progress
					
					
					
					//localStorage[Game.name + 'points'] = (parseInt(localStorage[Game.name + 'points']) + points);
				}
				localStorage[Game.name + 'points'] = ( parseInt(localStorage[Game.name + 'points']) + combat );
			}
			//console.log('++++++++++++++++++++');
			//Game.logarr2(ret);
			return ret;
		},
		deja2arr : function(a){//находим все одинаковые, возвращает массив и помечает на карте как 0
			var found = false;
			for(var i = 0; i < this.height; i++) {
				for(var j = 2; j < this.width; j++) {
					if(a[i][j] === a[i][j - 1] && a[i][j - 1] === a[i][j - 2]){
						found = true;
					}
				}
			}
			for(var i = 0; i < this.width; i++) {
				for(var j = 2; j < this.height; j++) {
					if(a[j][i] === a[j - 1][i] && a[j - 1][i] === a[j - 2][i]){
						found = true;
					}
				}
			}
			return found;
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
		repeater : function() {
			//console.log('hero hp:', this.hero.hp);
			this.optime -= Game.timestep;
			if( this.optime <= 0 ) {
				this.optime = this.opponents[this.op].time;
				console.log('opponent combat:', this.opponents[this.op].force, 'hp:', this.hero.hp);
				this.hero.hp -= this.opponents[this.op].force;
				$('#player>.splashhp').css({'font-size' : '1pt'}).html('-' + this.opponents[this.op].force).show().animate({'font-size' : '32pt'}).animate({'font-size' : '1pt'}, function(){$('#opponent>.splashhp').hide()});
				// TODO redraw hero progress
				var _w = ( this.hero.hp < 0 ) ? 0 : ( ( this.S.playerprogress.w * this.hero.hp ) / this.hero.starthp );
				$('#player .progress').css({
					width : _w + 'px'
				});
				$('#herohp').html(this.hero.hp);
				if( this.hero.hp <= 0 ) {
					// game over
					console.log('gameover');
					this.up.block = true;
					this.gameover();
					//clearTimeout(Game.timer);
					return;
				}
			}
			//TODO 050813
			var _w = ( this.S.combatbar.bar.w * this.optime ) / this.opponents[this.op].time;
			$('#white').css({
				width  : _w + 'px'
			});
			Game.timer = setTimeout(function() {
				Game.repeater();
			}, Game.timestep);
			
			//clearTimeout(this.timer)
		},
		hideempty : function(isA) {
			for(y in this.map) {
				for(x in this.map[y]) {
					if(this.map[y][x] === 0) {
						var m = (SIZES.column / 2);
						$('#x_y_' + x + '_' + y).animate({
							left:'+=' + m,
							top:'+=' + m,
							width:'0px',
							height:'0px'
						}, 300, function(){
							var c = $(this).data();
							//console.log('----------------------------', c);
							$('#x_y_' + c.x + '_' + c.y).remove();
							//$('#x_y_' + c.x + '_' + c.y).css({border : '1px solid #f00'});
						});
						//$('#x_y_' + x + '_' + y).hide('slow')
						//setTimeout(, 300, x, y);
						//$('#x_y_' + x + '_' + y).css({border : '1px solid #f00'});
					}
				}
			}
			var _t = function(){
				$('#points').html(localStorage[Game.name + 'points']);
				//console.log('>>>>>>>>>>>>>>>', isA);
//				if(Game.up.move === 1) {
//					Game.fallup();
//				} else {
					Game.fall();
//				}
			}
			setTimeout(_t, 400);
		},
/*
		fallup : function(){
			var f = false;
			for(x = 0; x < this.width; x++) {
				f = false;
				var free = 0;
				var bottom = Game.map.length;
				var top = bottom;
				if( this.map[0][x] === 0 ) {
					f = true;
				}
				for(y in this.map) {
					//console.log(':', this.map[y][x]);
					if(this.map[y][x] == 0) {
						free++;
					} else {
						if(free > 0) {
							//console.log(y, free);
							var _y = parseInt(y);
							
							// warp map[a] <=> map[b]
							var tmp = this.map[_y][x];
							this.map[_y][x] = this.map[_y - free][x];
							this.map[_y - free][x] = tmp;
							
							// warp a.data <=> b.data
							$('#x_y_' + x + '_' + _y).data('y', (_y - free));
							$('#x_y_' + x + '_' + (_y - free)).data('y', _y);
							
							// warp el coordinates
							var _s = SIZES.column * (_y - free) + SIZES.margin.y;
							//console.log('_s', _s);
							
							$('#x_y_' + x + '_' + _y).css({
								top : ( _s + 'px' )
							});
							
							// warp a.id <=> b.id
							//var f = function() {
								$('#x_y_' + x + '_' + _y).attr('id', 'tmp');
								var id1 = ( 'x_y_' + x + '_' + _y );
								$('#x_y_' + x + '_' + (_y - free)).attr('id', id1);
								var id2 = ( 'x_y_' + x + '_' + (_y - free) );
								$('#tmp').attr('id', id2);
							//}
						}
					}
				}
			}
			setTimeout(function(){
				Game.fill();
			}, 500);
		},
*/
/*
		fall : function(){
			var f = false;
			for(x = 0; x < this.width; x++) {
				f = false;
				var bottom = Game.map.length;
				var top = bottom;
				for(y = this.map.length - 1; y >= 0; y--) {
					if(this.map[y][x] === 0) {
						if(y > 0)if(this.map[y - 1][x] !== 0) {
							f = true;
							top = y;
						}
					} else {
						if(f) {
							var down = bottom - top;
							this.map[y + down][x] = this.map[y][x];	
							this.map[y][x] = 0;
							var co = $('#x_y_' + x + '_' + y).offset();
							var _y = SIZES.column * (y + down) + SIZES.margin.y;
							$('#x_y_' + x + '_' + y).animate({//bottom - 1
								top : _y
							}, 100);
							$('#x_y_' + x + '_' + y).data({'x' : x, 'y' : (y + down)});
							$('#x_y_' + x + '_' + y).attr('id', 'x_y_' + x + '_' + (y + down));
						} else {
							bottom = y;
						}
					}
				}
			}
			setTimeout(function(){
				Game.fill();
			}, 500);
		},
*/
		fall : function() {
			var f = false;
			for(x = 0; x < this.width; x++) {
				f = false;
				var free = 0;
				var bottom = Game.map.length;
				var top = bottom;
				if( this.map[0][x] === 0 ) {
					f = true;
				}
				for(y = this.map.length - 1; y >= 0; y--) {
					//console.log(':', this.map[y][x]);
					if(this.map[y][x] == 0) {
						free++;
					} else {
						if(free > 0) {
							//console.log(y, free);
							var _y = parseInt(y);
							
							// warp map[a] <=> map[b]
							var tmp = this.map[_y][x];
							this.map[_y][x] = this.map[_y + free][x];
							this.map[_y + free][x] = tmp;
							
							// warp a.data <=> b.data
							$('#x_y_' + x + '_' + _y).data('y', (_y + free));
							$('#x_y_' + x + '_' + (_y + free)).data('y', _y);
							
							// warp el coordinates
							var _s = SIZES.column * (_y + free) + SIZES.margin.y;
							//console.log('_s', _s);
							
							$('#x_y_' + x + '_' + _y).css({
								top : ( _s + 'px' )
							});
							
							// warp a.id <=> b.id
							//var f = function() {
								$('#x_y_' + x + '_' + _y).attr('id', 'tmp');
								var id1 = ( 'x_y_' + x + '_' + _y );
								$('#x_y_' + x + '_' + (_y + free)).attr('id', id1);
								var id2 = ( 'x_y_' + x + '_' + (_y + free) );
								$('#tmp').attr('id', id2);
							//}
						}
					}
				}
			}
			setTimeout(function(){
				Game.fill();
			}, 500);
		},
		animation : function(o, h, s, l) {
			$(o).css({
				'background-position' : '0px ' + ( s * h ) + 'px'
			});
			s = ( s >= l - 1 ) ? 0 : ( s + 1 );
			console.log(h, ( s * h ));
			var ff = function() {
				console.log(o, h, s, l);
				Game.animation(o, h, s, l)
			}
			Game.ani = setTimeout(ff, 100);
		},
		fill : function() {
			for(y in this.map) {
				for(x in this.map[y]) {
					if(this.map[y][x] === 0) {
						//console.log('fill');
						this.map[y][x] = (Math.random() * this.objectsnum + 1)|0;
						$('#map').append(this.drawcolumn(x, y));
					}
					//str = '.row:eq(' +  i + ')>div.column:eq(' + j + ')';
					//$(str).html(this.map[i][j]);
				}
			}
			var winner = this.iswin();
			if( winner ) {
				this.win(winner);
			}
			$('.column').show('slow');
			if(Game.deja(true).found){
				setTimeout(function(){
					//Game.logmap();
					Game.hideempty();
				}, 500);
			} else {
				console.log('--------------------------');
				Game.up[( ( Game.up.move == 1 )?'playerA':'playerB' )] = false;
//				$('#playeris').html(lang.player + Game.up.move).css({'font-size' : '0pt', transform : 'rotate(' + ( (Game.up.move == 1)?0:180 ) + 'deg)'}).show().animate({'font-size' : '30pt'}, 1500, function(){
//					$('#playeris').hide();
//				});
				Game.up.playerA = false;
				Game.up.playerB = false;
//				Game.up.move = ( Game.up.move != 1 )?1:2;
				Game.up.block = false;
				//console.log('player', Game.up.move);
			}
		},
		win : function() {
			
		},
		gameover : function() {
			$('#splash').show();
			$('#splashtext').html(lang.gameover);
			clearTimeout(Game.timer);
			var f = function() {
				$('#splash').hide();
				// go to start menu
				//Game.startgame();
				$('#startscreen').show();
				$('#gamescreen').hide();
			}
			setTimeout(f, 3000);
		},
		mappoints : [//320x480
// document.onclick = function(e){console.log(e.pageX + ' ' + e.pageY)}	
			{x : 210, y : 218},
			{x : 226, y : 196},
			{x : 220, y : 173},
			{x : 213, y : 149},
			{x : 192, y : 134},
			{x : 169, y : 117},
			{x : 142, y : 110},
			{x : 127, y : 130},
			{x : 125, y : 152},
			{x : 147, y : 164},
			{x : 129, y : 181},
			{x : 112, y : 209},
			{x : 112, y : 233},
			{x : 106, y : 260},
			{x : 82, y : 285}
		],
		resetall : function() {
			localStorage[Game.name + 'level'] = 0;
			localStorage[Game.name + 'points'] = 0;
		},
		drawmap : function(){
			$('#mapsplash').html('');
			//$('#mapsplash').append(' drawmap');
			for(i in this.mappoints){
				//draw point
				
				var l = $('<div>').addClass('buttn')
				//console.log(parseInt(localStorage['atlaslevel']) + ' ' + i);
				if(parseInt(localStorage[Game.name + 'level']) > i) {$(l).addClass('inhistory');}
				if(parseInt(localStorage[Game.name + 'level']) == i) {
					$(l).attr('id', 'thislevel');
					$(l).css({
						left : ( this.mappoints[i].x - ( SIZES.point / 2 ) ) * SCALINGFACTOR,
						top : ( this.mappoints[i].y - SIZES.flag.y ) * SCALINGFACTOR,
						width : SIZES.flag.x,
						height : SIZES.flag.y,
						position : 'absolute'
					})
					.removeClass('buttn');
				} else {
					$(l).css({
						left : ( this.mappoints[i].x - ( SIZES.point / 2 ) ) * SCALINGFACTOR,// * на коэффициент масштабирования
						top : ( this.mappoints[i].y - ( SIZES.point / 2 ) ) * SCALINGFACTOR
					});
				}
				//$(l).html(i);
				$('#mapsplash').append(l);
				//$('#mapsplash').append(' button');
			}
			$('#thislevel').click(function(){
				$('#mapsplash').hide();
				$('#gamescreen').show();
				Game.startgame();
			});
		},
		redrawall : function(a){
			//console.log('redrawall');
			//console.log(' - 1 ---');
			//Game.logmap();
			//console.log(' - 2 ---');
			//Game.logarr2(a);
			//console.log(' - 3 ---');
			
			//var i = 1;
			$('.column').each(function(i){
				var x = $(this).index();
				var y = $(this).parent().index();
				//console.log('log: a.l' + a.length + ' m.l' + Game.map.length + ' y' + y + ' x' + x + ' i' + i);
				//Game.logarr2(a);
				//console.log('-----------');
				
				//if(a[y][x] === Game.map[y][x]){} else {
					$('#map>.row:eq(' + y + ')>.column:eq(' + x + ')')//.html('a')
						.removeClass('point' + a[y][x])
						.addClass('point' + Game.map[y][x]);
				//}
				
			});
		},
		drawcolumn : function(x, y){//j, i
			var l = $('<div>')
				.addClass('column')
				.addClass('hidden')
				.addClass('point' + Game.map[y][x])
				.attr('id', 'x_y_' + x + '_' + y)
				.data({'x' : x, 'y' : y})
				.css({
					left   : ( SIZES.column * x + SIZES.margin.x ),
					top    : ( SIZES.column * y + SIZES.margin.y ),
					width  : SIZES.column,
					height : SIZES.column
				});
			return l;
		},
		draw : function(){
			console.log('start draw');
			$('#map').html('');
			for(var i = 0; i < this.height; i++) {
				for(var j = 0; j < this.width; j++) {
					$('#map').append(this.drawcolumn(j, i));
				}
			}
			$('.column').show('slow');
			
			// click's ------------------------------------

			//$('.column').click(function(){
//			$('#playeris').html(lang.player + 1).css({'font-size' : '0pt'}).show().animate({'font-size' : '30pt'}, 1500, function(){
//				$('#playeris').hide();
//			})
			$("#map").undelegate(".column", "click");
			$("#map").delegate(".column", "click", function() {
//				var middleline = ( Game.height / 2 )|0;
//				var _y = $(this).data().y;
//				var isA = ( _y < middleline );
//				var player = ( ( Game.up.move == 1 )?'playerA':'playerB' );
				//var player = ( isA?'playerA':'playerB' );
//				var isyourmove = ( ( isA && Game.up.move == 1 ) || ( !isA && Game.up.move == 2 ) );
				//if( !Game.up.block ) 
				if( !Game.up.block ) {
				//if( isyourmove && !Game.up.block ) {
					if( Game.up[player] == false ) {// первый клик
						console.log('click1');
						$(this).addClass('selected');
							Game.up[player] = {
								//y : $(this).parent().index(),
								y : $(this).data().y,
								//x : $(this).index(),
								x : $(this).data().x,
								o : this
							}
							
							//console.log('select ' + Game.up[player].x + ' ' + Game.up[player].y);
						//} else {
						//	console.click('click fail');
						//}
					} else {// втрой клик
						Game.up.block = true;
						console.log('click2');
						$(Game.up[player].o).removeClass('selected');
						//console.log('unselect ' + Game.up[player].x + ' ' + Game.up[player].y);
						// 0 поменять местами, если получилось продолжить 1, 2, 3...

	//					var tmparr2redraw = [];
						
	//					for(i in Game.map){
	//						tmparr2redraw[i] = [];
	//						for(j in Game.map[i]){
	//							tmparr2redraw[i][j] = Game.map[i][j];
	//						}
	//					}


						if(Game.replace(
							Game.up[player].x,
							Game.up[player].y,
							$(this).data().x,
							$(this).data().y
						)){
							//console.log('okk');
							
							//подождать пока идёт анимация перемещения

							// TODO (replaced ok)
							
							// 1 удалить повторяющиеся
							//while(Game.deja(true).found){
								var _t = function(){
									Game.hideempty();
								}
								setTimeout(_t, 300);
							//}

							$('#points').html(localStorage[Game.name + 'points']);
						} else {
							/*
							Game.up[( ( Game.up.move == 1 )?'playerA':'playerB' )] = false;
							$('#playeris').html(lang.player + Game.up.move).css({'font-size' : '0pt', transform : 'rotate(' + ( (Game.up.move == 1)?0:180 ) + 'deg)'}).show().animate({'font-size' : '30pt'}, 1500, function(){
								$('#playeris').hide();
							});
							Game.up.playerA = false;
							Game.up.playerB = false;
							Game.up.move = ( Game.up.move != 1 )?1:2;
							Game.up.block = false;
							*/
						}
						/*
						Game.up[player] = false;
						Game.up.move = ( Game.up.move != 1 )?1:2;
						Game.up.block = false;
						*/
					}
				}// else console.log('not your move');
			});
			// -------------------------------------------
			
		},
		addsplinter : function(){
			var c = {}
			c.x = (Math.random() * this.width)|0;
			//c.y = 4;//(Math.random() * (this.height - 1)|0)|0;
			c.y = ( ( Game.height / 2 )|0 ) - ( ( Math.random() * 2 )|0 );
			//c.y = (Math.random() * (this.height / 2)|0)|0;
			this.map[c.y][c.x] = this.objectsnum + 1;
		},
		win : function() {
			$('#youwin')
//				.html(lang.winplayer + player)
				.show();
			//$('#gamescreen').hide();
			var l = parseInt(localStorage[Game.name + 'level']);
			if(l < Game.mappoints.length - 1) {
				localStorage[Game.name + 'level'] = l + 1;
				setTimeout(function() {
					//Game.startgame();
					$('#gamescreen').hide();
					//$('#mapsplash').show();
					//Game.drawmap();
					//$('#gamescreen').show();
					$('#startscreen').show();
					$('#youwin').hide();
				}, 3000);
			}
		},
		iswin : function() {
			for(i = 0; i < this.width; i++){if(this.map[0][i] === this.objectsnum + 1){return 2}}//ищем "сундук" 
			for(i = 0; i < this.width; i++){if(this.map[this.height - 1][i] === this.objectsnum + 1){return 1}}//ищем "сундук" 
			return false;
		},
		redrawchest : function() {
			var h = ( 224 * SCALINGFACTOR / this.mappoints.length ) * ( this.mappoints.length - parseInt(localStorage[Game.name + 'level']) );
			console.log('h: ' + h);
			$('#winlayer2').css({
				height : h
			});
		},
		startgame : function() {
			//this.init();

			this.op         = ( Math.random() * this.opponents.length )|0;
			this.optime     = this.opponents[this.op].time;
			this.ophp       = this.opstarthp;//this.opponents[this.op].hp;
			this.hero.hp    = this.hero.starthp;
			console.log('----------------------->', this.hero.hp);
			this.up.block   = false;
			this.up.playerA = false;
			
			//var _w = ( this.hero.hp < 0 ) ? 0 : ( ( this.S.playerprogress.w * this.hero.hp ) / this.hero.starthp );
			$('.progress').css({
				width : this.S.playerprogress.w + 'px'
			});
			$('#herohp').html(this.hero.hp);
			$('#ophp').html(this.ophp);
			
			this.repeater();
			
			$('#opponent').addClass('op' + this.op);

			this.randmap();
//			this.addsplinter();
			//var debug = 0;
			for(;this.deja().found;){
				//console.log('boobs');
				//if(debug < 100) {
					this.randmap();
//					this.addsplinter();
				//}
				//debug++;
			}
			//this.logmap();
			
			this.draw();
			//this.fill();
			//this.rcclear();
			//console.log(this.twins());
			//console.log('boobs' + this.map[1][1]);
		},
		init : function(){
			//$('#mapsplash').append(' in');
			if(
				typeof(localStorage[Game.name + 'level']) === 'undefined' ||
				typeof(localStorage[Game.name + 'points']) === 'undefined'
			){
				localStorage[Game.name + 'level'] = 0;
				localStorage[Game.name + 'points'] = 0;
			}
			$('#points').html(localStorage[Game.name + 'points']);
			this.drawmap();
		}
	}
	$(document).ready(function() {
		//$('#mapsplash').append('ready');
	
		DWIDTH = document.body.clientWidth;
		DHEIGHT	= document.body.clientHeight;
		SCALINGFACTOR = DWIDTH / 320;
		BANNERHEIGHT = SCALINGFACTOR * 50;
		SIZES.margin.x = SIZES.margin.x * SCALINGFACTOR;
		SIZES.margin.y = SIZES.margin.y * SCALINGFACTOR;
		SIZES.column = SIZES.column / 320 * DWIDTH;
		
//		$('#middleline').css({
//			top : ( DHEIGHT / 2 - 3 ) + 'px'
//		});
		
		GAMESPACE = {
			X : DWIDTH - ( SIZES.margin.x * 2 ),
			Y : DHEIGHT - BANNERHEIGHT - SIZES.margin.y
		}
		Game.width = 8;//( GAMESPACE.X / SIZES.column )|0;
		SIZES.column = GAMESPACE.X / Game.width;
		$('#helpscreen img').css({
			width : SIZES.column + 'px',
			height : SIZES.column + 'px'
		});
		Game.height = Game.width;
		
		var _t = DHEIGHT / 2 - GAMESPACE.X / 2;
		
		SIZES.margin.y = _t;
		
		var _l = ( ( DWIDTH - (SIZES.column * Game.width) ) / 2 );
		SIZES.margin.x = _l;
		
		
		
		var _hframe = 30;
		
		var _c = DWIDTH / 2;
		//Game.combat.w = ;
		//Game.combat.h = _t;
		//Game.combat.l = _c - _t;
		var h1 = SIZES.margin.y - _hframe * SCALINGFACTOR;//_t;
		//console.log('---->', 
		h1 = (h1 > DWIDTH / 5)?(DWIDTH / 5):h1;
		var w1 = h1;
		
		
		
		var lt = 10 * SCALINGFACTOR;
		var w2 = w1 - lt * 2;
		var h2 = w2;
		Game.w1 = w1;
		
		$('.hero').css({
			width  : w1 + 'px',
			height : h1 + 'px',
			'line-height' :  h1 + 'px',
		});
		$('#gamescreen>.hero').css({
			top : 10 * SCALINGFACTOR + 'px'
		});
		
		var h3 = h2;
		var w3 = h3 * 2;
		var l3 = DWIDTH / 2 - w3 / 2;
		var t3 = lt;
		
		
		
		
		$('#combatprogressbar').css({
			width  : w3 + 'px',
			height : h3 + 'px',
			left   : l3 + 'px',
			top    : t3 + 'px'
		});
		_wk = w3 / Game.S.combatbar.w;
		Game.S.combatbar.bar.w *= _wk;
		Game.S.combatbar.bar.h *= _wk;
		Game.S.combatbar.bar.l *= _wk;
		Game.S.combatbar.bar.t *= _wk;
		$('.cprogress').css({
			width  : Game.S.combatbar.bar.w + 'px',
			height : Game.S.combatbar.bar.h + 'px',
			top    : Game.S.combatbar.bar.t + 'px',
			left   : Game.S.combatbar.bar.l + 'px'
		});
		//$('#white').css({
		//	width  : '0px'
		//});
		
		Game.S.playerprogress.w = w1;
		
		$('.playerprogress').css({
			width : Game.S.playerprogress.w + 'px',
			height : ( Game.S.playerprogress.h * SCALINGFACTOR ) + 'px',
			top : -10 * SCALINGFACTOR
		});
		
		$('#herohp').css({ left : w1 });//.html(Game.hero.starthp);
		$('#ophp').css({ right : w1 });//.html(Game.opstarthp);
		
//		$('.combatprogress').css({
//		});
//		$('#combatprogress').css({
//		});
		
		//Game.height = ( ( GAMESPACE.Y - SIZES.pointsbar * SCALINGFACTOR ) / SIZES.column )|0;
		
//		$('#youwin').css('width', (DWIDTH - 30 + 'px'));
		
		$('#map').css({
//			'margin-left' : ( ( ( GAMESPACE.X - Game.width * SIZES.comumn ) / 2 )|0 + ( SIZES.margin.x * SCALINGFACTOR ) ),
//			'margin-top' : ( SIZES.margin.y * SCALINGFACTOR ),
			width  : GAMESPACE.X,
			height  : GAMESPACE.Y
		});
		
		
		$('#topframe').css({
			top : SIZES.margin.y - _hframe * SCALINGFACTOR + 5 * SCALINGFACTOR,
			left : SIZES.margin.x - 15 * SCALINGFACTOR,
			width : GAMESPACE.X + 30 * SCALINGFACTOR,
			height : _hframe * SCALINGFACTOR
		});
		$('#bottomframe').css({
			top : SIZES.margin.y + GAMESPACE.X - 5 * SCALINGFACTOR,
			left : SIZES.margin.x - 15 * SCALINGFACTOR,
			width : GAMESPACE.X + 30 * SCALINGFACTOR,
			height : _hframe * SCALINGFACTOR
		});
		_h = 100;
//		$('#playeris').css({
//			top : SIZES.margin.y + GAMESPACE.X / 2 - _h * SCALINGFACTOR / 2,
//			left : SIZES.margin.x,
//			width : GAMESPACE.X,
//			height : _h * SCALINGFACTOR,
//			'line-height' : ( _h * SCALINGFACTOR ) + 'px',
//		});
		$('#pointsbar').css({
			height : ( SIZES.pointsbar * SCALINGFACTOR )|0,
			'line-height' : ( ( ( SIZES.pointsbar * SCALINGFACTOR )|0 ) + 'px' )
		});
		// winlayer2 245,340
//		$('#winlayer2').css({
//			top : ( ( 164 * SCALINGFACTOR ) + 'px' ),
//			height : ( ( 224 * SCALINGFACTOR ) + 'px' )
//		});
		//console.log(((GAMESPACE.X - Game.width * SIZES.comumn) / 2)|0);
		Game.init();

// buttons on map
//		$('.buttn').css({
//			width : SIZES.point * SCALINGFACTOR,
//			height : SIZES.point * SCALINGFACTOR
//		});

		//Game.drawmap()
/*
		$('#thislevel').click(function(){
			$('#mapsplash').hide();
			$('#gamescreen').show();
			Game.startgame();
		});
*/

//		if( parseInt(localStorage[Game.name + 'level']) == 0 ) {
//			$('#continue').remove()
//		}
		var _l, _t, _w, _h;
		_w = (170 * SCALINGFACTOR) + 'px';//548
		_h = (46 * SCALINGFACTOR);//247
		_l = (DWIDTH / 2 - 85 * SCALINGFACTOR) + 'px';
		//_t = 270 * SCALINGFACTOR;
		_t = 850 / 1280 * DHEIGHT;
		$('#startscreen>div:eq(0)').css({left:_l,top:(_t + 'px'),width:_w,height:_h + 'px'});
		_t += _h + 3;
		$('#startscreen>div:eq(1)').css({left:_l,top:(_t + 'px'),width:_w,height:_h + 'px'});
		_t += _h + 3;
		$('#startscreen>div:eq(2)').remove().css({left:_l,top:(_t + 'px'),width:_w,height:_h + 'px'});
		
		/*
		$('#newgame').click(function(){
			Game.resetall();
			$('#startscreen').hide();
			$('#mapsplash').show();
			Game.drawmap();
		});
		*/
		$('#continue').click(function(){
			$('#startscreen').hide();
			//$('#mapsplash').show();
			$('#gamescreen').show();
			Game.startgame();
			//Game.drawmap();
		});
		$('#newgame').click(function(){
			localStorage[Game.name + 'level'] = 0;
			localStorage[Game.name + 'points'] = 0;
			$('#startscreen').hide();
			//$('#mapsplash').show();
			$('#gamescreen').show();
			Game.startgame();
			//Game.drawmap();
		});
		$('#help').click(function(){
			$('#helpscreen').show();
		});
		$('#helpscreen').click(function(){
			$(this).hide();
		});
	});