const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/client/index.js',
    vendor: './src/vendor/index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              forceEnv: 'browser',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        include: path.resolve(__dirname, 'src/public/images'),
        use: ['file-loader?name=images/[name].[ext]'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /tesco-modern-fonts/,
        use: ['file-loader?name=fonts/[name].[ext]'],
      },
      {
        test: /\.svg$/,
        exclude: /tesco-modern-fonts/,
        use: ['file-loader?name=svg/[name].[ext]'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'dist/public'),
    publicPath: '/account/address-book/',
    filename: '[name]-[chunkhash].js',
  },
  mode: process.env.NODE_ENV,
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'bundle',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles-[chunkhash].css',
    }),
    new AssetsPlugin({
      filename: './src/webpack-assets.json',
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src/public/favicon.ico'),
        to: path.join(__dirname, 'dist/public'),
      },
      {
        from: path.join(__dirname, 'node_modules/@beans/tesco-modern/fonts'),
        to: path.join(__dirname, 'dist/public/fonts'),
      },
      {
        from: path.join(__dirname, 'src/public/500.html'),
        to: path.join(__dirname, 'dist/public'),
      },
    ]),
  ],
};
