var webpack = require('webpack')
var path = require('path')

module.exports = {
    context: __dirname,
    entry: "./app/js/root.js",
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],

                    plugins: [
                        // 配置插件，可以正常使用HTML中的属性
                        'react-html-attrs',
                        // babel按需加载组件
                        ['import',[
                            {
                                "libraryName": "antd",
                                "libraryDirectory": "lib",   // default: lib
                                "style": 'css'
                            },
                            {
                                "libraryName": "antd-mobile",
                                "style": 'css'
                            },
                        ]]
                    ]
                }
            },
            {
                test: /\.css$/,
                // 配置模块化加载CSS样式。可以避免CSS被全局污染，每个模块即使和全局CSS类名重复也无所谓
                // loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
                loader: 'style-loader!css-loader'
            }
        ]
    },
    // adding the json-loader
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    devServer: {
        port: 8000
    },
    output: {
        path: __dirname,
        filename: "./app/bundle.js"
    }
}