const Light = require('./Light')
const utils = require('../Utils/Utils')

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
    this.direction = [...direction]
    this.angle = angle
  }

  setDirection (newDirection) {
    if (!utils.arraysEqual(newDirection, this.direction)) {
      this.direction = [...newDirection]
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
