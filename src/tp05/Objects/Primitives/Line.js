const ObjectScene = require('../ObjectScene')
const Vec3 = require('../../Utils/Vec3')
const Mesh = require('../Mesh')

class Line extends ObjectScene {
  /**
   * @param {Vec3} p1
   * @param {Vec3} p2
   * @param {Vec3} material
   */
  constructor (p1, p2, material = new Vec3(1.0)) {
    super()
    this.p1 = p1
    this.p2 = p2
    this.meshes[0].material = material
    this.meshes[0].geometry.insertLine([p1, p2])
    this.meshes[0].useNormal = false
    this.meshes[0].renderType = Mesh.RENDER_TYPE.LINES
  }
}

module.exports = Line
