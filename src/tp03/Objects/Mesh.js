const mat4 = require('gl-matrix/mat4')
const vec3 = require('../Utils/vec3')

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
    this.useNormal = true
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
   * @param {Array} vertices: Se espera que se manden exactamente 3 vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertTriangle (vertices, duplicated = false, flipNormal = false) {
    if (vertices.length !== 3) {
      return
    }
    let normal

    let index = this.geometry.addVertices(vertices, duplicated)

    this.geometry.addFaces(
      [index[0], index[1], index[2]]
    )

    if (flipNormal) {
      normal = vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      normal = vec3.normals(vertices[0], vertices[1], vertices[2])
    }

    this.geometry.setNormal(
      [index[0], index[1], index[2]],
      normal
    )
  }

  /**
   * Funcion que inserta un plano a la geometria.
   * @param {Array} vertices Se espera que se manden exactamente 4 vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertPlane (vertices, duplicated = false, flipNormal = false) {
    if (vertices.length !== 4) {
      return
    }
    let normal
    let index = this.geometry.addVertices(vertices, duplicated)

    this.geometry.addFaces(
      [index[0], index[1], index[2]],
      [index[0], index[2], index[3]]
    )

    if (flipNormal) {
      normal = vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      normal = vec3.normals(vertices[0], vertices[1], vertices[2])
    }

    this.geometry.setNormal(
      [index[0], index[1], index[2], index[3]],
      normal
    )
  }

  /**
   * Funcion para insertar una cara con mas de 5 vertices, combierte la cara en triangulos
   * @param {Array<Array>} vertices Es un arreglo de vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertNGon (vertices, duplicated = false, flipNormal = false) {
    if (vertices.length < 5) {
      return
    }

    let innerIndex = [0]
    let isPair = vertices.length % 2 === 0
    let count = Math.floor(vertices.length / 2)

    if (isPair) {
      count -= 1
    }

    for (let i = 0; i < count; i++) {
      this.insertTriangle([
        vertices[i * 2], vertices[i * 2 + 1], vertices[i * 2 + 2]
      ], duplicated, flipNormal)
      innerIndex.push(i * 2 + 2)
    }
    if (isPair) {
      this.insertTriangle([
        vertices[count * 2], vertices[count * 2 + 1], vertices[0]
      ], duplicated, flipNormal)
    }

    if (innerIndex.length === 3) {
      this.insertTriangle([
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]]
      ], false, flipNormal)
    } else if (innerIndex.length === 4) {
      this.insertPlane([
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]],
        vertices[innerIndex[3]]
      ], false, flipNormal)
    } else {
      let auxVertices = []
      for (let i of innerIndex) {
        auxVertices.push(vertices[i])
      }
      this.insertNGon(auxVertices, false, flipNormal)
    }
  }
}

module.exports = Mesh
