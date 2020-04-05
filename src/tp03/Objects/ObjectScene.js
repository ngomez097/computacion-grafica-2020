class ObjectScene {
  constructor (...meshes) {
    this.meshes = []
    for (let mesh of meshes) {
      this.meshes.push(mesh)
    }
  }

  getMeshes () {
    return this.meshes
  }
}

module.exports = ObjectScene
