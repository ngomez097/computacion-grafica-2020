const utils = require('../Utils/Utils')
const vec3 = require('../Utils/vec3')

class Geometry {
  /**
   * @param {Geometry.TYPE} type Es el tipo de geometria que se define, DEFAULT = Geometry.TYPE.3D
   */
  constructor (type = Geometry.TYPE['3D']) {
    this.vertices = []
    this.faces = []
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
    let auxIndex = this.vertices.length
    let found = false
    let index = []
    for (let vertice of vertices) {
      if (duplicated !== undefined && !duplicated) {
        // Buscando duplicados
        for (let i = auxIndex - 3; i >= 0; i = i - 3) {
          if (utils.distance(vertice,
            this.getVertice(i / 3)) < 0.01
          ) {
            index.push(i / 3)
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

      index.push(auxIndex / 3)
      auxIndex += 3
    }
    return index
  }

  /**
   * Funcion que agrega caras en el arreglo de caras.
   * @param {Array} face Un arreglo con los indices de los
   *  vertices que conforman la cara.
   */
  addFaces (...faces) {
    for (let face of faces) {
      for (let component of face) {
        this.faces.push(component)
      }
    }
  }

  /**
   * Funcion para obtener un vertice.
   * @param {*} index El indice con respecto al vertice.
   */
  getVertice (index) {
    let vertice = []
    let fixIndex = index * this.type
    for (let i = fixIndex; i < fixIndex + this.type; i++) {
      vertice.push(this.vertices[i])
    }
    return vertice
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
   * @param  {...any} normals Arreglo con las normales.
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
}

module.exports = Geometry
