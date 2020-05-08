const vec3 = require('gl-matrix/vec3')

class Vec3 {
  constructor (x = null, y = null, z = null) {
    if (x === null) {
      this.x = 0
      this.y = 0
      this.z = 0
    } else if (y === null && z === null) {
      this.x = x
      this.y = x
      this.z = x
    } else if (z === null) {
      this.x = x
      this.y = y
      this.z = 0
    } else {
      this.x = x
      this.y = y
      this.z = z
    }
  }

  toArray () {
    return [this.x, this.y, this.z]
  }

  /**
   * @param {Vec3} vec
   */
  equal (vec) {
    return this.x === vec.x &&
      this.y === vec.y &&
      this.z === vec.z
  }

  /**
   * Función para normalizar el vector actual.
   */
  normalize () {
    let normal = 1 / ((this.x ** 2 + this.y ** 2 + this.z ** 2) ** 0.5)
    this.x *= normal
    this.y *= normal
    this.z *= normal
    return this
  }

  /**
   *  Función que devuelve un nuevo vector con el producto cruz entre el vector
   * actual y el vector dado.
   * @param {Vec3} vec Vector para realizar el producto cruz.
   */
  cross (vec) {
    if (vec instanceof Vec3) {
      let aux = vec3.cross([], this.toArray(), vec.toArray())
      return new Vec3(aux[0], aux[1], aux[2])
    } else {
      return null
    }
  }

  /**
   * @param {Vec3} vec
   */
  dot (vec) {
    if (vec instanceof Vec3) {
      return vec3.dot(this.toArray(), vec.toArray())
    } else {
      return null
    }
  }

  /**
   * @param {Vec3} vec
   */
  sub (vec) {
    return new Vec3(
      this.x - vec.x,
      this.y - vec.y,
      this.z - vec.z
    )
  }

  /**
   * @param {Vec3} vec
   */
  add (vec) {
    return new Vec3(
      this.x + vec.x,
      this.y + vec.y,
      this.z + vec.z
    )
  }

  /**
   * @param {Numbre} factor
   */
  scale (factor) {
    let aux = vec3.scale([], this.toArray(), factor)
    return new Vec3(aux[0], aux[1], aux[2])
  }

  invert () {
    this.x *= -1
    this.y *= -1
    this.z *= -1
    return this
  }

  /**
   * Funcion para obtener la distancia entre 2 puntos
   * @param {Vec3} vec
   */
  distance (vec) {
    return vec3.distance(this.toArray(), vec.toArray())
  }

  /**
   * Función para obtener la normar de un triangulo en
   * 3 coordenadas (p1 - p0) X (p2 - p0).
   * @param {Vec3} p0
   * @param {Vec3} p1
   * @param {Vec3} p2
   */
  static normals (p0, p1, p2) {
    let v1 = p1.sub(p0)
    let v2 = p2.sub(p0)
    return v1.cross(v2).normalize()
  }

  /**
   * @param {Array} array
   */
  static fromArray (array) {
    return new Vec3(array[0] || 0, array[1] || 0, array[2] || 0)
  }

  /**
   * @param {Vec3} vec
   */
  copy (vec) {
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
    return this
  }

  /**
   * @param {Vec3} vec
   */
  clone () {
    let vec = new Vec3()
    vec.copy(this)
    return vec
  }
}

module.exports = Vec3
