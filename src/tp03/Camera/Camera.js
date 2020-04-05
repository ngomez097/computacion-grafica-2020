const mat4 = require('gl-matrix/mat4')

class Camera {
  constructor (
    eye = [5, 5, 5],
    center = [0, 0, 0],
    up = [0, 1, 0],
  ) {
    this.viewMatrix = null
    this.projectionMatrix = null
    this.eye = eye
    this.center = center
    this.up = up
  }

  getViewMatrix () {
    this.viewMatrix = mat4.create()
    mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up)
    return this.viewMatrix
  }

  getProjectionMatrix () {
    return this.projectionMatrix
  }
}

module.exports = Camera
