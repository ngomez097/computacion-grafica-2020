const Camera = require('./Camera')
const mat4 = require('gl-matrix/mat4')

class PerspectiveCamera extends Camera {
  constructor (
    fov = 45,
    aspect,
    near = 0.001,
    far = 1000
  ) {
    super()
    this.fov = fov * Math.PI / 180.0
    this.aspect = aspect
    this.near = near
    this.far = far
  }

  /**
   * Funcion para establecer el fov de la camara.
   * @param {*} angle Angulo en grados.
   */
  setFovFromDegrees (angle) {
    this.fov = angle * Math.PI / 180.0
  }

  getProjectionMatrix () {
    this.projectionMatrix = mat4.create()
    mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far)
    return this.projectionMatrix
  }
}

module.exports = PerspectiveCamera
