const RGBA = require('./rgba')

class RGB extends RGBA {
  constructor (r = 1, g = 1, b = 1) {
    super(r, g, b, 1)
  }
}

module.exports = RGB
