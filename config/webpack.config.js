const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/client/public/index.html',
  filename: './index.html'
});

module.exports = {
  entry: './src/client/index.tsx',
  output: {
    path: path.resolve( 'dist' ),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
        extensions: ['.ts','.tsx','.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
  plugins: [htmlWebpackPlugin]
};