const Geometry = require('../Geometry')
const Vec3 = require('../../Utils/Vec3')
const cos = Math.cos
const sin = Math.sin

class SphereGeometry extends Geometry {
  /**
   * @param {*} vertexRing Cantidad de vertices por anillo.
   * @param {*} rings Cantidad de anillos.
   * @param {*} radius Radio de la esfera.
   * @param {*} shadeSmooth Determina si se aplica smooth o flat shading.
   */
  constructor (
    vertexRing = 32,
    rings = 32,
    radius = 1
  ) {
    super()
    this.constructSphere(vertexRing, rings, radius)
  }

  constructSphere (vertexRing, rings, radius) {
    this.clearData()
    let topVertex = new Vec3(0, radius, 0)
    let bottomVertex = new Vec3(0, -radius, 0)
    let dtz = 2 * Math.PI / (vertexRing)
    let dy = 2 * radius / (rings + 1)
    let angleZ
    let auxY, auxY1
    let auxR, auxR1
    let v1, v2, v3, v4

    // Caras superiores e inferiores
    auxY = radius - dy
    auxR = (radius ** 2 - auxY ** 2) ** 0.5
    for (let i = 0; i < vertexRing; i++) {
      angleZ = i * dtz
      v1 = new Vec3(auxR * cos(angleZ), auxY, auxR * sin(angleZ))
      v3 = new Vec3(auxR * cos(angleZ), -auxY, auxR * sin(angleZ))

      angleZ = (i + 1) * dtz
      v2 = new Vec3(auxR * cos(angleZ), auxY, auxR * sin(angleZ))
      v4 = new Vec3(auxR * cos(angleZ), -auxY, auxR * sin(angleZ))
      this.insertTriangle([topVertex, v2, v1], true)
      this.insertTriangle([bottomVertex, v3, v4], true)
    }

    // Caras laterales
    for (let i = 1; i < rings; i++) {
      auxY = radius - dy * i
      auxY1 = radius - dy * (i + 1)
      auxR = (radius ** 2 - auxY ** 2) ** 0.5
      auxR1 = (radius ** 2 - auxY1 ** 2) ** 0.5
      for (let j = 0; j < vertexRing; j++) {
        angleZ = j * dtz
        v1 = new Vec3(auxR * cos(angleZ), auxY, auxR * sin(angleZ))
        v2 = new Vec3(auxR1 * cos(angleZ), auxY1, auxR1 * sin(angleZ))

        angleZ = (j + 1) * dtz
        v3 = new Vec3(auxR1 * cos(angleZ), auxY1, auxR1 * sin(angleZ))
        v4 = new Vec3(auxR * cos(angleZ), auxY, auxR * sin(angleZ))

        this.insertPlane([v1, v4, v3, v2], true)
      }
    }

    this.recalculateSmoothNormals()

    this.hasChanged = true
  }
}

module.exports = SphereGeometry
