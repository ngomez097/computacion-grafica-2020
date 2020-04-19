const Light = require('./Light')

class DirLight extends Light {
  constructor (
    direction = [0.0, -1.0, 0.0],
    color = [1.0, 1.0, 1.0]) {
    super(color)
    this.direction = direction
  }
}

module.exports = DirLight
