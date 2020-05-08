const mat4 = require('gl-matrix/mat4')
const Vec3 = require('../Utils/Vec3')
const LocalAxis = require('../Axis/LocalAxis')

class Camera extends LocalAxis {
  constructor (
    eye = new Vec3(5),
    center = new Vec3(),
    up = new Vec3(0, 1, 0),
    rotationY = 0
  ) {
    super()
    this.viewMatrix = mat4.identity([])
    this.projectionMatrix = mat4.identity([])
    /** @type Vec3 */ this.eye = eye
    /** @type Vec3 */ this.center = center
    /** @type Vec3 */ this.up = up
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
    if (!(newPosition instanceof Vec3)) {
      console.error('newPosition is not Vec3')
      return 0
    }

    if (!this.eye.equal(newPosition)) {
      this.eye.copy(newPosition)
      this.requireViewMatrixUpdate()
    }
  }

  setLookAt (newLookAt) {
    if (newLookAt instanceof Vec3) {
      if (!this.center.equal(newLookAt)) {
        this.center = newLookAt.clone()
        this.requireViewMatrixUpdate()
      }
    } else {
      console.error('newLookAt is not Vec3')
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
    this.eye.copy(
      this.eye.sub(moveDirection.scale(velocity))
    )
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia atras.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveBackward (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.Z)
    this.eye.copy(this.eye.add(moveDirection.scale(velocity)))
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia la derecha.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveRight (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.X)
    this.eye.copy(this.eye.add(moveDirection.scale(velocity)))
    this.requireViewMatrixUpdate()
  }

  /**
   * Mover la camara hacia la izquierda.
   * @param {*} velocity Velocidad para desplazar la camara.
   */
  moveLeft (velocity = 0.2) {
    let moveDirection = this.getLocalAxis(LocalAxis.AXIS.X)
    this.eye.copy(this.eye.sub(moveDirection.scale(velocity)))
    this.requireViewMatrixUpdate()
  }

  /**
   * Funcion para obtener la direccion de la camara.
   */
  getLookDirection () {
    return this.getLocalAxis(LocalAxis.AXIS.Z).invert()
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
      mat4.lookAt(this.viewMatrix, this.eye.toArray(), this.center.toArray(), this.up.toArray())
    } else {
      mat4.translate(this.viewMatrix, this.viewMatrix, this.eye.toArray())

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
