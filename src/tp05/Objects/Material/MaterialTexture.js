class MaterialTexture {
  constructor (diffuseTextureSrc = null, roughnessTextureSrc = null, normalTextureSrc = null, AOTextureSrc = null) {
    if (diffuseTextureSrc) this.diffuseTextureSrc = diffuseTextureSrc
    if (roughnessTextureSrc) this.roughnessTextureSrc = roughnessTextureSrc
    if (normalTextureSrc) this.normalTextureSrc = normalTextureSrc
    if (AOTextureSrc) this.AOTextureSrc = AOTextureSrc
    this.diffuseTexture = null
    this.normalTexture = null
    this.roughnessTexture = null
    this.AOTexture = null
    this.normalStrength = 1.0
    this.textureHasChanged = true
  }

  setDiffuse (diffuseTexture) {
    if (diffuseTexture) this.diffuseTextureSrc = diffuseTexture
  }

  setRoughness (roughnessTexture) {
    if (roughnessTexture) this.roughnessTextureSrc = roughnessTexture
  }

  setNormal (normalTextureSrc) {
    if (normalTextureSrc) this.normalTextureSrc = normalTextureSrc
  }

  setAO (AOTexture) {
    if (AOTexture) this.AOTextureSrc = AOTexture
  }

  /**
   * Funcion para pasar el directorio de las texturas, las texturas tienen que tener los siguientes nombres,
   * diff.jpg, norm.jpg, rough.jpg, ao.jpg
   * @param {*} folderPath directorio de la textura.
   */
  setFolder (folderPath) {
    require('../../')
    this.setDiffuse(require(`../../${folderPath}/diff.jpg`))
    this.setNormal(require(`../../${folderPath}/norm.jpg`))
    this.setRoughness(require(`../../${folderPath}/rough.jpg`))
    this.setAO(require(`../../${folderPath}/ao.jpg`))
  }
}

module.exports = MaterialTexture
