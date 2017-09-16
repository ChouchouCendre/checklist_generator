var path = require('path');
var webpack = require('webpack');

console.log('r',
path.join(__dirname, 'src/json/')
)

module.exports = {
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000
    },
    devtool: 'cheap-module-eval-source-map',
    entry: './src/js/index.js',
    resolve: {
        extensions: ['.js', '.svg', '.json'],
        modules: [ 'node_modules', './src' ],
        alias: {
          "@containers": path.resolve(__dirname, 'src/js/containers/'),
          "@json": path.resolve(__dirname, 'src/json/'),
          "@svg": path.resolve(__dirname, 'src/svg/'),
          "@scss": path.resolve(__dirname, 'src/scss/')
        }
    },
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
        path: __dirname + '/dist',
        filename: 'js/bundle.min.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
