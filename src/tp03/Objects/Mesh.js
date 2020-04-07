const mat4 = require('gl-matrix/mat4')

class Mesh {
  constructor (geometry, material = [1.0, 1.0, 1.0], renderType = Mesh.RENDER_TYPE.TRIANGLES) {
    this.geometry = geometry
    this.material = material
    this.t = [0.0, 0.0, 0.0]
    this.r = [0.0, 0.0, 0.0]
    this.s = [1.0, 1.0, 1.0]
    this.modelMatrix = null
    this.renderType = renderType
    this.clearDepth = false
  }

  static get RENDER_TYPE () {
    return {
      LINES: 'lines',
      LINE_LOOP: 'line_loop',
      TRIANGLES: 'triangles',
    }
  }

  /**
   * Funcion para establecer la geometria.
   */
  setGeometry (geometry) {
    this.geometry = geometry
  }

  getModelMatrix () {
    this.modelMatrix = mat4.create()
    mat4.translate(this.modelMatrix, this.modelMatrix, this.t)
    mat4.scale(this.modelMatrix, this.modelMatrix, this.s)
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.r[0] * Math.PI / 180.0)
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.r[1] * Math.PI / 180.0)
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.r[2] * Math.PI / 180.0)

    return this.modelMatrix
  }

  /**
   * Funcion que inserta un triangulo a la geometria.
   * @param {int} meshNumber numero de la malla a agregar.
   * @param {Array} vertices Se espera que se manden exactamente 3 vertices.
   */
  insertTriangle (...vertices) {
    if (vertices.length !== 3) {
      return
    }

    let faces = this.geometry.addVertices(
      vertices[0], vertices[1], vertices[2]
    )

    this.geometry.addFaces(
      [faces[0], faces[1], faces[2]]
    )
  }

  /**
   * Funcion que inserta un plano a la geometria.
   * @param {int} meshNumber numero de la malla a agregar.
   * @param {Array} vertices Se espera que se manden exactamente 4 vertices.
   */
  insertPlane (...vertices) {
    if (vertices.length !== 4) {
      return
    }

    let faces = this.geometry.addVertices(
      vertices[0], vertices[1], vertices[2], vertices[3]
    )

    this.geometry.addFaces(
      [faces[0], faces[1], faces[2]],
      [faces[0], faces[2], faces[3]]
    )
  }

  /**
   * Funcion para insertar una cara con mas de 5 vertices, combierte la cara en triangulos
   * @param {Array<Array>} vertices Es un arreglo de vertices.
   */
  insertNGon (vertices) {
    if (vertices.length < 5) {
      return
    }

    let index = []
    let innerIndex = [0]
    let isPair = vertices.length % 2 === 0
    let count = Math.floor(vertices.length / 2)

    if (isPair) {
      count -= 1
    }

    for (let vertice of vertices) {
      index.push(this.geometry.addVertices(vertice))
    }

    for (let i = 0; i < count; i++) {
      this.insertTriangle(
        vertices[i * 2], vertices[i * 2 + 1], vertices[i * 2 + 2]
      )
      innerIndex.push(i * 2 + 2)
    }
    if (isPair) {
      this.insertTriangle(
        vertices[count * 2], vertices[count * 2 + 1], vertices[0]
      )
    }

    if (innerIndex.length === 3) {
      this.insertTriangle(
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]]
      )
    } else if (innerIndex.length === 4) {
      this.insertPlane(
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]],
        vertices[innerIndex[3]]
      )
    } else {
      let auxVertices = []
      for (let i of innerIndex) {
        auxVertices.push(vertices[i])
      }
      this.insertNGon(auxVertices)
    }
  }
}

module.exports = Mesh
