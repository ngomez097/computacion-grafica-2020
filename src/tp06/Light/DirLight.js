const Light = require('./Light')
const Vec3 = require('../Utils/Vec3')

class DirLight extends Light {
  constructor (
    intensity = 1,
    direction = new Vec3(0.0, -1.0, 0.0),
    color = new Vec3(1.0)
  ) {
    super(color, null, null, intensity)
    this.direction = direction.clone()
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
}

module.exports = DirLight
