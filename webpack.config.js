const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'
const stylesHandler = MiniCssExtractPlugin.loader

const config = {
    entry: {
        index: [
            './js/main.js',
            './css/style.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'docs')
    },
    devServer: {
        open: false,
        host: 'localhost',
        watchFiles: ['./index.html']
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            scriptLoading: 'defer',
            inject: 'body' // inject the script on the body
        }),
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                use: ['html-loader']
            }
        ]
    }
}

module.exports = () => {
    if (isProduction) {
        config.mode = 'production',
        config.output.clean = true
    } else {
        config.mode = 'development'
    }
    return config
}
