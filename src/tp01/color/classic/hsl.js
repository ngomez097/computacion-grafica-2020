const RGBA = require('./rgba')
const mathUtils = require('./mathUtils')

class HSL extends RGBA {
  constructor (h, s, l) {
    let hsl = []
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
