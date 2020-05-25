const ObjectScene = require('../Objects/ObjectScene')
const PointLight = require('../Light/PointLight')
// eslint-disable-next-line no-unused-vars
const DirLight = require('../Light/DirLight')
const SpotLight = require('../Light/SpotLight')
const Axis = require('../Axis/Axis')
const Vec3 = require('../Utils/Vec3')

class Scene {
  /**
   * @param {Vec3} clearColor
   * @param {ObjectScene} obj
   */
  constructor (
    clearColor = new Vec3(0.15),
    obj = null
  ) {
    this.clearColor = clearColor
    if (obj) {
      this.objects = [obj]
    }
    /** @type DirLight */ this.dirLight = null
    this.ambientLight = null
    this.pointLights = []
    /** @type Array<SpotLight> */this.spotLights = []
  }

  /**
   * Funcion para agregar varios objetos a la escena.
   * @param  {...ObjectScene} objects
   */
  addObjects (...objects) {
    for (let object of objects) {
      if (!(
        object instanceof ObjectScene ||
        object instanceof Axis
      )) {
        console.error(object, 'is not ObjectScene or Axis')
        continue
      }
      if (!this.objects) {
        this.objects = [object]
      }
      this.objects.push(object)
    }
  }

  /**
   * Funcion Para agregar luces puntuales a la escena.
   * @param  {...PointLight} pointLights Una o mas de luces.
   */
  addPointLights (...pointLights) {
    for (let pointLight of pointLights) {
      if (!(pointLight instanceof PointLight)) {
        console.error(pointLight, 'is not PointLight')
        continue
      }
      if (pointLight.representation !== null &&
          pointLight.representation instanceof ObjectScene
      ) {
        pointLight.representation.meshes[0].material.color = pointLight.color.scale(0.8)
        pointLight.representation.setTraslation(pointLight.position)
        pointLight.representation.meshes[0].useNormal = false
        this.addObjects(pointLight.representation)
      }
      this.pointLights.push(pointLight)
    }
  }

  /**
   * Funcion Para agregar lamparas a la escena.
   * @param  {...SpotLight} spotLights Una o mas de luces.
   */
  addSpotLights (...spotLights) {
    for (let spotLight of spotLights) {
      if (!(spotLight instanceof SpotLight)) {
        console.error(spotLight, 'is not SpotLight')
        continue
      }
      if (spotLight.representation !== null &&
          spotLight.representation instanceof ObjectScene) {
        spotLight.representation.meshes[0].material.color = spotLight.color.scale(0.8)
        spotLight.representation.setTraslation(spotLight.position)
        spotLight.representation.meshes[0].useNormal = false
        this.addObjects(spotLight.representation)
      }
      this.spotLights.push(spotLight)
    }
  }
}

module.exports = Scene
