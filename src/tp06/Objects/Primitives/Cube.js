const ObjectScene = require('../ObjectScene')
const CubeGeometry = require('../BasicGeometry/CubeGeometry')

class Cube extends ObjectScene {
  /**
   * @param {*} size Tamaño de los lados del cubo.
   */
  constructor (
    size = 1, flipNormal = false) {
    super()
    this.size = size
    this.selectable = false
    this.flipNormal = flipNormal
    this.meshes[0].geometry = new CubeGeometry(size, flipNormal)
  }

  remesh () {
    this.meshes[0].geometry.constructCube(this.size, this.flipNormal)
  }
}

module.exports = Cube
