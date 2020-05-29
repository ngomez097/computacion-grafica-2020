const ObjectScene = require('../ObjectScene')
const CylinderGeometry = require('../BasicGeometry/CylinderGeometry')

class Cylinder extends ObjectScene {
  /**
   * @param {*} segments Cantidad de segmentos del cilindro.
   * @param {*} radius Radio del cilindro.
   * @param {*} heigth Altura del cilindro.
   */
  constructor (
    segments = 3,
    radius = 1,
    heigth = 1,
    uvScale = 1.0
  ) {
    super()
    this.segments = segments
    this.radius = radius
    this.heigth = heigth
    this.selectable = false
    this.meshes[0].setGeometry(new CylinderGeometry(radius, heigth, segments, uvScale))
    this.uvScale = uvScale
  }

  remesh () {
    this.meshes[0].geometry.constructCylinder(this.radius, this.heigth, this.segments, this.uvScale)
  }
}

module.exports = Cylinder
