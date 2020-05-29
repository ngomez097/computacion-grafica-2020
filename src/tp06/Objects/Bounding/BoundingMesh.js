const Geometry = require('../Geometry')
const Material = require('../Material/Material')

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
  }

  static get RENDER_TYPE () {
    return {
      LINES: 'lines',
      LINE_LOOP: 'line_loop',
      TRIANGLES: 'triangles',
    }
  }
}

module.exports = Mesh
