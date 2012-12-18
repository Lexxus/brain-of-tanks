/**
 * Graphics Display Interface
 * @author: Lexxus
 * Date: 15.12.12
 * Time: 15:49
 */

var GDI = function(tank, stageId){
	this.tank = tank;

	var brPrefixes = ['', 'Webkit', 'Moz', 'O', 'Ms'],
		i = 0, tfn, brPrefix,
		stage = document.getElementById(stageId);
	if(stage){
		this.stage = stage;

		while(!this.transformName && (tfn = brPrefixes[i] + 'Transform')){
			if(typeof document.body.style[tfn] !== 'undefined'){
				this.transformName = tfn;
				brPrefix = brPrefixes[i].toLowerCase();
			}
			i++;
		}

		this.createEl();

		var that = this,
			listener = function(){
				if(typeof that.transitionEndCallback === 'function'){
					that.transitionEndCallback();
				}
			};

		if(brPrefix){
			this.tankEl.addEventListener(brPrefix + 'TransitionEnd', listener, false);
		}else{
			this.tankEl.addEventListener('transitionend', listener, false);
		}
	}
};

GDI.prototype = {
	createEl: function(){
		var el = document.createElement('div');
		el.className = 'tank';
		this.tankEl = el;
		el.innerHTML = '<div class="turret"><div class="gun"></div></div>';
		this.turretEl = el.firstChild;

		el.style[this.transformName] = 'rotate('+ (0 - this.tank.directionTank) +'deg)';

		this.sx = el.clientWidth / 2;
		this.sy = el.clientHeight / 2;

		el.style.left = (this.tank.x - this.sx) +'px';
		el.style.bottom = (this.tank.y + this.sy) +'px';

		this.stage.appendChild(el);
	},

	draw: function(moveEndCallback){
		if(!this.stage) return;
		if(!this.tankEl) this.createEl();

		var tank = this.tank,
			el = this.tankEl;

		this.transitionEndCallback = moveEndCallback;

		el.style.left = (tank.x - this.sx) +'px';
		el.style.bottom = (tank.y + this.sy) +'px';

		el.style[this.transformName] = 'rotate('+ (0 - tank.directionTank) +'deg)';

		this.turretEl.style[this.transformName] = 'rotate('+ (0 - tank.directionTurret) +'deg)';
	}
};