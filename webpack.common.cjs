const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
    sw: path.resolve(__dirname, 'src/scripts/sw.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/templates/index.html'),
      filename: 'index.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/templates/splash.html'),
      filename: 'splash.html',
      chunks: ['app'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      swDest: 'sw.js',
      runtimeCaching: [
        {
          urlPattern: ({ url }) =>
            url.href.startsWith('https://restaurant-api.dicoding.dev'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'restaurants-api',
          },
        },
        {
          urlPattern: ({ url }) =>
            url.href.startsWith('https://restaurant-api.dicoding.dev/images/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'restaurants-image-api',
          },
        },
      ],
    }),
  ],
};
