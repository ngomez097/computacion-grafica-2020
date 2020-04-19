const Mesh = require('./Mesh')
const Geometry = require('./Geometry')
const ObjectScene = require('./ObjectScene')

// Clase para la creacion de la grilla.
class Axis extends ObjectScene {
  /**
   * @param {*} size Tamaño de los ejes.
   * @param {*} show_axe Para determinar que ejes dibujar.
   * @param {*} inFront Para determinar si se dibuja en frente de los objetos definidos anteriormente en la escena.
   */
  constructor (
    size = 1,
    show_axe = [true, true, true],
    inFront = true
  ) {
    super()
    let eje
    let mesh

    // Eje X
    if (show_axe[0]) {
      mesh = this.meshes[0]
      eje = mesh.geometry
      eje.addVertices([
        [0.0, 0.0, 0.0],
        [size, 0.0, 0.0]
      ])
      eje.addFaces([0, 1])

      mesh.material = [1.0, 0.4, 0.4]
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      mesh.useNormal = false
      mesh.clearDepth = inFront
      this.meshes.push(mesh)
    }

    // Eje Y
    if (show_axe[1]) {
      eje = new Geometry()
      eje.addVertices([
        [0.0, 0.0, 0.0],
        [0.0, size, 0.0]
      ])
      eje.addFaces([0, 1])

      mesh = new Mesh(eje)
      mesh.material = [0.4, 1.0, 0.4]
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      mesh.useNormal = false
      mesh.clearDepth = inFront
      this.meshes.push(mesh)
    }

    // Eje Z
    if (show_axe[2]) {
      eje = new Geometry()
      eje.addVertices([
        [0.0, 0.0, 0.0],
        [0.0, 0.0, size]
      ])
      eje.addFaces([0, 1])
      mesh = new Mesh(eje)

      mesh.material = [0.4, 0.4, 1.0]
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      mesh.useNormal = false
      mesh.clearDepth = inFront
      this.meshes.push(mesh)
    }
  }
}

module.exports = Axis
