var config  = module.exports;

config["node"] = {
    environment: "node",
    tests: ["test/node/*.js"]
};

config["browser"] = {
    environment: "browser",
    tests: [
        "test/browser/*.js"
    ],
    extensions: [
        require("./lib/extension")
    ]
};
