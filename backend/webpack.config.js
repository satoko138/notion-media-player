const path = require('path')
const Dotenv = require('dotenv-webpack');
const enviroment = process.env.NODE_ENV || 'dev';

module.exports = {
    mode: 'production',
  
    entry: './src/index.ts',

    target: 'node',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
      },
    
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
        },
      ],
    },
    resolve: {
      extensions: [
        '.ts', '.js',
      ],
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, `.env.${enviroment}`),
      }),
    ]
  };