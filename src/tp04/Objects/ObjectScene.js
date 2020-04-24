const Mesh = require('./Mesh')
const ObjectProperty = require('./ObjectProperty')
const Axis = require('../Axis/Axis')

class ObjectScene extends ObjectProperty {
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

  /**
   * Funcion para determinar si se muestra la maya como Wireframe.
   * @param {*} bool True si se muestra el wireframe.
   * @param {*} mesh La maya objetivo.
   */
  showWireframe (bool, mesh = 0) {
    if (bool) {
      this.meshes[mesh].renderType = Mesh.RENDER_TYPE.LINES
    } else {
      this.meshes[mesh].renderType = Mesh.RENDER_TYPE.TRIANGLES
    }
  }
}

module.exports = ObjectScene
