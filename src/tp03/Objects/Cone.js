const ObjectScene = require('./ObjectScene')

class Cone extends ObjectScene {
  constructor (
    baseVertexCount = 3,
    radius = 1,
    heigth = 1
  ) {
    super()
    this.baseVertexCount = baseVertexCount
    this.radius = radius
    this.heigth = heigth
    this.constructCone()
  }

  constructCone () {
    let mesh = this.meshes[0]
    let topVertex = [0, this.heigth, 0]
    mesh.geometry.addVertices(topVertex)
    let v1 = []
    let v2 = []
    let dt = 2 * Math.PI / this.baseVertexCount
    let angle
    let botommVertex = []
    botommVertex.push(
      [Math.cos(0) * this.radius, 0, Math.sin(0) * this.radius]
    )
    for (let i = 0; i < this.baseVertexCount - 1; i++) {
      angle = dt * i
      v1 = [Math.cos(angle) * this.radius, 0, Math.sin(angle) * this.radius]
      angle = dt * (i + 1)
      v2 = [Math.cos(angle) * this.radius, 0, Math.sin(angle) * this.radius]
      mesh.insertTriangle(topVertex, v2, v1)
      botommVertex.push(v2)
    }

    v1 = [Math.cos(angle) * this.radius, 0, Math.sin(angle) * this.radius]
    mesh.insertTriangle(topVertex, botommVertex[0], v1)

    switch (botommVertex.length) {
      case 3:
        mesh.insertTriangle(botommVertex[0], botommVertex[1], botommVertex[2])
        break
      case 4:
        mesh.insertPlane(botommVertex[0], botommVertex[1], botommVertex[2], botommVertex[3])
        break
      default:
        mesh.insertNGon(botommVertex)
    }
  }
}

module.exports = Cone
