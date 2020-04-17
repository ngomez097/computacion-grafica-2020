const ObjectScene = require('./ObjectScene')

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
    this.constructCone()
  }

  constructCone () {
    let mesh = this.meshes[0]
    mesh.geometry.clearData()
    let offsetY = this.heigth / 2.0
    let topVertex = [0, offsetY, 0]
    let v1 = []
    let v2 = []
    let dt = 2 * Math.PI / this.baseVertexCount
    let angle
    let botommVertex = []

    for (let i = 0; i < this.baseVertexCount; i++) {
      angle = dt * i
      v1 = [Math.cos(angle) * this.radius, -offsetY, Math.sin(angle) * this.radius]
      angle = dt * (i + 1)
      v2 = [Math.cos(angle) * this.radius, -offsetY, Math.sin(angle) * this.radius]

      mesh.insertTriangle([
        topVertex, v2, v1
      ], !this.shadeSmooth)

      botommVertex.push(v2)
    }

    switch (botommVertex.length) {
      case 3:
        mesh.insertTriangle([
          botommVertex[0], botommVertex[1], botommVertex[2]
        ], true)
        break
      case 4:
        mesh.insertPlane([
          botommVertex[0], botommVertex[1], botommVertex[2], botommVertex[3]
        ], true)
        break
      default:
        mesh.insertNGon(botommVertex, true)
    }
  }
}

module.exports = Cone
