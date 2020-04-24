const Light = require('./Light')

class DirLight extends Light {
  constructor (
    intensity = 1,
    direction = [0.0, -1.0, 0.0],
    color = [1.0, 1.0, 1.0]) {
    super(color, null, null, intensity)
    this.direction = direction
  }
}

module.exports = DirLight
