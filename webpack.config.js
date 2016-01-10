
/**
 * @see https://github.com/petehunt/webpack-howto
 */

var webpack = require('webpack');

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

module.exports = {
  context: __dirname + '/src',
  entry: './app.js',
  output: {
    path: __dirname + '/public', // This is where images AND js will go
    publicPath: 'http://localhost:8000', // This is used to generate URLs to e.g. images
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          __dirname + '/src'
        ],
        loader: 'babel-loader'
      },
      { test: /\.less$/,
        include: [
          __dirname + '/src'
        ],
        loader: 'style-loader!css-loader!less-loader'
      },
      { test: /\.css$/,
        include: [
          __dirname + '/src'
        ],
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg)$/,
        include: [
          __dirname + '/src/images'
        ],
        loader: 'url-loader?limit=8192'
      }, // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.js?$/,
        include: [
          __dirname + '/src'
        ],
        loader: 'eslint-loader'
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.jsx', '.json']
  }
};
