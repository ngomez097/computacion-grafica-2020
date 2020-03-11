const RGBA = require('./rgba')
const mathUtils = require('./mathUtils')

// Se saco la forma de transformar del siguiente
// link: https://en.wikipedia.org/wiki/HSL_and_HSV
class HSL extends RGBA {
  constructor (h, s, l) {
    let rgb = [0, 0, 0]

    h = mathUtils.clamp(h, 0, 360)
    s = mathUtils.clamp(s, 0, 1)
    l = mathUtils.clamp(l, 0, 1)

    let c = (1 - Math.abs(2 * l - 1)) * s
    h = Math.trunc(h / 60)
    let x = c * (1 - Math.abs(h % 2 - 1))

    switch (h) {
      case 1:
        rgb = [c, x, 0]
        break
      case 2:
        rgb = [x, c, 0]
        break
      case 3:
        rgb = [0, c, x]
        break
      case 4:
        rgb = [0, x, c]
        break
      case 5:
        rgb = [x, 0, c]
        break
      case 6:
        rgb = [c, 0, x]
        break
    }
    super(rgb[0], rgb[1], rgb[2], 1)
  }
}

module.exports = HSL
