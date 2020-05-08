const Light = require('./Light')
const Vec3 = require('../Utils/Vec3')
const utils = require('../Utils/Utils')

class SpotLight extends Light {
  constructor (
    angle = 0.8,
    position = new Vec3(),
    intensity = 1.0,
    color = new Vec3(1.0),
    direction = new Vec3(0.0, -1.0, 0.0),
    classRepresentation = null
  ) {
    super(color, position, classRepresentation, intensity)
    this.direction = direction.clone()
    this.angle = utils.clamp(Math.cos(utils.toRadian(angle)), 0.001, 0.999)
  }

  /**
   * @param {Vec3} newDirection
   */
  setDirection (newDirection) {
    if (!(newDirection instanceof Vec3)) {
      console.error('newDirection is not Vec3')
      return
    }
    if (!this.direction.equal(newDirection)) {
      this.direction.copy(newDirection)
      this.requireRenderUpdate()
    }
  }

  setAngle (newAngle) {
    let aux = utils.toRadian(newAngle)
    aux = Math.cos(aux)
    aux = utils.clamp(aux, 0.001, 0.999)
    if (aux !== this.angle) {
      this.angle = aux
      this.requireRenderUpdate()
    }
  }
}

module.exports = SpotLight
