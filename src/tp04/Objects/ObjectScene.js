const Mesh = require('./Mesh')
const Transformable = require('./Transformable')
const Axis = require('../Axis/Axis')

class ObjectScene extends Transformable {
  /**
   * @param {Mesh.renderType} renderType Forma en la que se dibujara.
   * @param  {...any} meshes mallas extras del objeto.
   */
  constructor (renderType = Mesh.RENDER_TYPE.TRIANGLES, ...meshes) {
    super()
    this.meshes = []

    let mesh = new Mesh(
      [0.8, 0.8, 0.8],
      renderType
    )
    this.meshes.push(mesh)
    this.enableRender = true
    this.showLocalAxis = false
    this.localAxisRepresentation = new Axis()

    for (let mesh of meshes) {
      this.meshes.push(mesh)
    }
  }

  getMeshes () {
    return this.meshes
  }
}

module.exports = ObjectScene
