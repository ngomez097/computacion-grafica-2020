const mathUtils = require('./mathUtils')

class RGBA {
  constructor (r, g, b, a) {
    this.r = mathUtils.clamp(r, 0, 1)
    this.g = mathUtils.clamp(g, 0, 1)
    this.b = mathUtils.clamp(b, 0, 1)
    this.a = mathUtils.clamp(a, 0, 1)
  }

  vec3 () {
    return [this.r, this.g, this.b]
  }

  vec4 () {
    return [this.r, this.g, this.b, this.a]
  }
}

module.exports = RGBA
