const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const path = require('path');

module.exports = () => {
  var publicFldrPath = path.join(__dirname, 'public'),
      buildFldrPath = path.join(publicFldrPath, 'assets'),
      buildSrcFldrPath = path.join(publicFldrPath, 'src'),
      plugins = [];

  plugins.push(new HtmlWebpackPlugin({
    template: path.join(buildSrcFldrPath, 'index.html'),
    filename: 'index.html',
    inject: 'body'
  }));
  plugins.push(new WebpackCleanupPlugin({
    exclude: ['css/**/*', '**/*.html', 'favicon.ico', 'service-worker.js']
  }));

  return {
    entry: {
      app: path.join(buildSrcFldrPath, 'js')
    },
    output: {
      publicPath: '/assets/',
      filename: '[name].[hash:8].bundle.js',
      path: buildFldrPath,
      chunkFilename: '[name].[hash:8].bundle.js'
    },
    module: {
      loaders: [{
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      }]
    },
    resolve: {
      extensions: ['.js', '.json']
    },
    plugins: plugins,
    devtool: 'inline-source-map'
  };
};
