const Geometry = require('../Geometry')
const Vec3 = require('../../Utils/Vec3')

class CylinderGeometry extends Geometry {
  /**
   * @param {*} radius Radio del cilindro.
   * @param {*} heigth Altura del cilindro.
   * @param {*} segments Cantidad de segmentos del cilindro.
   * @param {*} shadeSmooth Determina si se aplica smooth o flat shading.
   */
  constructor (
    radius = 1,
    heigth = 1,
    segments = 3,
    shadeSmooth = true
  ) {
    super()
    this.constructCylinder(radius, heigth, segments, shadeSmooth)
  }

  constructCylinder (radius = 1, heigth = 1, segments = 3, shadeSmooth = true) {
    this.clearData()
    let dt = 2 * Math.PI / segments
    let angle
    let xz1, xz2
    let botommVertex = []
    let topVertex = []

    // Caras laterales.
    for (let i = 0; i < segments; i++) {
      angle = dt * i
      xz1 = [Math.cos(angle) * radius, Math.sin(angle) * radius]
      angle = dt * (i + 1)
      xz2 = [Math.cos(angle) * radius, Math.sin(angle) * radius]
      let offsetY = heigth / 2.0
      this.insertPlane([
        new Vec3(xz1[0], offsetY, xz1[1]),
        new Vec3(xz2[0], offsetY, xz2[1]),
        new Vec3(xz2[0], -offsetY, xz2[1]),
        new Vec3(xz1[0], -offsetY, xz1[1])
      ], !shadeSmooth)
      topVertex.push(new Vec3(xz2[0], offsetY, xz2[1]))
      botommVertex.push(new Vec3(xz2[0], -offsetY, xz2[1]))
    }

    // Tapas superior e inferior.
    switch (botommVertex.length) {
      case 3:
        this.insertTriangle([
          botommVertex[0], botommVertex[1], botommVertex[2]
        ], true)
        this.insertTriangle([
          topVertex[0], topVertex[2], topVertex[1]
        ], true)
        break

      case 4:
        this.insertPlane([
          botommVertex[0], botommVertex[1], botommVertex[2], botommVertex[3]
        ], true)
        this.insertPlane([
          topVertex[0], topVertex[3], topVertex[2], topVertex[1]
        ], true)
        break

      default:
        this.insertNGon(botommVertex, true)
        this.insertNGon(topVertex, true, true)
    }
    this.hasChanged = true
  }
}

module.exports = CylinderGeometry
