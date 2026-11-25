const path = require('path');

module.exports = {
  mode: 'production',
  // Ship a source map so consumers can read what the published bundle was built from.
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd', // Ensures compatibility with different module systems
    globalObject: 'this',
  },
  resolve: {
    alias: {
      react$: path.resolve(__dirname, 'node_modules/react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
  },
};
