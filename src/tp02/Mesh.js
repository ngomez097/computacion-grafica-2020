class Mesh {
  constructor (geometry, material = [1.0, 1.0, 1.0], isWireframe = false) {
    this.geometry = geometry
    this.material = material
    this.t = [0.0, 0.0, 0.0]
    this.r = [0.0, 0.0, 0.0]
    this.s = [1.0, 1.0, 1.0]
    this.modelMatrix = null
    this.isWireframe = isWireframe
  }

  /**
   * Funcion para establecer la geometria.
   */
  setGeometry (geometry) {
    this.geometry = geometry
  }
}

module.exports = Mesh
