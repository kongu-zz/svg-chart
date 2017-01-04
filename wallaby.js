var wallabyWebpack = require('wallaby-webpack');
var wallabyPostprocessor = wallabyWebpack({
    // webpack options, such as
    // module: {
    //   loaders: [...]
    // },
    externals: {
        "config": JSON.stringify(require("./config.dev.json"))
    }
}
);
module.exports = function (wallaby) {

    return {
        files: [
            "src/*.ts",
            "src/*.tsx",
            "src/**/*.ts",
            "src/**/*.tsx"
        ],
        tests: [
            "test/*.ts",
            "test/*.tsx",
            "test/**/*.ts",
            "test/**/*.tsx"
        ],
        compilers: {
            "**/*.ts*": wallaby.compilers.typeScript({ module: 'es6' }),
            "**/*.js*": wallaby.compilers.babel({ presets: ["es2015", "stage-3", "react"] })
        },
        preprocessors: {
            "**/*.js*": file => require("babel-core").transform(file.content, {
                sourceMap: true,
                presets: ["es2015", "stage-3", "react"],
                plugins: ["jsx-control-statements"]
            })
        },
        //postprocessor: wallabyPostprocessor,
        env: {
            type: "node"
        },
        testFramework: "mocha",
        setup: function () {
            global.React = require("react");

            // Taken from https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
            var jsdom = require('jsdom').jsdom;

            var exposedProperties = ['window', 'navigator', 'document'];

            global.document = jsdom('');
            global.window = document.defaultView;
            Object.keys(document.defaultView).forEach((property) => {
                if (typeof global[property] === 'undefined') {
                    exposedProperties.push(property);
                    global[property] = document.defaultView[property];
                }
            });

            global.navigator = {
                userAgent: 'node.js'
            };
        }
    };
};