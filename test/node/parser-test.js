var buster = require("buster");
var assert = buster.assert;
var parser = require("../../lib/parser");

buster.testCase("HTML doc parser", {
    "leaves non-html doc code untouched": function () {
        var code = parser.parse("function tmp() {return 42;}");
        assert.match(code, /^function tmp\(\) {\s*return 42;\s*}$/);
    },

    "leaves unparsable code untouched": function () {
        var code = parser.parse("function tmp() { return 42");
        assert.equals(code, "function tmp() { return 42");
    },

    "extracts html docs and updates code": function () {
        var script = "function tmp() { /*:DOC element = <div></div>*/ }";
        var code = parser.parse(script);
        assert.match(code, "document.createElement");
    },

    "parses ES6": function () {
        var script = "() => { /*:DOC element = <div>can haz es6?</div>*/ }";
        var code = parser.parse(script);
        assert.match(code, "document.createElement");
    }
});
