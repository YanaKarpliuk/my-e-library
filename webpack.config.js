const path = require('path');

module.exports = {
  entry: './app.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js'
  },
  
  mode: 'development',

  watch: true,
};