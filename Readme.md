# buster-html-doc

[![Build status](https://secure.travis-ci.org/busterjs/buster-html-doc.png?branch=master)](http://travis-ci.org/busterjs/buster-html-doc)

> HTML Doc comments for Buster.JS

Buster.JS extension that provides the "HTML doc" feature from JsTestDriver for Buster.JS:

```javascript
"should get markup from comments": function () {
    /*:DOC element = <div class="yeah"></div>*/
    assert.equals(this.element.className, "yeah");
}
```
