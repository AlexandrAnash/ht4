module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        singleRun: true,
        
        preprocessors: {
            'server/test/**/*Test.js': ['webpack'],
            'client-src/test/**/*Test.js': ['webpack']
        },  
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'server/test/**/*Test.js',
            'client-src/test/**/*Test.js'
        ],
        
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            devtool: 'inline-source-map',

            watch: true
        },

        webpackServer: {
            noInfo: true
        }
    });
};