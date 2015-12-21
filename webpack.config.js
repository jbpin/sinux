module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname+'/dist',
    libraryTarget : 'commonjs2',
    filename: "sinux.js"
  },
  externals: {
    "babel-polyfill": "babel-polyfill",
    "co": "co"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",query: {compact: false} }
    ]
  }
}