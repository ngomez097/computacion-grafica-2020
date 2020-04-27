const utils = require('../Utils/Utils')
const vec3 = require('../Utils/vec3')

class Geometry {
  /**
   * @param {Geometry.TYPE} type Es el tipo de geometria que se define, DEFAULT = Geometry.TYPE.3D
   */
  constructor (type = Geometry.TYPE['3D']) {
    this.vertices = []
    this.faces = []
    this.wireframeFaces = []
    this.normals = []
    this.type = type
  }

  static get TYPE () {
    return {
      '2D': 2,
      '3D': 3
    }
  }

  /**
   * Funcion que agrega vertices al arreglo de vertices y busca si ya esta insertado.
   * @param {Array} vertices Un arreglo de vertices con el formato [x, y, z].
   * @param {Boolean} duplicated Si se permite tener vertices duplicados.
   * @returns Un arreglo que contiene los indices de los vertices insertados.
   */
  addVertices (vertices, duplicated = false) {
    let auxIndex = this.vertices.length / 3
    let found = false
    let index = []
    let i
    for (let vertice of vertices) {
      if (duplicated !== undefined && !duplicated) {
        // Buscando duplicados
        for (i = auxIndex - 1; i >= 0; i -= 1) {
          if (utils.distance(vertice,
            this.getVertices(i)) < 0.01
          ) {
            index.push(i)
            found = true
            break
          }
        }
        if (found) {
          found = false
          continue
        }
      }

      for (let component of vertice) {
        this.vertices.push(component)
      }

      index.push(auxIndex)
      auxIndex += 1
    }
    return index
  }

  /**
   * Funcion que agrega caras en el arreglo de caras.
   * @param {Array} faces Un arreglo con los indices de los
   *  vertices que conforman la cara.
   */
  addFaces (...faces) {
    let i
    for (let face of faces) {
      for (i = 0; i < face.length - 1; i++) {
        this.faces.push(face[i])
        this.wireframeFaces.push(face[i], face[i + 1])
      }
      if (face.length > 2) {
        this.wireframeFaces.push(face[i], face[0])
      }
      this.faces.push(face[i])
    }
  }

  /**
   * Funcion para obtener los vertices.
   * @param  {...any} index Los indices para obtener los vertices.
   */
  getVertices (...index) {
    let vertices = []
    let vertice
    let fixIndex
    for (let i of index) {
      vertice = []
      fixIndex = i * this.type
      for (let i = fixIndex; i < fixIndex + this.type; i++) {
        vertice.push(this.vertices[i])
      }
      vertices.push(vertice)
    }

    if (vertices.length === 1) {
      return vertices[0]
    }
    return vertices
  }

  /**
   * Funcion para agregar normales a los vertices.
   * @param {*} index Arreglo que trae los indices de los vertices a cuales corresponde la normal.
   * @param  {...any} normals Arreglo con las normales.
   */
  addNormals (index, ...normals) {
    if (index.length !== normals.length) {
      return false
    }

    for (let i = 0; i < index.length; i++) {
      let normal = normals[i]
      let auxIndex = index[i] * 3

      if (this.normals[auxIndex] !== undefined) {
        normal[0] += this.normals[auxIndex]
        normal[1] += this.normals[auxIndex + 1]
        normal[2] += this.normals[auxIndex + 2]

        normal = vec3.normalize(normal)
      }
      this.normals[auxIndex] = normal[0]
      this.normals[auxIndex + 1] = normal[1]
      this.normals[auxIndex + 2] = normal[2]
    }

    return true
  }

  /**
   * Funcion para agregar normales a los vertices.
   * @param {*} index Arreglo que trae los indices de los vertices a cuales corresponde la normal.
   * @param {*} normal La normal para los vertices.
   */
  setNormal (index, normal) {
    let auxNormal
    for (let i = 0; i < index.length; i++) {
      let auxIndex = index[i] * 3
      auxNormal = [normal[0], normal[1], normal[2]]

      if (this.normals[auxIndex] !== undefined) {
        auxNormal[0] += this.normals[auxIndex]
        auxNormal[1] += this.normals[auxIndex + 1]
        auxNormal[2] += this.normals[auxIndex + 2]

        auxNormal = vec3.normalize(auxNormal)
      }
      this.normals[auxIndex] = auxNormal[0]
      this.normals[auxIndex + 1] = auxNormal[1]
      this.normals[auxIndex + 2] = auxNormal[2]
    }

    return true
  }

  /**
   * Funcion para obtener los vertices.
   * @param  {...any} index Los indices para obtener los vertices.
   */
  getNormals (...index) {
    let normals = []
    let normal
    let fixIndex
    for (let i of index) {
      normal = []
      fixIndex = i * this.type
      for (let i = fixIndex; i < fixIndex + this.type; i++) {
        normal.push(this.normals[i])
      }
      normals.push(normal)
    }

    if (normals.length === 1) {
      return normals[0]
    }
    return normals
  }

  /**
   * Funcion para limpiar los datos de la geometria.
   */
  clearData () {
    this.vertices = []
    this.faces = []
    this.normals = []
    this.wireframeFaces = []
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
    let index = this.addVertices(vertices, duplicated)

    this.addFaces(
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
    let index = this.addVertices(vertices, duplicated)

    if (flipNormal) {
      this.addFaces(
        [index[0], index[2], index[1]]
      )
      normal = vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      this.addFaces(
        [index[0], index[1], index[2]]
      )
      normal = vec3.normals(vertices[0], vertices[1], vertices[2])
    }

    this.setNormal(
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
    let index = this.addVertices(vertices, duplicated)

    if (flipNormal) {
      this.addFaces(
        [index[0], index[2], index[1]],
        [index[0], index[3], index[2]]
      )
      normal = vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      this.addFaces(
        [index[0], index[1], index[2]],
        [index[0], index[2], index[3]]
      )
      normal = vec3.normals(vertices[0], vertices[1], vertices[2])
    }

    this.setNormal(
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
    let clone = new Geometry(this.type)
    clone.vertices = [...this.vertices]
    clone.faces = [...this.faces]
    clone.normals = [...this.normals]
    clone.wireframeFaces = [...this.wireframeFaces]
    return clone
  }
}

module.exports = Geometry
