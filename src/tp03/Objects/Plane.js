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
    this.constructPlane(vertices)
  }

  constructPlane (vertices) {
    let geometry = this.meshes[0].geometry
    let offset = this.size / 2.0
    let faces
    if (vertices.length === 0) {
      faces = geometry.addVertices(
        [-offset, 0.0, -offset],
        [-offset, 0.0, offset],
        [offset, 0.0, offset],
        [offset, 0.0, -offset]
      )
    } else {
      faces = geometry.addVertices(vertices[0],
        vertices[1],
        vertices[2],
        vertices[3]
      )
    }

    geometry.addFaces(
      [faces[0], faces[1], faces[2]],
      [faces[0], faces[2], faces[3]]
    )
  }
}

module.exports = Plane
