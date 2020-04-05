const ObjectScene = require('./ObjectScene')
const Geometry = require('../Geometry')
const Mesh = require('../Mesh')

class Cube extends ObjectScene {
  constructor (size = 1) {
    super()
    let geometry = new Geometry()
    let mesh = new Mesh(geometry)
    mesh.renderType = Mesh.RENDER_TYPE.TRIANGLES
    this.meshes.push(mesh)
    this.size = size

    this.constructCube()
  }

  constructCube () {
    let geometry = this.meshes[0].geometry
    let offset = this.size / 2
    for (let x = 0; x < 2; x++) {
      for (let z = 0; z < 2; z++) {
        geometry.addVertices(
          [offset * (2 * x - 1), offset, offset * (2 * z - 1)],
          [offset * (2 * x - 1), -offset, offset * (2 * z - 1)]
        )
      }
    }
  }
}

module.exports = Cube
