.. default-domain:: js
.. highlight:: javascript

===============
buster-html-doc
===============

    HTML Doc comments for Buster.JS

.. raw:: html

    <a href="http://travis-ci.org/busterjs/buster-html-doc" class="travis">
      <img src="https://secure.travis-ci.org/busterjs/buster-html-doc.png">
    </a>

Buster.JS extension that provides the "HTML doc" feature from JsTestDriver
for Buster.JS:

::

    "should get markup from comments": function () {
        /*:DOC element = <div class="yeah"></div>*/
        assert.equals(this.element.className, "yeah");
    }
