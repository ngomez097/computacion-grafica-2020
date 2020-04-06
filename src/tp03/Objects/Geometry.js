class Geometry {
  /**
   * @param {Geometry.TYPE} type Es el tipo de geometria que se define, DEFAULT = Geometry.TYPE.3D
   */
  constructor (type = Geometry.TYPE['3D']) {
    this.vertices = []
    this.faces = []
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
   * @returns Un arreglo que contiene los indices de los vertices insertados.
   */
  addVertices (...vertices) {
    let auxIndex = this.vertices.length
    let found = false
    let index = []
    for (let vertice of vertices) {
      for (let i = auxIndex - 3; i >= 0; i = i - 3) {
        if (vertice[0] === this.vertices[i] &&
          vertice[1] === this.vertices[i + 1] &&
          vertice[2] === this.vertices[i + 2]
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
}

module.exports = Geometry
