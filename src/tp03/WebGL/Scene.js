class Scene {
  /** @argument
   * Array con los colores RGB de fondo, debe de ser de 3 elementos
   */
  constructor (clearColor = [0.15, 0.15, 0.15]) {
    if (clearColor.length !== 3) {
      this.clearColor = [0.15, 0.15, 0.15]
    } else {
      this.clearColor = clearColor
    }
    this.objects = []
  }

  /** Funcion para agregar varios objetos a la escena. */
  addObjects (...objects) {
    for (let object of objects) {
      this.objects.push(object)
    }
  }
}

module.exports = Scene
