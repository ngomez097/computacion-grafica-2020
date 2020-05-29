const Light = require('./Light')
const Vec3 = require('../Utils/Vec3')

class PointLight extends Light {
  constructor (
    position = new Vec3(0.0),
    intensity = 1.0,
    color = new Vec3(1.0),
    classRepresentation = null
  ) {
    super(color, position, classRepresentation, intensity)
  }
}

module.exports = PointLight
