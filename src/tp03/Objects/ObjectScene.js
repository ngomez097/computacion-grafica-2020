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

  /**
   * Funcion que inserta un plano a la geometria.
   * @param {int} meshNumber numero de la malla a agregar.
   * @param {Array} vertices Se espera que se manden exactamente 4 vertices.
   */
  insertPlane (meshNumber, ...vertices) {
    if (vertices.length !== 4) {
      return
    }

    let geometry = this.meshes[meshNumber].geometry

    let faces = geometry.addVertices(
      vertices[0], vertices[1], vertices[2], vertices[3]
    )

    geometry.addFaces(
      [faces[0], faces[1], faces[2]],
      [faces[0], faces[2], faces[3]]
    )
  }

  /**
   * Funcion que inserta un triangulo a la geometria.
   * @param {int} meshNumber numero de la malla a agregar.
   * @param {Array} vertices Se espera que se manden exactamente 3 vertices.
   */
  insertTriangle (meshNumber, ...vertices) {
    if (vertices.length !== 3) {
      return
    }

    let geometry = this.meshes[meshNumber].geometry

    let faces = geometry.addVertices(
      vertices[0], vertices[1], vertices[2]
    )

    geometry.addFaces(
      [faces[0], faces[1], faces[2]]
    )
  }
}

module.exports = ObjectScene
