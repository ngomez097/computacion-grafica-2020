const WebGLUtils = require('./WebGLUtil')

class RegularConvexPolygonGeometry {
  constructor (count = 4, radius = 1,
    fill = true, canvasName) {
    if (count < 4) {
      count = 4
    }
    this.n = count
    this.radius = radius
    this.fill = fill
    this.canvasName = canvasName
  }

  /** Funcion para obtener los vertices del poligono
   * y sus indices. */
  getVerticesWithIndex () {
    let vertices = [0, 0]
    let indices = []
    let dt = Math.PI * 2 / this.n
    let angle = Math.PI / (this.n + this.n % 2 * this.n)

    for (let i = 1; i <= this.n; i++) {
      vertices.push(this.radius * Math.cos(angle))
      vertices.push(this.radius * Math.sin(angle))
      if (i !== this.n) {
        indices.push(0, i, i + 1)
      } else {
        indices.push(0, i, 1)
      }
      angle += dt
    }

    return [vertices, indices]
  }

  /** Funcion para dibujar el poligono en el canvas dado. */
  draw () {
    let glUtil = new WebGLUtils(this.canvasName)
    glUtil.initWebGL(this.canvasName)
    glUtil.paintBackground()

    let vertexIndex = this.getVerticesWithIndex()

    glUtil.setVertexBuffer2D(vertexIndex[0])
    glUtil.setIndexBuffer(vertexIndex[1])

    if (this.fill) {
      glUtil.drawElementsTriangle(vertexIndex[1])
    } else {
      glUtil.drawElementsLineLoop(vertexIndex[1])
    }
  }
}

module.exports = RegularConvexPolygonGeometry
