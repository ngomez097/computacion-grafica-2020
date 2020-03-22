class Geometry {
  constructor () {
    this.vertices = []
    this.faces = []
  }

  /** Funcion para obtener los vertices en un vector.
   * @returns
   * Un vector con los vertices ordenados de la forma [x1,y1,...,xn,yn].
   */
  getVertices2DToArray () {
    return this.convertToArray(this.vertices, 2)
  }

  /** Funcion para obtener los vertices en un vector.
   * @returns
   * Un vector con los vertices ordenados de la forma [x1,y1,z1,...,xn,yn,zn].
   */
  getVertices3DToArray () {
    return this.convertToArray(this.vertices, 2)
  }

  /** Funcion para obtener los caras(indices) en un vector.
   * @returns
   * Un vector con las caras.
   */
  getFacesToArray () {
    return this.convertToArray(this.faces, 3)
  }

  /** Funcion para transformar un vector de arrays en un vector.
   * @returns
   * Un vector con los elementos ordenados secuencialmente.
   */
  convertToArray (array, numberPerElement) {
    let buffer = []
    for (let element of array) {
      for (let i = 0; i < numberPerElement; i++) {
        buffer.push(element[i])
      }
    }
    return buffer
  }
}

module.exports = Geometry
