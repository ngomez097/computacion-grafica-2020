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
   * Funcion que agrega vertices al arreglo de vertices.
   * @param {Array} vertices Un arreglo de vertices con el formato [x, y, z], si esta
   *  vacio o incompleto un vertice se llena con 0 los espacios faltantes.
   */
  addVertices (...vertices) {
    console.log(vertices)
    for (let vertice of vertices) {
      for (let component of vertice) {
        this.vertices.push(component)
      }
      for (let i = vertice.length; i < this.type; i++) {
        this.vertices.push(0)
      }
    }
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
