const ObjectScene = require('../Objects/ObjectScene')
const vec3 = require('gl-matrix/vec3')

class Scene {
  /** @argument
   * Array con los colores RGB de fondo, debe de ser de 3 elementos
   */
  constructor (
    clearColor = [0.15, 0.15, 0.15],
    ambientLight = [0.0, 0.0, 0.0]
  ) {
    if (clearColor.length !== 3) {
      this.clearColor = [0.15, 0.15, 0.15]
    } else {
      this.clearColor = clearColor
    }
    this.objects = []
    this.ambientLight = ambientLight
    this.dirLight = null
    this.pointLights = []
  }

  /** Funcion para agregar varios objetos a la escena. */
  addObjects (...objects) {
    for (let object of objects) {
      this.objects.push(object)
    }
  }

  addPointLights (...pointLights) {
    for (let pointLight of pointLights) {
      if (pointLight.representation !== null &&
          pointLight.representation instanceof ObjectScene) {
        pointLight.representation.meshes[0].material = vec3.scale([], pointLight.color, 0.8)
        pointLight.representation.t = pointLight.position
        pointLight.representation.meshes[0].useNormal = false
        this.addObjects(pointLight.representation)
      }
      this.pointLights.push(pointLight)
    }
  }
}

module.exports = Scene
