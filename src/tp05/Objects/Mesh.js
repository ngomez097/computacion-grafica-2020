const Geometry = require('./Geometry')
const Material = require('./Material/Material')
// eslint-disable-next-line no-unused-vars
const Bounding = require('./Bounding/Bounding')

class Mesh {
  constructor (material = new Material(), renderType = Mesh.RENDER_TYPE.TRIANGLES) {
    this.geometry = new Geometry()
    if (!(material instanceof Material)) {
      console.error('material is not instance of Material')
    } else {
      this.material = material
    }
    this.renderType = renderType
    this.useNormal = true
    this.clearDepth = false
    /** @type Bounding */this.bounding = null
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
   * @param {Geometry} geometry
   */
  setGeometry (geometry) {
    this.geometry = geometry
  }

  /**
   * @param {Bounding} bounding
   */
  setBounding (bounding) {
    this.bounding = bounding
  }

  /**
   * Funcion para establecer el color
   * @param {Material} newMaterial
   */
  setMaterial (newMaterial) {
    if (!(newMaterial instanceof Material)) {
      console.error('newMaterial is not instance of Material')
      return
    }
    this.material = newMaterial
  }

  /**
   * Funcion para realizar una copia de la clase.
   */
  clone () {
    let clone = new Mesh()
    clone.geometry = this.geometry.clone()
    clone.material.copy(this.material)
    clone.renderType = this.renderType
    clone.useNormal = this.useNormal
    clone.clearDepth = this.clearDepth
    return clone
  }
}

module.exports = Mesh
