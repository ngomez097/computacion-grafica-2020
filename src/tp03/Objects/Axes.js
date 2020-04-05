const Mesh = require('../Mesh')
const Geometry = require('../Geometry')
const ObjectScene = require('./ObjectScene')

class Axes extends ObjectScene {
  constructor (
    size = 1,
    show_axe = [true, true, true]
  ) {
    super()
    let eje
    let mesh

    if (show_axe[0]) {
      eje = new Geometry()
      eje.addVertices(
        [0.0, 0.0, 0.0],
        [size, 0.0, 0.0]
      )
      eje.addFaces([0, 1])

      mesh = new Mesh(eje)
      mesh.material = [1.0, 0.4, 0.4]
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      this.meshes.push(mesh)
    }

    if (show_axe[1]) {
      eje = new Geometry()
      eje.addVertices(
        [0.0, 0.0, 0.0],
        [0.0, size, 0.0]
      )
      eje.addFaces([0, 1])

      mesh = new Mesh(eje)
      mesh.material = [0.4, 1.0, 0.4]
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      this.meshes.push(mesh)
    }

    if (show_axe[2]) {
      eje = new Geometry()
      eje.addVertices(
        [0.0, 0.0, 0.0],
        [0.0, 0.0, size]
      )
      eje.addFaces([0, 1])
      mesh = new Mesh(eje)

      mesh.material = [0.4, 0.4, 1.0]
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      this.meshes.push(mesh)
    }
  }
}

module.exports = Axes
