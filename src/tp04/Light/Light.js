class Light {
  constructor (
    color = [1.0, 1.0, 1.0],
    position = [0.0, 0.0, 0.0],
    classRepresentation = null
  ) {
    this.color = color
    this.position = position
    this.enable = true
    this.representation = classRepresentation
  }
}

module.exports = Light
