const ObjectScene = require('../ObjectScene')
const Mesh = require('../Mesh')
const Vec3 = require('../../Utils/Vec3')

class Ray extends ObjectScene {
  /**
   * @param {Vec3} position
   * @param {Vec3} direction
   * @param {Number} length
   * @param {Vec3} material
   */
  constructor (position, direction, length = 1, material = new Vec3(1.0)) {
    super()
    let lookDir = position.add(direction.scale(length))
    this.meshes[0].material = material
    this.meshes[0].geometry.insertLine([position, lookDir])
    this.meshes[0].useNormal = false
    this.meshes[0].renderType = Mesh.RENDER_TYPE.LINES
  }

  remesh (position, direction, length = 1, material = new Vec3(1.0)) {
    this.meshes[0].geometry.clearData()
    let lookDir = position.add(direction.scale(length))
    this.meshes[0].geometry.insertLine([position, lookDir])
    this.meshes[0].material = material
  }
}

module.exports = Ray
