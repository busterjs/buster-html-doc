var buster = require("buster");
var htmlDoc = require("../lib/html-doc");
var vm = require("vm");
var jsdom = require("jsdom").jsdom;


buster.testCase("HTML doc", {
    setUp: function () {
        var dom = jsdom("<!DOCTYPE html><html><head></head>" +
                        "<body></body></html>");
        this.context = { document: dom.createWindow().document };
    },

    "leaves regular multi-line comment as is": function () {
        var comment = "/* Hey */";
        assert.equals(htmlDoc.extract(comment), comment);
    },

    "leaves regular one-line comment as is": function () {
        var comment = "// Hey";
        assert.equals(htmlDoc.extract(comment), comment);
    },

    "converts markup in comment to DOM element": function () {
        var comment = "/*:DOC element = <div>Element</div>*/";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        assert.tagName(this.context.element, "div");
        assert.equals(this.context.element.innerHTML, "Element");
    },

    "converts multi-line markup in comment to DOM element": function () {
        var comment = "/*:DOC element = <div>\n    <p>Element</p>\n</div>*/";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        assert.tagName(this.context.element, "div");
        assert.equals(this.context.element.childNodes.length, 3);
    },

    "maintaines line-count of html doc comment": function () {
        var comment = "/*:DOC element = <div>\n    <p>Element</p>\n</div>*/";
        var processed = htmlDoc.extract(comment);

        assert.equals(processed.split("\n").length, 3);
    },

    "converts one-line comment to DOM element": function () {
        var comment = "//:DOC element = <div>Element</div>";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        assert.tagName(this.context.element, "div");
    },

    "ignores superfluous white-space": function () {
        var comment = "/*:DOC     element  \n    =" +
                "  \n\n     <div></div>\n\n   */";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        assert.tagName(this.context.element, "div");
    },

    "fails if html doc contains more than one root node": function () {
        var comment = "/*:DOC element = <div></div><div></div>*/";

        try {
            vm.runInNewContext(htmlDoc.extract(comment), this.context);
            throw new Error("Did not throw");
        } catch (e) {
            assert.equals(e.message, "HTML doc expected to only contain one " +
                          "root node, found 2");
        }
    },

    "appends node to the body element": function () {
        var comment = "/*:DOC += <div></div>*/";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        assert.equals(this.context.document.body.childNodes.length, 1);
        assert.tagName(this.context.document.body.firstChild, "div");
    },

    "maintains line-count when adding elements to the body": function () {
        var comment = "/*:DOC += <div>\n\n\n</div>*/";
        var processed = htmlDoc.extract(comment);

        assert.equals(processed.split("\n").length, 4);
    },

    "throws when attempting to add more than one element": function () {
        var comment = "/*:DOC += <div></div><div></div>*/";

        assert.exception(function () {
            vm.runInNewContext(htmlDoc.extract(comment), this.context);
        });
    },

    "allows elements with attributes": function () {
        var comment = "/*:DOC += <div id=\"test\"></div> */";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        var body = this.context.document.body;
        assert.equals(body.firstChild.getAttribute("id"), "test");
    },

    "allows plus and equals in the HTML": function () {
        var comment = "/*:DOC += <div data-test=\"test+=test\">+=+</div> */";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        var body = this.context.document.body;
        assert.equals(body.firstChild.getAttribute("data-test"), "test+=test");
        assert.equals(body.firstChild.textContent, "+=+");
    },

    "allows single quoted attributes": function () {
        var comment = "/*:DOC += <div id='test'></div> */";
        vm.runInNewContext(htmlDoc.extract(comment), this.context);

        assert.equals(this.context.document.body.firstChild.id, "test");
    }
});
