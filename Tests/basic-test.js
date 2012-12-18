buster.testCase("Basic", {
    "exists BoT": function () {
        assert.defined(BoT);
    },

    "exists Tank class": function () {
        assert.defined(BoT.Tank);
    },

    "exists tank factory": function () {
        assert.defined(BoT.createTank);
    },

    "create Tank object": function () {
        assert.isObject(BoT.createTank());
    }
});