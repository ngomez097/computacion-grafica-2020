const ObjectScene = require('../ObjectScene')
const CubeGeometry = require('../BasicGeometry/CubeGeometry')

class Cube extends ObjectScene {
  /**
   * @param {*} size Tamaño de los lados del cubo.
   */
  constructor (
    size = 1) {
    super()
    this.size = size
    this.selectable = false
    this.flipNormal = false
    this.meshes[0].setGeometry(new CubeGeometry(size))
  }

  remesh () {
    this.meshes[0].geometry.constructCube(this.size, this.flipNormal)
  }
}

module.exports = Cube
