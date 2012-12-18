/**
 * Brain of Tanks
 * @author: Lexxus <altmoc@gmail.com>
 * @version: 1.0
 * Date: 14.12.12
 * Time: 21:29
 */
var BoT = {
	tanks: {},

	createTank: function(id, stageId, config) {
		if(id && !this.tanks[id]){
			this.tanks[id] = new this.Tank(stageId, config);
			return this.tanks[id];
		}
		return null;
	},

	Tank: function(stageId, config) {
		this.params = BoT.standardTank;

		if(config){
			this.x = config.x || 100;
			this.y = config.y || 100;
			this.directionTank = config.direction || 90;
			if(typeof config.listeners === 'object'){
				var ls = config.listeners;
				for(var i in ls){
					if(ls.hasOwnProperty(i) && typeof ls[i] === 'function'){
						this.on(i, ls[i]);
					}
				}
			}
		}

		this.turnStop(true);

		if(GDI){
			var that = this;
			this.GDI = new GDI(this, stageId, function(e){
				that.action();
			});
		}
	},

	standardTank: {
		armor: 1,
		/**
		 * Max tank moving speed
		 */
		maxSpeedForward: 20,
		maxSpeedBack: 10,
		/**
		 * Max tank turning speed
		 */
		maxTurning: 10,
		/**
		 * Max turret turning speed
		 */
		maxTurretSpeed: 10,

		shotSpeed: 20,

		shotDamage: 30,

		radarDistance: 100
	}
};

BoT.Tank.prototype = (function () {
	return {
		/**
		 * Tank basic parameters
		 */
		params: null,

		health: 100,
		/**
		 * Current tank position X
		 * @var Number
		 */
		x: 0,
		/**
		 * Current tank position Y
		 * @var Number
		 */
		y: 0,
		/**
		 * Direction of tank in degrees: 0 - right, 180 - left, 90 - up, 270 - down
		 * @var Number
		 */
		directionTank: 0,
		/**
		 * Current speed in pixels per second
		 * positive - forward, negative - backward
		 * @var Float
		 */
		speed: 0,   // current speed
		/**
		 * Turning tank target in degrees
		 * @var Float
		 */
		turningTo: 0,
		/**
		 * Direction of turret in degrees relatively the tank
		 * @var Number
		 */
		directionTurret: 0,
		/**
		 * Turning turret target in degrees
		 * @var Float
		 */
		turningTurretTo: 0,

		/**********
		 * Events *
		 **********/
		events:{
			turnTankEnd:[],
			turnTurretEnd:[],
			tankStop:[]
		},

		on: function(eventName, handler){
			if(typeof handler !== 'function') return;

			if(!this.events[eventName]){
				this.events[eventName] = [];
			}
			this.events[eventName].push(handler);
		},

		fireEvent: function(eventName, param){
			var handlers = this.events[eventName];

			if(handlers && handlers.length > 0){
				for(var i = 0, c = handlers.length; i < c; ++i){
					if(handlers[i]){
						handlers[i].call(this, param);
					}
				}
			}
		},


		/*********************
		 * Control Interface *
		 *********************/

		move: function(speed) {
			if(speed > this.params.maxSpeedForward){
				speed = this.params.maxSpeedForward;
			}else if(speed < -this.params.maxSpeedBack){
				speed = -this.params.maxSpeedBack;
			}

			this.speed = speed;

			this.doAction();
		},

		stop: function(doEvent){
			this.speed = 0;

			if(doEvent){
				this.fireEvent('tankStop');
			}
		},

		turnRight: function(degree) {
			this.turnStop(true);
			this.turningTo -= degree;

			this.doAction();
		},

		turnLeft: function(degree) {
			this.turnStop(true);
			this.turningTo += degree;

			this.doAction();
		},

		turnStop: function(silence){
			this.turningTo = this.directionTank;

			if(!silence){
				this.fireEvent('tankTurned')
			}
		},

		turretRight: function(degree){
			this.turretStop(true);
			this.turningTurretTo -= degree;

			this.doAction();
		},

		turretLeft: function(degree){
			this.turretStop(true);
			this.turningTurretTo += degree;

			this.doAction();
		},

		turretStop: function(silence){
			this.turningTurretTo = this.directionTurret;

			if(!silence){
				this.fireEvent('turretTurned')
			}
		},

		fire: function(){

		},


		/**
		 * Private methods
		 */
		pi180: Math.PI / 180,

		inAction: false,

		action: function(event){
			var that = this,
				turn, doNext = false,
				doEvent = '';

			if(event){
				this.fireEvent(event);
			}

			if(this.directionTank != this.turningTo){
				turn = this.turningTo - this.directionTank;

				if(Math.abs(turn) > this.params.maxTurning){
					if(turn > 0){
						this.directionTank += this.params.maxTurning;
					}else{
						this.directionTank -= this.params.maxTurning;
					}
				}else{
					this.directionTank = this.turningTo;
					doEvent = 'turnTankEnd';
				}
				doNext = true;
			}
			if(this.speed){
				if(this.speed > this.params.maxSpeedForward) this.speed = this.params.maxSpeedForward;
				else if(this.speed < -this.params.maxSpeedBack) this.speed = -this.params.maxSpeedBack;

				var f = this.pi180 * this.directionTank;

				this.x += this.speed * Math.cos(f);
				this.y += this.speed * Math.sin(f);

				doNext = true;
			}
			if(this.directionTurret != this.turningTurretTo){
				turn = this.turningTurretTo - this.directionTurret;

				if(Math.abs(turn) > this.params.maxTurretSpeed){
					if(turn > 0){
						this.directionTurret += this.params.maxTurretSpeed;
					}else{
						this.directionTurret -= this.params.maxTurretSpeed;
					}
				}else{
					this.directionTurret = this.turningTurretTo;
					doEvent = 'turnTurretEnd';
				}
				doNext = true;
			}
			if(doNext){
				this.inAction = true;
				this.draw(function(){
					that.action(doEvent);
				});
			}else{
				this.inAction = false;
			}
		},

		draw: function(callback){
			if(this.GDI){
				this.GDI.draw(callback);
			}
		},

		doAction: function(){
			if(!this.inAction){
				var that = this;
				setTimeout(function(){
					that.action();
				}, 1);
			}
		}
	};
})();