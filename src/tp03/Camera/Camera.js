const mat4 = require('gl-matrix/mat4')
const vec3 = require('gl-matrix/vec3')
const LocalAxis = require('../Axis/LocalAxis')

class Camera extends LocalAxis {
  constructor (
    eye = [5, 5, 5],
    center = [0, 0, 0],
    up = [0, 1, 0],
    rotationY = 0
  ) {
    super()
    this.viewMatrix = mat4.identity([])
    this.projectionMatrix = mat4.identity([])
    this.eye = eye
    this.center = center
    this.up = up
    this.rotateY = rotationY
    this.useLookAt = false
  }

  getViewMatrix () {
    this.viewMatrix = mat4.create()
    if (this.useLookAt) {
      mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up)
    } else {
      mat4.translate(this.viewMatrix, this.viewMatrix, this.eye)
      mat4.multiply(this.viewMatrix, this.viewMatrix, this.localAxis)
      mat4.invert(this.viewMatrix, this.viewMatrix)
    }
    return this.viewMatrix
  }

  addRoll (angle) {
    this.rotateLocal(angle, LocalAxis.LOCAL_AXE.Z)
  }

  addPitch (angle) {
    this.rot = this.rotateLocal(angle, LocalAxis.LOCAL_AXE.X)
  }

  addYaw (angle) {
    this.rotateGlobal(angle, LocalAxis.LOCAL_AXE.Y)
  }

  moveForward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.LOCAL_AXE.Z)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.sub(this.eye, this.eye, moveDirection)
  }

  moveBackward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.LOCAL_AXE.Z)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.add(this.eye, this.eye, moveDirection)
  }

  moveRight (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.LOCAL_AXE.X)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.add(this.eye, this.eye, moveDirection)
  }

  moveLeft (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.LOCAL_AXE.X)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.sub(this.eye, this.eye, moveDirection)
  }

  getProjectionMatrix () {
    return this.projectionMatrix
  }
}

module.exports = Camera
