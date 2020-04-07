const ObjectScene = require('./ObjectScene')

class Cube extends ObjectScene {
  constructor (size = 1) {
    super()
    this.size = size

    this.constructCube()
  }

  constructCube () {
    let offset = this.size / 2
    let mesh = this.meshes[0]

    let fixedPosition
    for (let y = 0; y < 2; y++) {
      // Abajo y Arriba
      fixedPosition = (2 * y - 1) * offset
      mesh.insertPlane(
        [-offset, fixedPosition, -offset],
        [-offset, fixedPosition, offset],
        [offset, fixedPosition, offset],
        [offset, fixedPosition, -offset]
      )

      // Atras y Frente
      mesh.insertPlane(
        [-offset, -offset, fixedPosition],
        [-offset, offset, fixedPosition],
        [offset, offset, fixedPosition],
        [offset, -offset, fixedPosition]
      )

      // Izquierda y Derecha
      mesh.insertPlane(
        [fixedPosition, -offset, -offset],
        [fixedPosition, -offset, offset],
        [fixedPosition, offset, offset],
        [fixedPosition, offset, -offset]
      )
    }
  }
}

module.exports = Cube
