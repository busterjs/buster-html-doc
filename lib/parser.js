var ZeParser = require("zeparser").ZeParser;
var htmlDoc = require("./html-doc");

module.exports = {
    parse: function (code) {
        var parser = ZeParser.createParser(code);
        parser.tokenizer.fixValues();
        var wtree = parser.tokenizer.wtree;
        return wtree.map(function (t) {
            if (t.isComment) {
                return htmlDoc.extract(t.value);
            } else {
                return t.value;
            }
        }).join("");
    }
};
