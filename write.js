const fs = require('fs')
const UglifyJS = require("uglify-js")
const getArgv = require('./argv')

function write (path, data, minify = false) {
  let minifyRes = minify
  if (getArgv().mode.toLocaleUpperCase() === 'CSS') {
    minifyRes = false
  }
  fs.writeFileSync(path, minifyRes ? UglifyJS.minify(data).code : data)
}

module.exports = write
