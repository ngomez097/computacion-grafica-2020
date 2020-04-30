const vec3 = require('gl-matrix/vec3')
const utils = require('../Utils/Utils')

class Light {
  constructor (
    color = [1.0, 1.0, 1.0],
    position = [0.0, 0.0, 0.0],
    classRepresentation = null,
    intensity = 50
  ) {
    this.color = [...color]
    this.position = [...position]
    this.enable = true
    this.representation = classRepresentation
    this.intensity = intensity
    this.needRenderUpdate = true
  }

  setColor (newColor) {
    let aux = []
    vec3.scale(aux, newColor, 1.0 / 255.0)
    if (!utils.arraysEqual(this.color, aux)) {
      this.color = [...aux]
      if (this.representation) {
        this.representation.meshes[0].setColor(aux)
      }
      this.requireRenderUpdate()
    }
  }

  setEnable (enable) {
    if (enable !== this.enable) {
      this.enable = enable
      this.requireRenderUpdate()
    }
  }

  setIntensity (newIntensity) {
    if (newIntensity !== this.intensity) {
      this.intensity = newIntensity
      this.requireRenderUpdate()
    }
  }

  setPosition (newPosition) {
    if (!utils.arraysEqual(newPosition, this.position)) {
      this.position = [...newPosition]
      if (this.representation) {
        this.representation.setTraslation(newPosition)
      }

      this.requireRenderUpdate()
    }
  }

  requireRenderUpdate () {
    this.needRenderUpdate = true
  }
}

module.exports = Light
