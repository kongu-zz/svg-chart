var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack-stream");
var WebpackDevServer = require("webpack-dev-server");
var dwebpack = require("webpack");
var WebpackNotifierPlugin = require('webpack-notifier');
//var exec = require('gulp-exec');
var manageTranslations = require("react-intl-translations-manager").default;
var jsonServer = require('json-server')

var argv = require("yargs").argv;

var port = argv.port ? argv.port : 8080;
var wport = argv.wport ? argv.wport : 3002;
var whost = argv.whost ? argv.whost : "localhost";

var runSequence = require("run-sequence");
var packageJson = require("./package.json");
var path = require('path');

var paths = {
    webroot: "./dist/",
    nodeModules: "./node_modules/**/*",
    scripts: "./src/",
    awcache: "./.awcache/**/*",
    deploy: "../wwwroot/js"
};

paths.js = paths.webroot + "js/**/*.js";
paths.jsAll = paths.webroot + "js/**/*";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("react:development", function() {
    var wconfig = {
        cache: true,
        devtool: "source-map",
        entry: {
            app: ["es6-promise", "whatwg-fetch",
                "webpack-dev-server/client?http://" + whost + ":" + wport,
                "webpack/hot/only-dev-server",
                paths.scripts + "index.tsx"
            ]
        },

        resolve: {
            extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
        },
        output: {
            path: process.cwd(),
            filename: "[name].js",
            publicPath: "http://" + whost + ":" + wport + "/js/" 
        },
        plugins: [
            new dwebpack.HotModuleReplacementPlugin(),
            new dwebpack.NoErrorsPlugin(),
            new dwebpack.DefinePlugin({
                "process.env": { NODE_ENV: JSON.stringify("development") }
            }),
            new WebpackNotifierPlugin({ title: packageJson.name, alwaysNotify: true }),
        ],
        module: {
            loaders: [{
                    test: /\.js$/,
                    loaders: ["react-hot-loader/webpack", "babel-loader"],
                    exclude: /node_modules/
                }, {
                    test: /\.ts(x?)$/,
                    loaders: ["react-hot-loader/webpack", "babel-loader", "ts-loader"]
                }, {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
                { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
                { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
                { test: /\.json$/, loaders: ["react-hot", "json"] },
            ]
        },
        ts: {
            compiler: "typescript"
        },

        externals: {
            "config": JSON.stringify(require("./config.dev.json"))
        }
    };

    var server = new WebpackDevServer(dwebpack(wconfig), {
        publicPath: wconfig.output.publicPath,
        hot: true,
        inline: true,
        noInfo: false,
        headers: { "Access-Control-Allow-Origin": "*" },
        stats: {
            colors: true,
            progress: true
        }
    });

    server.listen(wport, function(err, result) {
        if (err) {
            console.log(err);
        }

        gutil.log("Webpack Dev Server started. Compiling...");
    });
});

gulp.task('react:build', function(callback) {
    dwebpack({
        entry: {
            app: ["es6-promise", "whatwg-fetch", paths.scripts + "index.tsx"]
        },
        resolve: {
            extensions: ["", ".ts", ".tsx", ".js", ".jsx"],
            modules: [
                "node_modules"
            ]
        },
        output: {
            path: path.join(__dirname, 'dist/js'),
            filename: '[name].js',
            pathinfo: false
        },
        plugins: [
            new dwebpack.optimize.UglifyJsPlugin({ minimize: true, output: { comments: false } }),
            new dwebpack.optimize.OccurrenceOrderPlugin(),
            new dwebpack.DefinePlugin({
                "process.env": { NODE_ENV: JSON.stringify("production") }
            }),
            new WebpackNotifierPlugin({ title: packageJson.name, alwaysNotify: true })
        ],
        module: {
            loaders: [
                // { test: /\.js$/, loaders: ["react-hot"], exclude: /node_modules/ },
                {
                    test: /\.ts(x?)$/,
                    loaders: ["babel", "ts-loader"]
                }, {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
                { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
                { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
                { test: /\.json$/, loader: 'json' },
            ]
        },
        ts: {
            compiler: "typescript"
        },
        externals: {
            "config": JSON.stringify(require("./config.prod.json"))
        }
    }, function(err, stats) {
        if (err)
            throw new gutil.PluginError("webpack", err);

        gutil.log("[webpack]", stats.toString());
        callback();
    });

});

// gulp.task("locale:build", function(callback) {
//     manageTranslations({
//         messagesDirectory: "dist/messages",
//         translationsDirectory: "src/Locale/",
//         languages: ["en", "ru"], // any language you need 
//     });

//     callback();
// });

gulp.task("mock", function(callback) {
    var server = jsonServer.create();
    var router = jsonServer.router("db.json");
    var middlewares = jsonServer.defaults();

    server.use(middlewares)
    server.use(router)
    server.listen(4001, function() {
        console.log('JSON Server is running');
        callback();
    })
});

gulp.task("deploy", function() {
    gulp.src([paths.jsAll])
        .pipe(gulp.dest(paths.deploy));
});

gulp.task('publish', function(done) {
    runSequence(
        //"locale:build", 
        "build", "deploy", function() {
        done();
    });
});

gulp.task("run", function(callback) {
    runSequence("mock", "react:development", function() {
        callback();
    });
});

gulp.task("default", function(callback) {
    runSequence("react:development", function() {
        callback();
    });
});

gulp.task('build', function(callback) {
    runSequence("react:build", callback);
});