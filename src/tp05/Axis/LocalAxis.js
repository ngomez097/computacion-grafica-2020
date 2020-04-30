const mat4 = require('gl-matrix/mat4')
const utils = require('../Utils/Utils')
const radFactor = Math.PI / 180.0

// Clase que se encarga de gestionar la rotacion global y local.
// La multiplicacion de las matrices se hace en el orden ZYX
class LocalAxis {
  constructor () {
    this.rotation = [0.0, 0.0, 0.0]
    this.needUpdate = true
  }

  /**
   * Los ejes permitidos para las rotaciones globales / locales.
   */
  static get AXIS () {
    return {
      X: 0,
      Y: 1,
      Z: 2,
    }
  }

  setRotation (newRotation) {
    if (!utils.arraysEqual(newRotation, this.rotation)) {
      this.rotation = [...newRotation]
      this.needUpdate = true
    }
  }

  /**
   * Funcion para rotar al rededor de un eje arbitrario.
   * @param {*} angle Angulo en grados de la rotacion.
   * @param {*} mat La matriz de rotacion.
   * @param {*} vecAxis El eje por el cual rotar.
   */
  rotate (angle, mat, vecAxis) {
    let aux = mat4.identity([])
    angle = angle * Math.PI / 180.0

    mat4.rotate(aux, aux, angle, vecAxis)
    mat4.multiply(mat, aux, mat)
    let auxRot = this.GetRotation(mat)
    this.rotation[0] = auxRot.x
    this.rotation[1] = auxRot.y
    this.rotation[2] = auxRot.z
    this.needUpdate = true
  }

  /**
   * Función para rotar al rededor de los ejes locales.
   * @param {*} angle Angulo en grados de la rotacion.
   * @param {*} axis El eje local al cual rotar.
   */
  rotateLocal (angle, axis = LocalAxis.AXIS.X) {
    if (angle === 0) {
      return
    }
    let rot = this.getAxisMatrix()
    let localAxis = this.getLocalAxis(axis)
    this.rotate(angle, rot, localAxis)
    return this.rotation
  }

  /**
   * Función para rotar al rededor de los ejes globales.
   * @param {*} angle Angulo en grados de la rotacion.
   * @param {*} axis El eje global al cual rotar.
   */
  rotateGlobal (angle, axis = LocalAxis.AXIS.X) {
    if (angle === 0) {
      return
    }
    let rot = this.getAxisMatrix()
    switch (axis) {
      case LocalAxis.AXIS.X:
        this.rotate(angle, rot, [1, 0, 0])
        break
      case LocalAxis.AXIS.Y:
        this.rotate(angle, rot, [0, 1, 0])
        break
      case LocalAxis.AXIS.Z:
        this.rotate(angle, rot, [0, 0, 1])
        break
    }
    return this.rotation
  }

  /**
   * Función para obtener un eje local
   * @param {*} mat Matriz para obtener el eje, si es null se calcula la matriz con los valores guardados.
   * @param {*} axis El eje que se desea obtener
   */
  getLocalAxis (axis = LocalAxis.AXIS.X) {
    let mat = this.getAxisMatrix()

    let localAxis = [
      mat[axis * 4],
      mat[axis * 4 + 1],
      mat[axis * 4 + 2]
    ]
    return localAxis
  }

  /**
   * Funcion para obtener la matriz de rotacion.
   */
  getAxisMatrix () {
    if (this.needUpdate) {
      this.updateRotationMatrix()
      this.needUpdate = false
    }
    return this.rotationMatrix
  }

  updateRotationMatrix () {
    this.rotationMatrix = mat4.identity([])
    mat4.rotateX(this.rotationMatrix, this.rotationMatrix, this.rotation[0] * radFactor)
    mat4.rotateY(this.rotationMatrix, this.rotationMatrix, this.rotation[1] * radFactor)
    mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, this.rotation[2] * radFactor)
  }

  /**
   * Funcion para obtener los angulos de una matriz de rotacion en el orden ZYX.
   * @param {*} mat Matriz para extraer la rotacion.
   */
  GetRotation (mat) {
    let angles = {}
    let math = Math

    angles.x = -math.atan2(mat[9], mat[10]) * 1.0 / radFactor
    angles.y = -math.asin(-mat[8]) * 1.0 / radFactor
    angles.z = -math.atan2(mat[4], mat[0]) * 1.0 / radFactor

    return angles
  }
}

module.exports = LocalAxis
