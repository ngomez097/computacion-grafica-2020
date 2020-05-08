const Vec3 = require('../Utils/Vec3')
const ObjectScene = require('../Objects/ObjectScene')

class Light {
  /**
   * @param {Vec3} color
   * @param {Vec3} position
   * @param {ObjectScene} classRepresentation
   * @param {Number} intensity
   */
  constructor (
    color = new Vec3(1.0),
    position = new Vec3(0.0),
    classRepresentation = null,
    intensity = 50
  ) {
    /** @type Vec3 */ this.color = color.scale(1.0 / 255.0)
    if (position) {
      /** @type Vec3 */ this.position = position.clone()
    }
    this.enable = true
    if (classRepresentation instanceof ObjectScene) {
      this.representation = classRepresentation
    }
    this.intensity = intensity
    this.needRenderUpdate = true
  }

  /**
   * @param {Vec3} newColor
   */
  setColor (newColor) {
    if (!(newColor instanceof Vec3)) {
      console.error('newColor is not Vec3')
      return
    }

    let aux = newColor.scale(1.0 / 255.0)
    if (!this.color.equal(aux)) {
      this.color.copy(aux)
      if (this.representation) {
        this.representation.meshes[0].material.setColor(aux)
      }
      this.requireRenderUpdate()
    }
  }

  /**
   * @param {Boolean} show
   */
  showRepresentation (show) {
    if (this.representation) {
      this.representation.enableRender = show
    }
  }

  /**
   * @param {Boolean} enable
   */
  setEnable (enable) {
    if (enable !== this.enable) {
      this.enable = enable
      this.requireRenderUpdate()
    }
  }

  /**
   * @param {Number} newIntensity
   */
  setIntensity (newIntensity) {
    if (newIntensity !== this.intensity) {
      this.intensity = newIntensity
      this.requireRenderUpdate()
    }
  }

  /**
   * @param {Vec3} newPosition
   */
  setPosition (newPosition) {
    if (!(newPosition instanceof Vec3)) {
      console.error('newPosition is not Vec3')
      return
    }
    if (!this.position.equal(newPosition)) {
      this.position.copy(newPosition)
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
