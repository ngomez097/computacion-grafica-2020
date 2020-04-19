const Light = require('./Light')

class PointLight extends Light {
  constructor (
    position = [0.0, 0.0, 0.0],
    intensity = 1.0,
    color = [1.0, 1.0, 1.0],
    classRepresentation = null
  ) {
    super(color, position, classRepresentation)
    this.intensity = intensity
  }
}

module.exports = PointLight
