module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname+'/dist',
        filename: "sinux.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
}