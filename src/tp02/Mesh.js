class Mesh {
  constructor (geometry, material) {
    this.geometry = geometry
    this.meterial = material
    this.tx = 0
    this.ty = 0
    this.tz = 0
    this.rx = 0
    this.ry = 0
    this.rz = 0
    this.sx = 1
    this.sy = 1
    this.sz = 1
    this.modelMatrix = null
  }

  setGeometry (geometry) {
    this.geometry = geometry
  }
}

module.exports = Mesh
