const path = require('path');
const webpack = require('webpack');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  process.env.NODE_ENV = argv.mode;

  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',

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
            MiniCssExtractPlugin.loader,
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
        new CssMinimizerPlugin(),
        '...', // minimize using defaults too
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/backend/index.html',
        filename: isProduction ? '../frontend/index.html' : 'index.html',
        favicon: 'src/frontend/favicon.ico',
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[chunkhash:8].css' : '[name].css',
      }),
      new webpack.DefinePlugin({ DW_CONFIG: JSON.stringify(config) }),
    ],
  };
};
