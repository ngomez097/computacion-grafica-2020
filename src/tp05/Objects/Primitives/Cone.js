const ObjectScene = require('../ObjectScene')
const ConeGeometry = require('../BasicGeometry/ConeGeometry')

// Clase para la creacion de un cono.
class Cone extends ObjectScene {
  /**
   * @param {*} baseVertexCount Cantidad de vertices en la base.
   * @param {*} radius Radio de la base.
   * @param {*} heigth Altura del cono.
   * @param {*} shadeSmooth Determina si se aplica smooth o flat shading.
   */
  constructor (
    baseVertexCount = 3,
    radius = 1,
    heigth = 1,
    shadeSmooth = false
  ) {
    super()
    this.baseVertexCount = baseVertexCount
    this.radius = radius
    this.heigth = heigth
    this.shadeSmooth = shadeSmooth
    this.selectable = false
    this.meshes[0].setGeometry(new ConeGeometry(heigth, baseVertexCount, radius, shadeSmooth))
  }

  remesh () {
    this.meshes[0].geometry.constructCone(this.heigth, this.baseVertexCount, this.radius, this.shadeSmooth)
  }
}

module.exports = Cone