const ObjectScene = require('../ObjectScene')
const Mesh = require('../Mesh')
const vec3 = require('gl-matrix/vec3')

class Ray extends ObjectScene {
  constructor (position, direction, length = 1, material = [1.0, 1.0, 1.0]) {
    super()
    let dir = vec3.scale([], direction, length)

    let lookDir = vec3.add([], position, dir)
    this.meshes[0].material = material
    this.meshes[0].geometry.insertLine([position, lookDir], true)
    this.meshes[0].useNormal = false
    this.meshes[0].renderType = Mesh.RENDER_TYPE.LINES
  }
}

module.exports = Ray
