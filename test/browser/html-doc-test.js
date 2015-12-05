/*global buster */
var assert = buster.assert;

buster.testCase("HTML doc (integration)", {

    "leaves regular multi-line comment as is": function () {
        /* Hey */
        assert.equals(document.body.innerHTML, "");
    },

    "leaves regular one-line comment as is": function () {
        // Hey
        assert.equals(document.body.innerHTML, "");
    },

    "converts markup in comment to DOM element": function () {
        /*:DOC element = <div>Element</div>*/

        assert.equals(document.body.innerHTML, "");
        assert.tagName(this.element, "div");
        assert.equals(this.element.innerHTML, "Element");
    },

    "converts multi-line markup in comment to DOM element": function () {
        /*:DOC element = <div>
         <p>Element</p>
         </div>*/

        assert.equals(document.body.innerHTML, "");
        assert.tagName(this.element, "div");
        assert.equals(this.element.childNodes.length, 3);
    },

    "maintaines line-count of html doc comment": function () {
        /*:DOC element = <div>
         <p>Element</p>
         </div>*/

        assert.equals(this.element.innerHTML.split("\n").length, 3);
    },

    "converts one-line comment to DOM element": function () {
        //:DOC element = <div>Element</div>

        assert.equals(document.body.innerHTML, "");
        assert.tagName(this.element, "div");
    },

    "ignores superfluous white-space": function () {
        /*:DOC     element
         =

     <div></div>

         */

        assert.equals(document.body.innerHTML, "");
        assert.tagName(this.element, "div");
    },

    "fails if html doc contains more than one root node": function () {
        try {
            /*:DOC element = <div></div><div></div>*/
            throw new Error("Did not throw");
        } catch (e) {
            assert.match(e.message, "HTML doc expected to only contain one root node, found 2");
        }
    },

    "appends node to the body element": function () {
        /*:DOC += <div></div>*/

        assert.equals(document.body.childNodes.length, 1);
        assert.tagName(document.body.firstChild, "div");
    },

    "maintains line-count when adding elements to the body": function () {
        /*:DOC += <div>


         </div>*/

        assert.equals(document.body.firstChild.innerHTML.split("\n").length, 4);
    },

    "throws when attempting to add more than one element": function () {
        try {
            /*:DOC += <div></div><div></div>*/
            throw new Error("Did not throw");
        } catch (e) {
            assert.match(e.message, "HTML doc expected to only contain one root node, found 2");
        }
    },

    "allows elements with attributes": function () {
        /*:DOC += <div id="test"></div> */

        assert.equals(document.body.firstChild.getAttribute("id"), "test");
    },

    "allows plus and equals in the HTML": function () {
        /*:DOC += <div data-test="test+=test">+=+</div> */

        assert.equals(document.body.firstChild.getAttribute("data-test"), "test+=test");
        assert.equals(document.body.firstChild.textContent, "+=+");
    },

    "allows single quoted attributes": function () {
        /*:DOC += <div id='test'></div> */

        assert.equals(document.body.firstChild.id, "test");
    }
});
