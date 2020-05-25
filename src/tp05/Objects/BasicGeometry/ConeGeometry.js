const Geometry = require('../Geometry')
const Vec3 = require('../../Utils/Vec3')
const cos = Math.cos
const sin = Math.sin

// Clase para la creacion de un cono.
class ConeGeometry extends Geometry {
  /**
   * @param {*} heigth Altura del cono.
   * @param {*} baseVertexCount Cantidad de vertices en la base.
   * @param {*} radius Radio de la base.
   * @param {*} shadeSmooth Determina si se aplica smooth o flat shading.
   */
  constructor (
    heigth = 1,
    baseVertexCount = 3,
    radius = 1,
    shadeSmooth = false
  ) {
    super()
    this.constructCone(heigth, baseVertexCount, radius)
  }

  constructCone (heigth = 1, baseVertexCount = 3, radius = 1) {
    this.clearData()
    let offsetY = heigth / 2.0
    let topVertex = new Vec3(0, offsetY, 0)
    let v1
    let v2
    let dt = 2 * Math.PI / baseVertexCount
    let angle
    let botommVertex = []

    for (let i = 0; i < baseVertexCount; i++) {
      angle = dt * i
      v1 = new Vec3(cos(angle) * radius, -offsetY, sin(angle) * radius)
      angle = dt * (i + 1)
      v2 = new Vec3(cos(angle) * radius, -offsetY, sin(angle) * radius)

      this.insertTriangle([
        topVertex, v2, v1
      ])

      botommVertex.push(v2)
    }
    switch (botommVertex.length) {
      case 3:
        this.insertTriangle([
          botommVertex[0], botommVertex[1], botommVertex[2]
        ])
        break
      case 4:
        this.insertPlane([
          botommVertex[0], botommVertex[1], botommVertex[2], botommVertex[3]
        ])
        break
      default:
        this.insertNGon(botommVertex)
    }
    this.recalculateSmoothNormals()
    this.hasChanged = true
  }
}

module.exports = ConeGeometry
