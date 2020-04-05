const ObjectScene = require('./ObjectScene')
const Geometry = require('../Geometry')
const Mesh = require('../Mesh')

class Plane extends ObjectScene {
  constructor (size = 1, ...vertices) {
    super()
    let geometry = new Geometry()
    let mesh = new Mesh(geometry)
    mesh.material = [0.8, 0.8, 0.8]
    this.meshes.push(mesh)
    this.size = size
    console.log(vertices)
    this.constructPlane(vertices)
  }

  constructPlane (vertices) {
    let geometry = this.meshes[0].geometry
    let offset = this.size / 2.0
    console.log(vertices)
    if (vertices.length === 0) {
      geometry.addVertices(
        [-offset, 0.0, -offset],
        [-offset, 0.0, offset],
        [offset, 0.0, offset],
        [offset, 0.0, -offset]
      )
    } else {
      geometry.addVertices(vertices[0],
        vertices[1],
        vertices[2],
        vertices[3]
      )
    }

    geometry.addFaces(
      [0, 1, 2],
      [0, 2, 3]
    )
  }
}

module.exports = Plane
