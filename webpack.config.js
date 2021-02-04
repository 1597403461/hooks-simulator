const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'development',
    entry: './src/index.tsx',
    output: {
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    }
                ],
                exclude: /node_modules/
            },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
};
