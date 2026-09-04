const path = require('path');
module.exports = {
  entry: './src/test-algorithms.js',
  target: 'node',
  output: { path: path.resolve(__dirname, 'dist'), filename: 'test.js' },
  mode: 'development'
};
