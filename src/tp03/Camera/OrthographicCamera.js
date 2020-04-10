const Camera = require('./Camera')
const mat4 = require('gl-matrix/mat4')

class OrthographicCamera extends Camera {
  constructor (
    left = -10,
    top = 10,
    right = 10,
    bottom = -10,
    near = 0.001,
    far = 1000
  ) {
    super()
    this.left = left
    this.top = top
    this.right = right
    this.bottom = bottom
    this.near = near
    this.far = far
  }

  setFovFromDegrees (angle) {
    this.fov = angle * Math.PI / 180.0
  }

  getProjectionMatrix () {
    this.projectionMatrix = mat4.create()
    mat4.ortho(this.projectionMatrix,
      this.left, this.right, this.bottom,
      this.top, this.near, this.far)
    return this.projectionMatrix
  }
}

module.exports = OrthographicCamera
