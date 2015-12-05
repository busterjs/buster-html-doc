var buster = require("buster");
var assert = buster.assert;
var ext = require("../../lib/extension");
var bc = require("buster-configuration");

function process(group, then, errBack) {
    group.resolve().then(function (resourceSet) {
        resourceSet.serialize().then(then, errBack);
    }, errBack);
}

buster.testCase("HTML doc extension", {
    setUp: function () {
        this.config = bc.createConfiguration();
    },

    "processes tests to extract html doc": function (done) {
        var group = this.config.addGroup("Some tests", {
            resources: [{
                path: "/buster.js",
                content: "function () { /*:DOC el = <p></p>*/ }"
            }],
            tests: ["/buster.js"]
        });

        ext.create().configure(group);

        process(group, done(function (serialized) {
            assert.match(serialized.resources[0].content,
                         "document.createElement");
        }.bind(this)), buster.log);
    }
});
