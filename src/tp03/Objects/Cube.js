const ObjectScene = require('./ObjectScene')
const Geometry = require('./Geometry')
const Mesh = require('./Mesh')

class Cube extends ObjectScene {
  constructor (size = 1) {
    super()
    let geometry = new Geometry()
    let mesh = new Mesh(geometry)
    mesh.renderType = Mesh.RENDER_TYPE.TRIANGLES
    mesh.material = [0.8, 0.8, 0.8]
    this.meshes.push(mesh)
    this.size = size

    this.constructCube()
  }

  constructCube () {
    let offset = this.size / 2

    let fixedPosition
    for (let y = 0; y < 2; y++) {
      // Abajo y Arriba
      fixedPosition = (2 * y - 1) * offset
      this.insertPlane(0,
        [-offset, fixedPosition, -offset],
        [-offset, fixedPosition, offset],
        [offset, fixedPosition, offset],
        [offset, fixedPosition, -offset]
      )

      // Atras y Frente
      this.insertPlane(0,
        [-offset, -offset, fixedPosition],
        [-offset, offset, fixedPosition],
        [offset, offset, fixedPosition],
        [offset, -offset, fixedPosition]
      )

      // Izquierda y Derecha
      this.insertPlane(0,
        [fixedPosition, -offset, -offset],
        [fixedPosition, -offset, offset],
        [fixedPosition, offset, offset],
        [fixedPosition, offset, -offset]
      )
    }
  }
}

module.exports = Cube
