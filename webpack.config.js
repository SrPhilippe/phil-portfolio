import { resolve } from 'path'

module.exports = {
    entry: './docs/js/main.js',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'docs/dist'),
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
            }
        ]
    }
}