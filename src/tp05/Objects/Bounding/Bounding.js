const Mesh = require('./BoundingMesh')

class Bounding {
  constructor () {
    this.internalBoundings = []
    let mesh = new Mesh()
    mesh.renderType = Mesh.RENDER_TYPE.LINES
    this.lines = mesh
    this.show = false
  }
}

module.exports = Bounding
