// eslint-disable-next-line no-unused-vars
const Vec3 = require('../../Utils/Vec3')
const MaterialTexture = require('./MaterialTexture')

class Material {
  /**
   * @param {Vec3} color
   */
  constructor (color = new Vec3(0.8)) {
    this.color = color
    this.useTexure = false
    this.texture = new MaterialTexture()
  }

  /**
   * @param {Vec3} color
   */
  setColor (color) {
    this.color.copy(color)
  }

  /**
   * @param {MaterialTexture} materialTexture
   */
  setMaterialTexture (materialTexture) {
    if (!(materialTexture instanceof MaterialTexture)) {
      console.error('materialTexture is not MaterialTexture class')
      return
    }

    this.texture = materialTexture
    this.useTexure = true
  }

  /**
   * @param {Material} material
   */
  copy (material) {
    this.color.copy(material.color)
  }

  static createFromTexture (colorTexture) {
    const texture = new MaterialTexture(colorTexture)
    let material = new Material()
    material.setMaterialTexture(texture)
    material.useTexure = true
    return material
  }
}

module.exports = Material
