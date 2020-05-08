const mat4 = require('gl-matrix/mat4')
const quat = require('gl-matrix/quat')
const utils = require('../Utils/Utils')
const Vec3 = require('../Utils/Vec3')
const LocalAxis = require('../Axis/LocalAxis')

class ObjectProperty extends LocalAxis {
  constructor () {
    super()
    /** @type Vec3 */ this.translation = new Vec3(0.0)
    this.rotationQuaternion = [0.0, 0.0, 0.0, 0.0]
    /** @type Vec3 */ this.scale = new Vec3(1.0)
    this.useQuaternion = false
  }

  /**
   * @param {Vec3} newTraslation
   */
  setTraslation (newTraslation) {
    if (!(newTraslation instanceof Vec3)) {
      console.error('newTraslation is not Vec3')
      return
    }

    if (!this.translation.equal(newTraslation)) {
      this.translation = newTraslation.clone()
      this.needUpdate = true
    }
  }

  setRotationQuaternion (newRotation) {
    if (!utils.arraysEqual(newRotation, this.rotationQuaternion)) {
      this.rotationQuaternion = [...newRotation]
      this.needUpdate = true
    }
  }

  /**
   * @param {Vec3} newScale
   */
  setScale (newScale) {
    if (!(newScale instanceof Vec3)) {
      console.error('newScale is not Vec3')
      return
    }
    if (!this.scale.equal(newScale)) {
      this.scale = newScale.clone()
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

    mat4.translate(this.modelMatrix, this.modelMatrix, this.translation.toArray())

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

    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale.toArray())

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
