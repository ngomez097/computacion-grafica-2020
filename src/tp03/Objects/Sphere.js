const ObjectScene = require('./ObjectScene')
const cos = Math.cos
const sin = Math.sin

class Sphere extends ObjectScene {
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
    this.shadeSmooth = shadeSmooth
    this.constructSphere()
  }

  constructSphere () {
    let mesh = this.meshes[0]
    mesh.geometry.clearData()
    let topVertex = [0, this.radius, 0]
    let bottomVertex = [0, -this.radius, 0]
    let dtz = 2 * Math.PI / (this.vertexRing)
    let dy = 2 * this.radius / (this.rings + 1)
    let angleZ
    let auxY, auxY1
    let auxR, auxR1
    let v1, v2, v3, v4

    auxY = this.radius - dy
    auxR = (this.radius ** 2 - auxY ** 2) ** 0.5
    for (let i = 0; i < this.vertexRing; i++) {
      angleZ = i * dtz
      v1 = [auxR * cos(angleZ), auxY, auxR * sin(angleZ)]
      v3 = [auxR * cos(angleZ), -auxY, auxR * sin(angleZ)]

      angleZ = (i + 1) * dtz
      v2 = [auxR * cos(angleZ), auxY, auxR * sin(angleZ)]
      v4 = [auxR * cos(angleZ), -auxY, auxR * sin(angleZ)]
      mesh.insertTriangle([topVertex, v2, v1], !this.shadeSmooth)
      mesh.insertTriangle([bottomVertex, v3, v4], !this.shadeSmooth)
    }

    for (let i = 1; i < this.rings; i++) {
      auxY = this.radius - dy * i
      auxY1 = this.radius - dy * (i + 1)
      auxR = (this.radius ** 2 - auxY ** 2) ** 0.5
      auxR1 = (this.radius ** 2 - auxY1 ** 2) ** 0.5
      for (let j = 0; j < this.vertexRing; j++) {
        angleZ = j * dtz
        v1 = [auxR * cos(angleZ), auxY, auxR * sin(angleZ)]
        v2 = [auxR1 * cos(angleZ), auxY1, auxR1 * sin(angleZ)]

        angleZ = (j + 1) * dtz
        v3 = [auxR1 * cos(angleZ), auxY1, auxR1 * sin(angleZ)]
        v4 = [auxR * cos(angleZ), auxY, auxR * sin(angleZ)]

        mesh.insertPlane([v1, v4, v3, v2], !this.shadeSmooth)
      }
    }
  }
}

module.exports = Sphere
