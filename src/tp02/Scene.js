class Scene {
  /** @argument
   * Array con los colores RGB de fondo, debe de ser de 3 elementos
   */
  constructor (clearColor = [0.15, 0.15, 0.15]) {
    this.meshes = []
    if (clearColor.length !== 3) {
      this.clearColor = [0.15, 0.15, 0.15]
    } else {
      this.clearColor = clearColor
    }
    this.axes = []
  }

  /** Funcion para agregar varios mesh a la escena. */
  addMesh (...meshes) {
    for (let mesh of meshes) {
      this.meshes.push(mesh)
    }
  }

  addAxes (...axes) {
    for (let axe of axes) {
      this.axes.push(axe)
    }
  }
}

module.exports = Scene
