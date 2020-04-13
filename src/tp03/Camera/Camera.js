const mat4 = require('gl-matrix/mat4')
const vec3 = require('gl-matrix/vec3')

class Camera {
  constructor (
    eye = [5, 5, 5],
    center = [0, 0, 0],
    up = [0, 1, 0],
    rpy = [0, 0, 0]
  ) {
    this.viewMatrix = null
    this.projectionMatrix = null
    this.eye = eye
    this.center = center
    this.up = up
    // Roll, Pitch, Yaw
    this.rpy = rpy
  }

  getViewMatrix () {
    this.viewMatrix = mat4.create()
    let direction = []
    let aux = []
    direction[0] = Math.cos(this.radians(this.rpy[2])) * Math.cos(this.radians(this.rpy[1]))
    direction[1] = Math.sin(this.radians(this.rpy[1]))
    direction[2] = Math.sin(this.radians(this.rpy[2])) * Math.cos(this.radians(this.rpy[1]))
    vec3.normalize(direction, direction)
    vec3.add(aux, this.eye, direction)
    mat4.lookAt(this.viewMatrix, this.eye, aux, this.up)
    return this.viewMatrix
  }

  getProjectionMatrix () {
    return this.projectionMatrix
  }

  radians (angle) {
    return angle * Math.PI / 180.0
  }
}

module.exports = Camera
