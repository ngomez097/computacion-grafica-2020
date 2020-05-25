const ObjectScene = require('../ObjectScene')
const SphereGeometry = require('../BasicGeometry/SphereGeometry')

class Sphere extends ObjectScene {
  /**
   * @param {*} vertexRing Cantidad de vertices por anillo.
   * @param {*} rings Cantidad de anillos.
   * @param {*} radius Radio de la esfera.
   * @param {*} shadeSmooth Determina si se aplica smooth o flat shading.
   */
  constructor (
    vertexRing = 32,
    rings = 32,
    radius = 1,
    shadeSmooth = true
  ) {
    super()
    this.vertexRing = vertexRing
    this.rings = rings
    this.radius = radius
    this.selectable = false
    this.meshes[0].setGeometry(new SphereGeometry(vertexRing, rings, radius))
  }

  remesh () {
    this.meshes[0].geometry.constructSphere(this.vertexRing, this.rings, this.radius)
  }
}

module.exports = Sphere
