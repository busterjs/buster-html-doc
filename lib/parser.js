var generateCode = require("babel-generator").default;
var traverseAst = require("babel-traverse").default;
var parseCode = require("babylon").parse;
var babelTypes = require("babel-types");

var htmlDoc = require("./html-doc");

function processComment(updateAst) {
    return function (c) {
        if (c.seen) return; // note: there's probably a bug in babel that adds comments into AST multiple times
        c.seen = true;
        updateAst(htmlDoc.htmlDocCommentToAst(c.value));
    }
}

function processAstNode(p) {

    if (p.node.leadingComments) {
        p.node.leadingComments
            .filter(htmlDoc.isHtmlDocComment)
            .forEach(processComment(function (processed) {
                p.insertBefore(processed);
            }));
    }

    if (p.node.innerComments) {
        p.node.innerComments
            .filter(htmlDoc.isHtmlDocComment)
            .forEach(processComment(function (processed) {
                if (p.node.type !== "BlockStatement") {
                    throw new Error("Inner comments should only ever appear in empty block statements");
                }
                p.replaceWith(babelTypes.blockStatement([processed]));
            }));
    }

    // note: not handling p.node.trailingComments, although innerComments are trailing-ish

}

module.exports = {
    parse: function (code) {
        try {
            var result = parseCode(code);
        } catch (e) {
            console.warn(e);
            return code;
        }

        traverseAst(result, {enter: processAstNode});

        return generateCode(result, {}, code).code;
    }
};
