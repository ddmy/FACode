const fs = require('fs')
const UglifyJS = require("uglify-js")

function write (path, data, minify = false) {
  fs.writeFileSync(path, minify ? UglifyJS.minify(data).code : data)
}

module.exports = write
