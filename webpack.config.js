const path = require('path');
const webpack = require('webpack');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv) => {
  process.env.NODE_ENV = argv.mode;

  const isProduction = argv.mode === 'production';

  return {
    entry: './src/frontend/index',

    output: {
      path: path.join(__dirname, '/dist/frontend'),
      filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
                // if hmr does not work, this is a forceful method.
                reloadAll: true,
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[name]-[contenthash:8].[ext]',
            outputPath: 'statics',
          },
        },
      ],
    },

    optimization: {
      minimizer: [
        new TerserPlugin({}),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/backend/index.html',
        filename: isProduction ? '../frontend/index.html' : 'index.html',
        favicon: 'src/frontend/favicon.ico',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : {},
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[chunkhash:8].css' : '[name].css',
      }),
      new webpack.DefinePlugin({ DW_CONFIG: JSON.stringify(config) }),
    ],
  };
};
