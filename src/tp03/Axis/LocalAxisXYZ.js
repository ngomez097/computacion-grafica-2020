const mat4 = require('gl-matrix/mat4')
const radFactor = Math.PI / 180.0

class LocalAxis {
  constructor () {
    this.rotation = [0.0, 0.0, 0.0]
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
    let rot = this.getAxisMatrix()
    let localAxis = [
      rot[axis * 4],
      rot[axis * 4 + 1],
      rot[axis * 4 + 2]
    ]

    angle = angle * Math.PI / 180.0

    mat4.rotate(aux, aux, angle, localAxis)
    mat4.multiply(rot, aux, rot)
    let auxRot = this.GetRotation(rot)
    this.rotation[0] = auxRot.x
    this.rotation[1] = auxRot.y
    this.rotation[2] = auxRot.z
  }

  rotateGlobal (angle, axis = LocalAxis.LOCAL_AXE.X) {
    if (angle === 0) {
      return
    }
    angle = angle * Math.PI / 180.0

    switch (axis) {
      case LocalAxis.LOCAL_AXE.X:
        this.rotation[0] += angle
        break
      case LocalAxis.LOCAL_AXE.Y:
        this.rotation[1] += angle
        break
      case LocalAxis.LOCAL_AXE.Z:
        this.rotation[2] += angle
        break
    }
  }

  getLocalAxis (mat, axe = LocalAxis.LOCAL_AXE.X) {
    if (mat === null) {
      mat = this.getAxisMatrix()
    }
    let localAxis = [
      mat[axe * 4],
      mat[axe * 4 + 1],
      mat[axe * 4 + 2]
    ]
    return localAxis
  }

  getAxisMatrix () {
    let rot = mat4.identity([])
    mat4.rotateX(rot, rot, this.rotation[0] * radFactor)
    mat4.rotateY(rot, rot, this.rotation[1] * radFactor)
    mat4.rotateZ(rot, rot, this.rotation[2] * radFactor)
    return rot
  }

  GetRotation (mat) {
    let angles = {}
    let math = Math

    let sy = math.sqrt(mat[0] * mat[0] + mat[4] * mat[4])
    let singular = sy < 1e-6
    if (!singular) {
      angles.x = -math.atan2(mat[9], mat[10])
      angles.y = -math.atan2(-mat[8], sy)
      angles.z = -math.atan2(mat[4], mat[0])
    } else {
      angles.x = -math.atan2(-mat[6], mat[5])
      angles.y = -math.atan2(-mat[8], sy)
      angles.z = 0
    }
    angles.x *= 1 / radFactor
    angles.y *= 1 / radFactor
    angles.z *= 1 / radFactor
    return angles
  }
}

module.exports = LocalAxis
