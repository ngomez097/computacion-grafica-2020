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
    this.vertices = [[0, 0]]
    this.faces = []
    let dt = Math.PI * 2 / this.edges
    let angle = Math.PI / (this.edges + this.edges % 2 * this.edges)

    for (let i = 1; i <= this.edges; i++) {
      this.vertices.push([
        Math.cos(angle),
        Math.sin(angle),
        0
      ])
      if (i !== this.edges) {
        this.faces.push([0, i, i + 1])
      } else {
        this.faces.push([0, i, 1])
      }
      angle += dt
    }

    return [this.vertices, this.verticesindices]
  }
}

module.exports = RegularConvexPolygonGeometry
