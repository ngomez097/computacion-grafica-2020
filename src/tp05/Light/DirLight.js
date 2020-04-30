const Light = require('./Light')
const utils = require('../Utils/Utils')

class DirLight extends Light {
  constructor (
    intensity = 1,
    direction = [0.0, -1.0, 0.0],
    color = [1.0, 1.0, 1.0]) {
    super(color, [], null, intensity)
    this.direction = [...direction]
  }

  setDirection (newDirection) {
    if (!utils.arraysEqual(newDirection, this.direction)) {
      this.direction = [...newDirection]
      this.requireRenderUpdate()
    }
  }
}

module.exports = DirLight
