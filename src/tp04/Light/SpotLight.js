const Light = require('./Light')

class SpotLight extends Light {
  constructor (
    angle = 0.8,
    position = [0.0, 0.0, 0.0],
    intensity = 1.0,
    color = [1.0, 1.0, 1.0],
    direction = [0.0, -1.0, 0.0],
    classRepresentation = null
  ) {
    super(color, position, classRepresentation, intensity)
    this.direction = direction
    this.angle = angle
  }
}

module.exports = SpotLight
