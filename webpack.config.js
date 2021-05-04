const path = require('path');
module.exports = {
  mode: 'development',
  entry: ['./dist/liefs-layout-managerV3_FULL_MODULE.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'liefs-layout-managerV3_SCOPED.js',
    library: {name: "llm",
              type: 'var'}
  },
};