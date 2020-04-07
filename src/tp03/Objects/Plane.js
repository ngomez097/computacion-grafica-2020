const ObjectScene = require('./ObjectScene')

class Plane extends ObjectScene {
  constructor (size = 1, ...vertices) {
    super()
    this.size = size
    this.constructPlane(vertices)
  }

  constructPlane (vertices) {
    let mesh = this.meshes[0]
    let offset = this.size / 2.0

    if (vertices.length === 0) {
      mesh.insertPlane(
        [-offset, 0.0, -offset],
        [-offset, 0.0, offset],
        [offset, 0.0, offset],
        [offset, 0.0, -offset]
      )
    } else {
      mesh.insertPlane(vertices[0],
        vertices[1],
        vertices[2],
        vertices[3]
      )
    }
  }
}

module.exports = Plane
