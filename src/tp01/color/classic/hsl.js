const RGBA = require('./rgba')
const mathUtils = require('./mathUtils')

// Se saco la forma de transformar del siguiente
// link: https://en.wikipedia.org/wiki/HSL_and_HSV
class HSL extends RGBA {
  constructor (h, s, l) {
    let hsl = [0, 0, 0]
    hsl[0] = mathUtils.clamp(h, 0, 360)
    hsl[1] = mathUtils.clamp(s, 0, 1)
    hsl[2] = mathUtils.clamp(l, 0, 1)

    let r = mathUtils.hslF(0, hsl)
    let g = mathUtils.hslF(8, hsl)
    let b = mathUtils.hslF(4, hsl)
    super(r, g, b, 1)
  }
}

module.exports = HSL
