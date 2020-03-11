const RGBA = require('./rgba')

// Se saco la forma de transformar del siguiente
// link: https://en.wikipedia.org/wiki/HSL_and_HSV
class HSL extends RGBA {
  constructor (r = 1, g = 1, b = 1) {
    super(r, g, b, 1)
  }
}

module.exports = HSL
