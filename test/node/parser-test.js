var buster = require("buster");
var assert = buster.assert;
var parser = require("../../lib/parser");

buster.testCase("HTML doc parser", {
    "leaves non-html doc code untouched": function () {
        var code = parser.parse("function () { return 42; }");
        assert.equals(code, "function () { return 42; }");
    },

    "leaves unparsable code untouched": function () {
        var code = parser.parse("function () { return 42");
        assert.equals(code, "function () { return 42");
    },

    "extracts html docs and updates code": function () {
        var script = "function () { /*:DOC element = <div></div>*/ }";
        var code = parser.parse(script);
        assert.match(code, "document.createElement");
    }
});
