const path = require('path');

let entry = ['./example/index.tsx'];

if (process.env.NODE_ENV === 'development') {
  entry = entry.concat([
    'webpack-dev-server/client',
    'webpack/hot/only-dev-server'
  ]);
}

module.exports = {
  devtool: 'eval',
  entry: entry,
  output: {
    path: path.join(__dirname, "example"),
    filename: "bundle.js",
    publicPath: "./",
  },
  plugins: [],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /dist|lib|node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  }
};
