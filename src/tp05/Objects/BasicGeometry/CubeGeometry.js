const Geometry = require('../Geometry')
const Vec3 = require('../../Utils/Vec3')

class CubeGeometry extends Geometry {
  /**
   * @param {*} size Tamaño de los lados del cubo.
   */
  constructor (
    size = 1, flipNormal = false) {
    super()
    this.constructCube(size, flipNormal)
  }

  /**
   * Metodo que calcula los vertices del cubo y los introduce en la geometria.
   * @param {*} size Tamaño de los lados del cubo.
   */
  constructCube (size, flipNormal = false, uvSize = 5) {
    this.clearData()
    let offset = size / 2.0

    let fixedPosition
    for (let y = 0; y < 2; y++) {
      // Abajo y Arriba
      fixedPosition = (2 * y - 1) * offset
      this.insertPlane([
        new Vec3(-offset, fixedPosition, -offset),
        new Vec3(offset, fixedPosition, -offset),
        new Vec3(offset, fixedPosition, offset),
        new Vec3(-offset, fixedPosition, offset),
      ], true, (y + flipNormal) % 2, uvSize)

      // Atras y Frente
      this.insertPlane([
        new Vec3(-offset, -offset, fixedPosition),
        new Vec3(-offset, offset, fixedPosition),
        new Vec3(offset, offset, fixedPosition),
        new Vec3(offset, -offset, fixedPosition)
      ], true, (y + flipNormal) % 2, uvSize)

      // Izquierda y Derecha
      this.insertPlane([
        new Vec3(fixedPosition, -offset, -offset),
        new Vec3(fixedPosition, -offset, offset),
        new Vec3(fixedPosition, offset, offset),
        new Vec3(fixedPosition, offset, -offset)
      ], true, (y + flipNormal) % 2, uvSize)
    }
    this.hasChanged = true
  }
}

module.exports = CubeGeometry
