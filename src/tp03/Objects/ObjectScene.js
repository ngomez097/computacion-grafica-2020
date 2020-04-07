const Geometry = require('./Geometry')
const Mesh = require('./Mesh')

class ObjectScene {
  /**
   * @param {Mesh.renderType} renderType Forma en la que se dibujara.
   * @param  {...any} meshes mallas extras del objeto.
   */
  constructor (renderType = Mesh.RENDER_TYPE.TRIANGLES, ...meshes) {
    this.meshes = []

    let geometry = new Geometry()
    let mesh = new Mesh(geometry)
    mesh.renderType = renderType
    mesh.material = [0.8, 0.8, 0.8]
    this.meshes.push(mesh)

    for (let mesh of meshes) {
      this.meshes.push(mesh)
    }
  }

  getMeshes () {
    return this.meshes
  }
}

module.exports = ObjectScene
