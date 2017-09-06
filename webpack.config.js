var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000
    },
    devtool: 'cheap-module-eval-source-map',
    entry: './src/js/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.svg$/,
                use: [
                    {
                    loader: 'babel-loader'
                    },
                    {
                    loader: 'react-svg-loader',
                    options: {
                        svgo: {
                        plugins: [{removeTitle: false}],
                        floatPrecision: 2
                        }
                    }
                    }
                ]
            }
        ]
    },
    output: {
        path: '/Users/sun/Documents/Workspace/checklist_generator/dist',
        filename: 'js/bundle.min.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
