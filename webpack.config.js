/**
 * Created by chenlin on 2017/12/12 0012.
 */
const path = require('path');
const webpack = require('webpack');
module.exports = {
    devtool:false,
    entry: {
        "index": path.join(__dirname,'src/index')
    },
    output:{
        path:path.resolve(__dirname,'./dist'),
        filename:'[name].js',
        library:"base",
        libraryTarget:'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: {
                    loader: 'babel-loader'
                },
            },
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                dead_code: true,
                loops: true,
                toplevel: true,
                if_return: true,
                // 内嵌定义了但是只用到一次的变量
                // collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
                drop_debugger: true // discard “debugger” statements
            },
            output: {
                comments: false
            }
        })
    ]
}
