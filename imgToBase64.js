const fs = require('fs')

module.exports = function imgToBase64 (path) {
  const imageBase64 = fs.readFileSync(path).toString('base64')
  const imagePrefix = 'data:image/png;base64,'
  return imagePrefix + imageBase64
}