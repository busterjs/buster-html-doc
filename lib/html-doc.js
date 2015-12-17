var babelTypes = require("babel-types");
var babelTpl = require("babel-template");

var HTML_DOC_PROLOG_REGEXP = /^:DOC/;

var appendChild = babelTpl("document.body.appendChild(CODE);");
var addProp = babelTpl("this[PROP_NAME] = CODE;");
var injectIntoDom = babelTpl("(function () {" +
    "  var element = document.createElement(\"div\");" +
    "  element.innerHTML = MARKUP;" +
    "  if (element.childNodes.length > 1) {" +
    "    throw new Error(\"HTML doc expected to only contain one root node, found \" + element.childNodes.length); " +
    "  }" +
    "  return element.firstChild; " +
    "}())");

module.exports = {
    htmlDocCommentToAst: function (commentValue) {
        var pieces = commentValue.replace(HTML_DOC_PROLOG_REGEXP, "").trim().split(/</);
        var name = pieces.shift().split(/\+?=/).shift().trim();
        var markup = "<" + pieces.join("<");

        var injectCode = injectIntoDom({MARKUP: babelTypes.stringLiteral(markup)});

        return name
            ? addProp({PROP_NAME: babelTypes.stringLiteral(name), CODE: injectCode})
            : appendChild({CODE: injectCode});
    },

    isHtmlDocComment: function (commentNode) {
        return HTML_DOC_PROLOG_REGEXP.test(commentNode.value);
    }
};
