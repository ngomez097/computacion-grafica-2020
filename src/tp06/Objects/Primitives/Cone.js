const ObjectScene = require('../ObjectScene')
const ConeGeometry = require('../BasicGeometry/ConeGeometry')

// Clase para la creacion de un cono.
class Cone extends ObjectScene {
  /**
   * @param {*} baseVertexCount Cantidad de vertices en la base.
   * @param {*} radius Radio de la base.
   * @param {*} heigth Altura del cono.
   */
  constructor (
    baseVertexCount = 3,
    radius = 1,
    heigth = 1
  ) {
    super()
    this.baseVertexCount = baseVertexCount
    this.radius = radius
    this.heigth = heigth
    this.selectable = false
    this.meshes[0].setGeometry(new ConeGeometry(heigth, baseVertexCount, radius))
  }

  remesh () {
    this.meshes[0].geometry.constructCone(this.heigth, this.baseVertexCount, this.radius)
  }
}

module.exports = Cone
