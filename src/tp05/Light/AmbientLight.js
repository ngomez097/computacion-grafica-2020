const Light = require('./Light')

class AmbientLight extends Light {
  constructor (
    color = [0.0, 0.0, 0.0],
    intensity = 0.1
  ) {
    super(color, [], null, intensity)
  }
}

module.exports = AmbientLight
