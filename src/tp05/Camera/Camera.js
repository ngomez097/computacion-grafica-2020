const mat4 = require('gl-matrix/mat4')
const vec3 = require('gl-matrix/vec3')
const utils = require('../Utils/Utils')
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

    this.viewMatrixNeedUpdate = true
    this.projectionMatrixNeedUpdate = true
    this.VMNeedRenderUpdate = true
    this.PMNeedRenderUpdate = true
  }

  /**
   * Funcion para obtener la matrix de la camara.
   */
  getViewMatrix () {
    if (this.viewMatrixNeedUpdate) {
      this.updateViewMatrix()
      this.VMNeedRenderUpdate = true
    }
    return mat4.clone(this.viewMatrix)
  }

  /**
   * Obtencion de la matriz de proyeccion.
   */
  getProjectionMatrix () {
    if (this.projectionMatrixNeedUpdate) {
      this.updateProjectionMatrix()
      this.PMNeedRenderUpdate = true
    }
    return mat4.clone(this.projectionMatrix)
  }

  setPosition (newPosition) {
    if (!utils.arraysEqual(this.eye, newPosition)) {
      this.eye = [...newPosition]
      this.requireViewMatrixUpdate()
    }
  }

  setLookAt (newLookAt) {
    if (!utils.arraysEqual(this.center, newLookAt)) {
      this.center = [...newLookAt]
      this.requireViewMatrixUpdate()
    }
  }

  /**
   * Funcion para agregar angulo sobre el eje local de roll.
   * @param {*} angle Angulo en grados.
   */
  addRoll (angle) {
    this.rotateLocal(angle, LocalAxis.AXIS.Z)
    this.requireViewMatrixUpdate()
  }

  /**
   * Funcion para agregar angulo sobre el eje local de pitch.
   * @param {*} angle Angulo en grados.
   */
  addPitch (angle) {
    this.rotateLocal(angle, LocalAxis.AXIS.X)
    this.requireViewMatrixUpdate()
  }

  /**
   * Funcion para agregar angulo sobre el eje local de yaw.
   * @param {*} angle Angulo en grados.
   */
  addYaw (angle) {
    this.rotateGlobal(angle, LocalAxis.AXIS.Y)
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia adelante.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveForward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.Z)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.sub(this.eye, this.eye, moveDirection)
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia atras.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveBackward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.Z)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.add(this.eye, this.eye, moveDirection)
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia la derecha.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveRight (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.X)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.add(this.eye, this.eye, moveDirection)
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia la izquierda.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveLeft (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.X)
    vec3.scale(moveDirection, moveDirection, velocity)
    vec3.sub(this.eye, this.eye, moveDirection)
    this.requireViewMatrixUpdate()
  }

  /**
   * Funcion para obtener la direccion de la camara.
   */
  getLookDirection () {
    return vec3.scale([], this.getLocalAxis(LocalAxis.AXIS.Z), -1)
  }

  setLookAtEnable (enable) {
    if (this.useLookAt !== enable) {
      this.useLookAt = enable
      this.requireViewMatrixUpdate()
    }
  }

  updateViewMatrix () {
    this.viewMatrix = mat4.create()
    if (this.useLookAt) {
      mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up)
    } else {
      mat4.translate(this.viewMatrix, this.viewMatrix, this.eye)

      let localMatrix = this.getAxisMatrix()
      mat4.multiply(this.viewMatrix, this.viewMatrix, localMatrix)
      mat4.invert(this.viewMatrix, this.viewMatrix)
    }
    this.viewMatrixNeedUpdate = false
  }

  updateProjectionMatrix () {
    console.log('La funcion updateProjectionMatrix no esta implementada para este tipo de camara.')
  }

  requireViewMatrixUpdate () {
    this.viewMatrixNeedUpdate = true
    this.VMNeedRenderUpdate = true
  }

  requireProyectionMatrixUpdate () {
    this.projectionMatrixNeedUpdate = true
    this.PMNeedRenderUpdate = true
  }
}

module.exports = Camera
