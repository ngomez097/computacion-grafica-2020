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

  /**
   * Funcion para obtener la matrix de la camara.
   */
  getViewMatrix () {
    this.viewMatrix = mat4.create()
    if (this.useLookAt) {
      mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up)
    } else {
      mat4.translate(this.viewMatrix, this.viewMatrix, this.eye)

      let localMatrix = this.getAxisMatrix()
      mat4.multiply(this.viewMatrix, this.viewMatrix, localMatrix)
      mat4.invert(this.viewMatrix, this.viewMatrix)
    }
    return this.viewMatrix
  }

  /**
   * Funcion para agregar angulo sobre el eje local de roll.
   * @param {*} angle Angulo en grados.
   */
  addRoll (angle) {
    this.rotateLocal(angle, LocalAxis.AXIS.Z)
  }

  /**
   * Funcion para agregar angulo sobre el eje local de pitch.
   * @param {*} angle Angulo en grados.
   */
  addPitch (angle) {
    this.rotateLocal(angle, LocalAxis.AXIS.X)
  }

  /**
   * Funcion para agregar angulo sobre el eje local de yaw.
   * @param {*} angle Angulo en grados.
   */
  addYaw (angle) {
    this.rotateGlobal(angle, LocalAxis.AXIS.Y)
  }

  /**
   * Mover la camara hacia adelante.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveForward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(null, LocalAxis.AXIS.Z)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.sub(this.eye, this.eye, moveDirection)
  }

  /**
   * Mover la camara hacia atras.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveBackward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(null, LocalAxis.AXIS.Z)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.add(this.eye, this.eye, moveDirection)
  }

  /**
   * Mover la camara hacia la derecha.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveRight (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(null, LocalAxis.AXIS.X)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.add(this.eye, this.eye, moveDirection)
  }

  /**
   * Mover la camara hacia la izquierda.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveLeft (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(null, LocalAxis.AXIS.X)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.sub(this.eye, this.eye, moveDirection)
  }

  /**
   * Funcion para obtener la direccion de la camara.
   */
  getLookDirection () {
    return vec3.scale([], this.getLocalAxis(null, LocalAxis.AXIS.Z), -1)
  }

  /**
   * Obtencion de la matriz de proyeccion.
   */
  getProjectionMatrix () {
    return this.projectionMatrix
  }
}

module.exports = Camera
