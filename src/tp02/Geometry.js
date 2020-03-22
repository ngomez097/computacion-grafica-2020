class Geometry {
  constructor () {
    this.vertices = []
    this.faces = []
  }

  getVertices2DToArray () {
    return this.convertToArray(this.vertices, 2)
  }

  getFacesToArray () {
    return this.convertToArray(this.faces, 3)
  }

  getVertices3DToArray () {
    return this.convertToArray(this.vertices, 2)
  }

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
