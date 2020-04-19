const Geometry = require('./Geometry')
const Mesh = require('./Mesh')
const Transformable = require('./Transformable')

class ObjectScene extends Transformable {
  /**
   * @param {Mesh.renderType} renderType Forma en la que se dibujara.
   * @param  {...any} meshes mallas extras del objeto.
   */
  constructor (renderType = Mesh.RENDER_TYPE.TRIANGLES, ...meshes) {
    super()
    this.meshes = []

    let geometry = new Geometry()
    let mesh = new Mesh(geometry)
    mesh.renderType = renderType
    mesh.material = [0.8, 0.8, 0.8]
    this.meshes.push(mesh)
    this.enableRender = true

    for (let mesh of meshes) {
      this.meshes.push(mesh)
    }
  }

  getMeshes () {
    return this.meshes
  }
}

module.exports = ObjectScene
