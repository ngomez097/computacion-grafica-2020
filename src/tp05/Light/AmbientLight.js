const Light = require('./Light')
const Vec3 = require('../Utils/Vec3')

class AmbientLight extends Light {
  constructor (
    color = new Vec3(1.0),
    intensity = 0.1
  ) {
    super(color, null, null, intensity)
  }
}

module.exports = AmbientLight
