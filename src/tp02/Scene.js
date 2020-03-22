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
  }

  addMesh (mesh) {
    this.meshes.push(mesh)
  }
}

module.exports = Scene
