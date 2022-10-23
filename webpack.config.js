const path = require('path')
const { merge } = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const stylesHandler = MiniCssExtractPlugin.loader


const base = {
  entry: {
    bundle: [
      './js/main.js',
      './css/style.scss'
    ]
  },
  output: {
    path: path.resolve(__dirname, './docs')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      scriptLoading: 'module',
      inject: 'body' // inject the script on the body
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.html$/i,
        use: ['html-loader']
      }
    ]
  }
}

const dev = {
  devtool: false,
  devServer: {
    open: false,
    host: 'localhost',
    port: 3000,
    watchFiles: ['./index.html'] // webpack only watches js and css by default
  }
}

const prod = {
  output: {
    clean: true // clean the output folder before build
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          outputPath: 'assets/',
          publicPath: 'assets/'
        }
      }
    ]
  },
  // optimization: {
  //     minimizer: [
  //         new CssMinimizerPlugin(),
  //         new ImageMinimizerPlugin({
  //             minimizer: {
  //                 implementation: ImageMinimizerPlugin.imageminMinify,
  //                 options: {
  //                     // Lossless optimization with custom option
  //                     // Feel free to experiment with options for better result for you
  //                     plugins: [
  //                         ["gifsicle", { interlaced: true }],
  //                         ["jpegtran", { progressive: true }],
  //                         ["optipng", { optimizationLevel: 5 }],
  //                         // Svgo configuration here https://github.com/svg/svgo#configuration
  //                     ],
  //                 },
  //             },
  //         })
  //     ]
  // }
}


module.exports = (env, args) => {
  switch (args.mode) {
    case 'development':
      return merge(base, dev)

    case 'production':
      return merge(base, prod)

    default:
      throw new Error('No matching configuration was found!')
  }
}