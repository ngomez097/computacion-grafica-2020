const mat4 = require('gl-matrix/mat4')

class Mesh {
  constructor (geometry, material = [1.0, 1.0, 1.0], renderType = Mesh.RENDER_TYPE.TRIANGLES) {
    this.geometry = geometry
    this.material = material
    this.t = [0.0, 0.0, 0.0]
    this.r = [0.0, 0.0, 0.0]
    this.s = [1.0, 1.0, 1.0]
    this.modelMatrix = null
    this.renderType = renderType
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

  getModelMatrix () {
    this.modelMatrix = mat4.create()
    mat4.translate(this.modelMatrix, this.modelMatrix, this.t)
    mat4.scale(this.modelMatrix, this.modelMatrix, this.s)
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.r[0] * Math.PI / 180.0)
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.r[1] * Math.PI / 180.0)
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.r[2] * Math.PI / 180.0)

    return this.modelMatrix
  }
}

module.exports = Mesh
