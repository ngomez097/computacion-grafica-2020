const Geometry = require('../Geometry')
const Vec3 = require('../../Utils/Vec3')
const Vec2 = require('../../Utils/Vec2')

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
    uvScale = 1.0
  ) {
    super()
    this.constructCylinder(radius, heigth, segments, uvScale)
  }

  constructCylinder (radius = 1, heigth = 1, segments = 3, uvScale = 1.0) {
    this.clearData()
    let dt = 2 * Math.PI / segments
    let angle
    let xz1, xz2
    let offsetY = heigth / 2.0
    let botommVertex = [new Vec3(radius, -offsetY, 0)]
    let topVertex = [new Vec3(radius, offsetY, 0)]
    let du = 1.0 / segments

    // Caras laterales.
    /* xz2   xz1
    *  *----*
    *  |    |
    *  |    |
    *  *----* -offsetY
    */
    for (let i = 0; i < segments; i++) {
      angle = dt * i
      xz1 = [Math.cos(angle) * radius, Math.sin(angle) * radius]
      angle = dt * (i + 1)
      xz2 = [Math.cos(angle) * radius, Math.sin(angle) * radius]
      this.insertPlane([
        new Vec3(xz1[0], offsetY, xz1[1]),
        new Vec3(xz2[0], offsetY, xz2[1]),
        new Vec3(xz2[0], -offsetY, xz2[1]),
        new Vec3(xz1[0], -offsetY, xz1[1])
      ], true, false, uvScale,
      [
        new Vec2(du * i, 1),
        new Vec2(du * (i + 1), 1),
        new Vec2(du * (i + 1), 0),
        new Vec2(du * i, 0),
      ])
      if (i !== (segments - 1)) {
        topVertex.push(new Vec3(xz2[0], offsetY, xz2[1]))
        botommVertex.push(new Vec3(xz2[0], -offsetY, xz2[1]))
      }
    }

    // Tapas superior e inferior.
    switch (botommVertex.length) {
      case 3:
        this.insertTriangle([
          botommVertex[0], botommVertex[1], botommVertex[2]
        ])
        this.insertTriangle([
          topVertex[0], topVertex[2], topVertex[1]
        ])
        break

      case 4:
        this.insertPlane([
          botommVertex[0], botommVertex[1], botommVertex[2], botommVertex[3]
        ])
        this.insertPlane([
          topVertex[0], topVertex[3], topVertex[2], topVertex[1]
        ])
        break

      default:
        this.insertNGon(botommVertex, false)
        this.insertNGon(topVertex, false, true)
    }

    this.recalculateSmoothNormals()
    this.hasChanged = true
  }
}

module.exports = CylinderGeometry
