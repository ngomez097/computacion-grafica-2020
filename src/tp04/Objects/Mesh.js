const Geometry = require('./Geometry')
const vec3 = require('../Utils/vec3')

class Mesh {
  constructor (material = [1.0, 1.0, 1.0], renderType = Mesh.RENDER_TYPE.TRIANGLES) {
    this.geometry = new Geometry()
    this.material = material
    this.renderType = renderType
    this.useNormal = true
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

  /**
   * Funcion que inserta una linea a la geometria.
   * @param {Array} vertices: Se espera que se manden exactamente 3 vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertLine (vertices, duplicated = false) {
    if (vertices.length !== 2) {
      return
    }
    let index = this.geometry.addVertices(vertices, duplicated)

    this.geometry.addFaces(
      [index[0], index[1]]
    )
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

    if (flipNormal) {
      this.geometry.addFaces(
        [index[0], index[2], index[1]]
      )
      normal = vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      this.geometry.addFaces(
        [index[0], index[1], index[2]]
      )
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

    if (flipNormal) {
      this.geometry.addFaces(
        [index[0], index[2], index[1]],
        [index[0], index[3], index[2]]
      )
      normal = vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      this.geometry.addFaces(
        [index[0], index[1], index[2]],
        [index[0], index[2], index[3]]
      )
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

    count -= isPair
    /* if (isPair) {
      count -= 1
    } */

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

  /**
   * Funcion para realizar una copia de la clase.
   */
  clone () {
    let clone = new Mesh()
    clone.geometry = this.geometry.clone()
    clone.material = this.material
    clone.renderType = this.renderType
    clone.useNormal = this.useNormal
    clone.clearDepth = this.clearDepth
    return clone
  }
}

module.exports = Mesh
