const ObjectScene = require('./ObjectScene')
const Mesh = require('./Mesh')

class GridFloor extends ObjectScene {
  /**
   * @param {*} size Tamaño de la grilla.
   * @param {*} gap Tamaño de los cuadrados de la grilla.
   */
  constructor (size = 10, gap = 1.0) {
    super()
    this.size = size
    this.gap = gap
    this.meshes[0].renderType = Mesh.RENDER_TYPE.LINES
    this.meshes[0].useNormal = false
    this.calculateGrid()
  }

  calculateGrid () {
    let geometry = this.meshes[0].geometry
    let offset = this.size / 2.0
    let index
    // Paralelas a X
    for (let z = -offset; z <= offset; z += this.gap) {
      index = geometry.addVertices([
        [-offset, 0, z],
        [offset, 0, z]
      ])
      geometry.addFaces([index[0], index[1]])
    }

    // Paralelas a Z
    for (let x = -offset; x <= offset; x += this.gap) {
      index = geometry.addVertices([
        [x, 0, -offset],
        [x, 0, offset]
      ])
      geometry.addFaces([index[0], index[1]])
    }
  }
}

module.exports = GridFloor
