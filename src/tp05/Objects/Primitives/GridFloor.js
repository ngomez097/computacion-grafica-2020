const ObjectScene = require('../ObjectScene')
const Mesh = require('../Mesh')

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
    // Paralelas a X
    for (let z = -offset; z <= offset; z += this.gap) {
      geometry.insertLine([
        [-offset, 0, z],
        [offset, 0, z]
      ])
    }

    // Paralelas a Z
    for (let x = -offset; x <= offset; x += this.gap) {
      geometry.insertLine([
        [x, 0, -offset],
        [x, 0, offset]
      ])
    }
  }
}

module.exports = GridFloor
