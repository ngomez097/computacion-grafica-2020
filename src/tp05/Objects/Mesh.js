const Geometry = require('./Geometry')
const utils = require('../Utils/Utils')

class Mesh {
  constructor (material = [1.0, 1.0, 1.0], renderType = Mesh.RENDER_TYPE.TRIANGLES) {
    this.geometry = new Geometry()
    this.material = [...material]
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

  setColor (newColor) {
    if (!utils.arraysEqual(this.material, newColor)) {
      this.material = [...newColor]
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
