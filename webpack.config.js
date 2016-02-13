var path = require('path');

module.exports = {
	entry: {
		app: ['./src/blox.js']
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/assets/',
		filename: 'bundle.js',
		library: 'blox'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};
