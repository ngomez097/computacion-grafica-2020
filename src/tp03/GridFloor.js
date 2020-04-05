const ObjectScene = require('./ObjectScene')
const Geometry = require('./Geometry')
const Mesh = require('./Mesh')

class GridFloor extends ObjectScene {
  constructor (size = 10) {
    super()
    let geometry = new Geometry()
    let mesh = new Mesh(geometry, [1.0, 1.0, 1.0], Mesh.RENDER_TYPE.LINES)
    this.meshes.push(mesh)
    this.size = size
    this.calculateGrid()
  }

  calculateGrid () {
    let geometry = this.meshes[0].geometry
    let offset = this.size / 2.0
    let i = 0
    for (let z = -offset; z <= offset; z++) {
      geometry.addVertices(
        [-offset, 0, z],
        [offset, 0, z]
      )
      geometry.addFaces([i, i + 1])
      i += 2
    }

    for (let x = -offset + 1; x <= offset - 1; x++) {
      geometry.addVertices(
        [x, 0, -offset],
        [x, 0, offset]
      )
      geometry.addFaces([i, i + 1])
      i += 2
    }
  }
}

module.exports = GridFloor
