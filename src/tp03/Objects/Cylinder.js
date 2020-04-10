const ObjectScene = require('./ObjectScene')

class Cylinder extends ObjectScene {
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

    for (let i = 0; i < this.segments; i++) {
      angle = dt * i
      xz1 = [Math.cos(angle) * this.radius, Math.sin(angle) * this.radius]
      angle = dt * (i + 1)
      xz2 = [Math.cos(angle) * this.radius, Math.sin(angle) * this.radius]
      mesh.insertPlane([
        [xz1[0], this.heigth, xz1[1]],
        [xz2[0], this.heigth, xz2[1]],
        [xz2[0], 0, xz2[1]],
        [xz1[0], 0, xz1[1]]
      ], !this.shadeSmooth)
      topVertex.push([xz2[0], this.heigth, xz2[1]])
      botommVertex.push([xz2[0], 0, xz2[1]])
    }

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
