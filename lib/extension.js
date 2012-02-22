var parser = require("./parser");

module.exports = {
    name: "buster-html-doc",
    htmlDoc: require("./html-doc"),
    parser: require("./parser"),

    create: function () {
        return Object.create(this);
    },

    configure: function (config) {
        config.on("load:tests", function (resourceSet) {
            resourceSet.addProcessor(function (resource, content) {
                return parser.parse(content);
            });
        });
    }
};
