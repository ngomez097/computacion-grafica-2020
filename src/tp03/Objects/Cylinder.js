const ObjectScene = require('./ObjectScene')

class Cylinder extends ObjectScene {
  /**
   * @param {*} segments Cantidad de segmentos del cilindro.
   * @param {*} radius Radio del cilindro.
   * @param {*} heigth Altura del cilindro.
   * @param {*} shadeSmooth Determina si se aplica smooth o flat shading.
   */
  constructor (
    segments = 3,
    radius = 1,
    heigth = 1,
    shadeSmooth = true
  ) {
    super()
    this.segments = segments
    this.radius = radius
    this.heigth = heigth
    this.shadeSmooth = shadeSmooth
    this.constructCylinder()
  }

  constructCylinder () {
    let mesh = this.meshes[0]
    mesh.geometry.clearData()
    let dt = 2 * Math.PI / this.segments
    let angle
    let xz1, xz2
    let botommVertex = []
    let topVertex = []

    // Caras laterales.
    for (let i = 0; i < this.segments; i++) {
      angle = dt * i
      xz1 = [Math.cos(angle) * this.radius, Math.sin(angle) * this.radius]
      angle = dt * (i + 1)
      xz2 = [Math.cos(angle) * this.radius, Math.sin(angle) * this.radius]
      let offsetY = this.heigth / 2.0
      mesh.insertPlane([
        [xz1[0], offsetY, xz1[1]],
        [xz2[0], offsetY, xz2[1]],
        [xz2[0], -offsetY, xz2[1]],
        [xz1[0], -offsetY, xz1[1]]
      ], !this.shadeSmooth)
      topVertex.push([xz2[0], offsetY, xz2[1]])
      botommVertex.push([xz2[0], -offsetY, xz2[1]])
    }

    // Tapas superior e inferior.
    switch (botommVertex.length) {
      case 3:
        mesh.insertTriangle([
          botommVertex[0], botommVertex[1], botommVertex[2]
        ], true)
        mesh.insertTriangle([
          topVertex[0], topVertex[2], topVertex[1]
        ], true)
        break

      case 4:
        mesh.insertPlane([
          botommVertex[0], botommVertex[1], botommVertex[2], botommVertex[3]
        ], true)
        mesh.insertPlane([
          topVertex[0], topVertex[3], topVertex[2], topVertex[1]
        ], true)
        break

      default:
        mesh.insertNGon(botommVertex, true)
        mesh.insertNGon(topVertex, true, true)
    }
  }
}

module.exports = Cylinder
