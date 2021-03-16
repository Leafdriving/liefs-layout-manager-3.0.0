const path = require('path');
module.exports = {
  mode: 'development',
  entry: ['./dist/liefs-layout-managerV3.0.0.GLOBALS.full.module.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'liefs-layout-managerV3.0.0.SCOPED.full.js',
    library: {name: "llm",
              type: 'var'}
  },
};