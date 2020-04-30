const mat4 = require('gl-matrix/mat4')
const quat = require('gl-matrix/quat')
const utils = require('../Utils/Utils')
const LocalAxis = require('../Axis/LocalAxis')

class ObjectProperty extends LocalAxis {
  constructor () {
    super()
    this.translation = [0.0, 0.0, 0.0]
    this.rotationQuaternion = [0.0, 0.0, 0.0, 0.0]
    this.scale = [1.0, 1.0, 1.0]
    this.useQuaternion = false
  }

  setTraslation (newTraslation) {
    if (!utils.arraysEqual(newTraslation, this.translation)) {
      this.translation = [...newTraslation]
      this.needUpdate = true
    }
  }

  setRotationQuaternion (newRotation) {
    if (!utils.arraysEqual(newRotation, this.rotationQuaternion)) {
      this.rotationQuaternion = [...newRotation]
      this.needUpdate = true
    }
  }

  setScale (newScale) {
    if (!utils.arraysEqual(newScale, this.scale)) {
      this.scale = [...newScale]
      this.needUpdate = true
    }
  }

  getModelMatrix () {
    if (this.needUpdate) {
      this.updateModelMatrix()
    }
    return mat4.clone(this.modelMatrix)
  }

  /**
   * Funcion para obtener la matriz del objeto.
   */
  updateModelMatrix () {
    this.modelMatrix = mat4.create()
    let rotMat = mat4.create()

    mat4.translate(this.modelMatrix, this.modelMatrix, this.translation)

    // Rotate Global Axis
    if (this.useQuaternion) {
      let q = quat.create()
      quat.normalize(q, this.rotationQuaternion)
      mat4.fromQuat(rotMat, q)
      mat4.multiply(this.modelMatrix, this.modelMatrix, rotMat)
    }

    // Rotate Local Axis
    let localAxis = this.getAxisMatrix()
    mat4.multiply(this.modelMatrix, this.modelMatrix, localAxis)

    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale)

    this.needUpdate = false

    return this.modelMatrix
  }

  getInverseTransposeMatrix (ModelMatrix) {
    let aux = mat4.clone(ModelMatrix)
    mat4.invert(aux, aux)
    mat4.transpose(aux, aux)
    return aux
  }
}

module.exports = ObjectProperty
