const Geometry = require('./Geometry')

class RegularConvexPolygonGeometry extends Geometry {
  constructor (edges) {
    super()
    if (edges < 4) {
      edges = 4
    }
    this.edges = edges
    this.calculateVerticesWithFaces()
  }

  /** Funcion para obtener los vertices del poligono
   * y sus caras(indices).
   * @returns
   * Un arreglo donde el primer elemento
   * son los vertices en el formato [[x1,y1,0],..,[xn,yn,0]] y
   * el segundo son las caras en el formato [[f11,f12,f12],[fn1,fn2,fn3]] */
  calculateVerticesWithFaces () {
    this.addVertices([])
    this.faces = []
    let dt = Math.PI * 2 / this.edges
    let angle = Math.PI / (this.edges + this.edges % 2 * this.edges)

    for (let i = 1; i <= this.edges; i++) {
      this.addVertices([
        Math.cos(angle),
        Math.sin(angle),
        0
      ])
      if (i !== this.edges) {
        this.addFaces([0, i + 1, i])
      } else {
        this.addFaces([0, 1, i])
      }
      angle += dt
    }

    return [this.vertices, this.verticesindices]
  }
}

module.exports = RegularConvexPolygonGeometry
