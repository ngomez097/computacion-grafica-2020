const mat4 = require('gl-matrix/mat4')

class Camera {
  constructor (
    eye = [5, 5, 5],
    center = [0, 0, 0],
    up = [0, 1, 0],
    rotate = [0, 0, 0]
  ) {
    this.viewMatrix = null
    this.projectionMatrix = null
    this.eye = eye
    this.center = center
    this.up = up
    this.rotate = rotate
  }

  getViewMatrix () {
    this.viewMatrix = mat4.create()
    mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up)
    mat4.rotateY(this.viewMatrix, this.viewMatrix, -this.rotate[1] * Math.PI / 180.0)
    return this.viewMatrix
  }

  getProjectionMatrix () {
    return this.projectionMatrix
  }
}

module.exports = Camera
