const vec2 = require('gl-matrix/vec2')

class Vec2 {
  constructor (x = null, y = null) {
    if (x === null) {
      this.x = 0
      this.y = 0
    } else if (y === null) {
      this.x = x
      this.y = 0
    } else {
      this.x = x
      this.y = y
    }
  }

  toArray () {
    return [this.x, this.y]
  }

  /**
   * @param {Vec2} vec
   */
  equal (vec) {
    return this.x === vec.x &&
      this.y === vec.y
  }

  /**
   * Función para normalizar el vector actual.
   */
  normalize () {
    let normal = 1 / ((this.x ** 2 + this.y ** 2) ** 0.5)
    this.x *= normal
    this.y *= normal
    return this
  }

  /**
   * @param {Vec2} vec
   */
  sub (vec) {
    return new Vec2(
      this.x - vec.x,
      this.y - vec.y
    )
  }

  /**
   * @param {Vec2} vec
   */
  add (vec) {
    return new Vec2(
      this.x + vec.x,
      this.y + vec.y
    )
  }

  /**
   * @param {Numbre} factor
   */
  scale (factor) {
    return new Vec2(this.x * factor, this.y * factor)
  }

  invert () {
    this.x *= -1
    this.y *= -1
    return this
  }

  /**
   * Funcion para obtener la distancia entre 2 puntos
   * @param {Vec2} vec
   */
  distance (vec) {
    return vec2.distance(this.toArray(), vec.toArray())
  }

  /**
   * @param {Array} array
   */
  static fromArray (array) {
    return new Vec2(array[0] || 0, array[1] || 0)
  }

  /**
   * @param {Vec2} vec
   */
  copy (vec) {
    this.x = vec.x
    this.y = vec.y
    return this
  }

  /**
   * @param {Vec2} vec
   */
  clone () {
    let vec = new Vec2()
    vec.copy(this)
    return vec
  }
}

module.exports = Vec2
