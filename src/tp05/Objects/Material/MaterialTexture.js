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
}

module.exports = MaterialTexture
