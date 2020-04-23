const ObjectScene = require('./ObjectScene')
const Mesh = require('./Mesh')

class Line extends ObjectScene {
  constructor (p1, p2, material = [1.0, 1.0, 1.0]) {
    super()
    this.p1 = p1
    this.p2 = p2
    this.meshes[0].material = material
    this.meshes[0].insertLine([p1, p2], true)
    this.meshes[0].useNormal = false
    this.meshes[0].renderType = Mesh.RENDER_TYPE.LINES
  }
}

module.exports = Line
