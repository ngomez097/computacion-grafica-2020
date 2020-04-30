const ObjectScene = require('../Objects/ObjectScene')
const vec3 = require('gl-matrix/vec3')

class Scene {
  /** @argument
   * Array con los colores RGB de fondo, debe de ser de 3 elementos
   */
  constructor (
    clearColor = [0.15, 0.15, 0.15]) {
    if (clearColor.length !== 3) {
      this.clearColor = [0.15, 0.15, 0.15]
    } else {
      this.clearColor = clearColor
    }
    this.objects = []
    this.dirLight = null
    this.ambientLight = null
    this.pointLights = []
    this.spotLights = []
  }

  /** Funcion para agregar varios objetos a la escena. */
  addObjects (...objects) {
    for (let object of objects) {
      this.objects.push(object)
    }
  }

  /**
   * Funcion Para agregar luces puntuales a la escena.
   * @param  {...any} pointLights Una o mas de luces.
   */
  addPointLights (...pointLights) {
    for (let pointLight of pointLights) {
      if (pointLight.representation !== null &&
          pointLight.representation instanceof ObjectScene) {
        pointLight.representation.meshes[0].material = vec3.scale([], pointLight.color, 0.8)
        pointLight.representation.setTraslation(pointLight.position)
        pointLight.representation.meshes[0].useNormal = false
        this.addObjects(pointLight.representation)
      }
      this.pointLights.push(pointLight)
    }
  }

  /**
   * Funcion Para agregar lamparas a la escena.
   * @param  {...any} spotLights Una o mas de luces.
   */
  addSpotLights (...spotLights) {
    for (let spotLight of spotLights) {
      if (spotLight.representation !== null &&
          spotLight.representation instanceof ObjectScene) {
        spotLight.representation.meshes[0].material = vec3.scale([], spotLight.color, 0.8)
        spotLight.representation.setTraslation(spotLight.position)
        spotLight.representation.meshes[0].useNormal = false
        this.addObjects(spotLight.representation)
      }
      this.spotLights.push(spotLight)
    }
  }
}

module.exports = Scene
