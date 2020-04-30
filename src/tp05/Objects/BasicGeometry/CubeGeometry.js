const Geometry = require('../Geometry')

class CubeGeometry extends Geometry {
  /**
   * @param {*} size Tamaño de los lados del cubo.
   */
  constructor (
    size = 1) {
    super()
    this.constructCube(size)
  }

  /**
   * Metodo que calcula los vertices del cubo y los introduce en la geometria.
   * @param {*} size Tamaño de los lados del cubo.
   */
  constructCube (size, flipNormal = false) {
    this.clearData()
    let offset = size / 2.0

    let fixedPosition
    for (let y = 0; y < 2; y++) {
      // Abajo y Arriba
      fixedPosition = (2 * y - 1) * offset
      this.insertPlane([
        [-offset, fixedPosition, -offset],
        [offset, fixedPosition, -offset],
        [offset, fixedPosition, offset],
        [-offset, fixedPosition, offset],
      ], true, (y + flipNormal) % 2)

      // Atras y Frente
      this.insertPlane([
        [-offset, -offset, fixedPosition],
        [-offset, offset, fixedPosition],
        [offset, offset, fixedPosition],
        [offset, -offset, fixedPosition]
      ], true, (y + flipNormal) % 2)

      // Izquierda y Derecha
      this.insertPlane([
        [fixedPosition, -offset, -offset],
        [fixedPosition, -offset, offset],
        [fixedPosition, offset, offset],
        [fixedPosition, offset, -offset]
      ], true, (y + flipNormal) % 2)
    }
    this.hasChanged = true
  }
}

module.exports = CubeGeometry
