const Mesh = require('../Objects/Mesh')
const Transformable = require('../Objects/Transformable')

// Clase para la creacion de la grilla.
class Axis extends Transformable {
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
    let mesh

    super()
    this.meshes = []
    this.enableRender = true

    // Eje X
    if (show_axe[0]) {
      // Para marcar la profundidad
      mesh = new Mesh()
      mesh.material = [1.0, 0.4, 0.4]
      mesh.insertLine([
        [0.0, 0.0, 0.0],
        [size, 0.0, 0.0]
      ])
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      mesh.useNormal = false
      this.meshes.push(mesh)

      if (inFront) {
        mesh = mesh.clone()
        mesh.clearDepth = inFront
        this.meshes.push(mesh)
      }
    }

    // Eje Y
    if (show_axe[1]) {
      mesh = new Mesh()
      mesh.material = [0.4, 1.0, 0.4]
      mesh.insertLine([
        [0.0, 0.0, 0.0],
        [0.0, size, 0.0]
      ])
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      mesh.useNormal = false
      this.meshes.push(mesh)

      if (inFront) {
        mesh = mesh.clone()
        mesh.clearDepth = inFront
        this.meshes.push(mesh)
      }
    }

    // Eje Z
    if (show_axe[2]) {
      mesh = new Mesh()
      mesh.material = [0.4, 0.4, 1.0]
      mesh.insertLine([
        [0.0, 0.0, 0.0],
        [0.0, 0.0, size]
      ])
      mesh.renderType = Mesh.RENDER_TYPE.LINES
      mesh.useNormal = false
      this.meshes.push(mesh)

      if (inFront) {
        mesh = mesh.clone()
        mesh.clearDepth = inFront
        this.meshes.push(mesh)
      }
    }
  }
}

module.exports = Axis
