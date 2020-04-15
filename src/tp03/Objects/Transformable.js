const mat4 = require('gl-matrix/mat4')
const quat = require('gl-matrix/quat')
const LocalAxis = require('../Axis/LocalAxis')

class Transformable extends LocalAxis {
  constructor () {
    super()
    this.t = [0.0, 0.0, 0.0]
    this.r = [0.0, 0.0, 0.0]
    this.rq = [0.0, 0.0, 0.0, 0.0]
    this.s = [1.0, 1.0, 1.0]
    this.useQuaternion = false
  }

  getModelMatrix () {
    this.modelMatrix = mat4.create()
    let rotMat = mat4.create()

    mat4.translate(this.modelMatrix, this.modelMatrix, this.t)

    // Rotate Global Axis
    if (this.useQuaternion) {
      let q = quat.create()
      quat.normalize(q, this.rq)
      mat4.fromQuat(rotMat, q)
      mat4.multiply(this.modelMatrix, this.modelMatrix, rotMat)
    } else {
      mat4.rotateX(this.modelMatrix, this.modelMatrix, this.r[0] * Math.PI / 180.0)
      mat4.rotateY(this.modelMatrix, this.modelMatrix, this.r[1] * Math.PI / 180.0)
      mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.r[2] * Math.PI / 180.0)
    }

    // Rotate Local Axis
    mat4.multiply(this.modelMatrix, this.modelMatrix, this.localAxis)

    mat4.scale(this.modelMatrix, this.modelMatrix, this.s)
    return this.modelMatrix
  }
}

module.exports = Transformable
