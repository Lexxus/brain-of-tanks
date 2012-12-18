buster.testCase("Tank", {
    setUp: function(){
        this.tank = BoT.createTank();
    },

    "move action": function () {
		var tank = this.tank,
			moveTest = function(speed, test){
				tank.move(speed);
				assert.equals(tank.speed, test);
			}
		;
		moveTest(15, 15);
		moveTest(tank.params.maxSpeedForward+11, tank.params.maxSpeedForward);
		moveTest(-(tank.params.maxSpeedBack+11), -tank.params.maxSpeedBack);
    },

	"stop action": function () {
		this.tank.move(1);
		assert.equals(this.tank.speed, 1);

		this.tank.stop();
		assert.equals(this.tank.speed, 0);
	},

    "exists turnRight action": function () {
        assert.isFunction(this.tank.turnRight);
    },

    "exists turnLeft action": function () {
        assert.isFunction(this.tank.turnLeft);
    },

	"exists turnStop action": function () {
		assert.isFunction(this.tank.turnStop);
	},

	"exists turretRight action": function () {
		assert.isFunction(this.tank.turretRight);
	},

	"exists turretLeft action": function () {
		assert.isFunction(this.tank.turretLeft);
	},

	"exists turretStop action": function () {
		assert.isFunction(this.tank.turretStop);
	},

	"exists fire action": function () {
		assert.isFunction(this.tank.fire);
	}
});