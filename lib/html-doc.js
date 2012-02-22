function stripCommentDelimiters(comment) {
    return comment.replace(/\/[\*\/]:DOC/, "").replace("*/", "");
}

function code(markup) {
    markup = markup.trim().replace(/"/g, "\\\"").replace(/\n/g, "\\n");
    return "(function () {" +
        "var element = document.createElement(\"div\");" +
        "element.innerHTML = \"" + markup + "\";" +
        "if (element.childNodes.length > 1) {" +
        "throw new Error(\"HTML doc expected to only contain one root " +
        "node, found \" + element.childNodes.length); }" +
        "return element.firstChild; }())";
}

function convertToMultiLineComment(comment) {
    if (!/\/\/:DOC/.test(comment)) { return comment; }
    return "/*" + comment + "*/";
};

module.exports = {
    extract: function (source) {
        if (!/\/*:DOC/.test(source) && !/\/\/:DOC/.test(source)) {
            return source;
        }

        var pieces = stripCommentDelimiters(source).split(/\+?=/);
        var name = pieces.shift().trim();
        var markup = pieces.join();

        if (name) {
            source = convertToMultiLineComment(source);
            return "this." + name + " = " + code(markup) + ";" + source;
        }
        return "document.body.appendChild(" + code(markup) + ");" + source;
    }
};
