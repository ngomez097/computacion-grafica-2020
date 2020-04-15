const mat4 = require('gl-matrix/mat4')

class LocalAxis {
  constructor () {
    this.localAxis = mat4.identity([])
  }

  static get LOCAL_AXE () {
    return {
      X: 0,
      Y: 1,
      Z: 2,
    }
  }

  /**
   * Función para rotar con los ejes locales de los objetos
   * @param {*} angle Angulo en grados de la rotacion.
   * @param {*} axis {LocalAxis.LOCAL_AXE} El eje local al cual rotar
   */
  rotateLocal (angle, axis = LocalAxis.LOCAL_AXE.X) {
    if (angle === 0) {
      return
    }
    let aux = mat4.identity([])
    let localAxis = [
      this.localAxis[axis * 4],
      this.localAxis[axis * 4 + 1],
      this.localAxis[axis * 4 + 2]
    ]

    angle = angle * Math.PI / 180.0

    mat4.rotate(aux, aux, angle, localAxis)
    mat4.multiply(this.localAxis, aux, this.localAxis)
  }

  rotateGlobal (angle, axis = LocalAxis.LOCAL_AXE.X) {
    if (angle === 0) {
      return
    }
    let aux = mat4.identity([])
    angle = angle * Math.PI / 180.0

    switch (axis) {
      case LocalAxis.LOCAL_AXE.X:
        mat4.rotateX(aux, aux, angle)
        break
      case LocalAxis.LOCAL_AXE.Y:
        mat4.rotateY(aux, aux, angle)
        break
      case LocalAxis.LOCAL_AXE.Z:
        mat4.rotateZ(aux, aux, angle)
        break
    }

    mat4.multiply(this.localAxis, aux, this.localAxis)
  }

  getLocalAxis (axe = LocalAxis.LOCAL_AXE.X) {
    let localAxis = [
      this.localAxis[axe * 4],
      this.localAxis[axe * 4 + 1],
      this.localAxis[axe * 4 + 2]
    ]
    return localAxis
  }
}

module.exports = LocalAxis
