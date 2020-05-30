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

  /**
   * Funcion que devuelve el vector en un arreglo [x, y, z]
   */
  toArray () {
    return [this.x, this.y, this.z]
  }

  /**
   * @param {Vec3} vec
   */
  equal (vec) {
    if (this.x !== vec.x) return false
    if (this.y !== vec.y) return false
    if (this.z !== vec.z) return false
    return true
  }

  /**
   * Funcion para calcular el largo del vector.
   */
  length () {
    return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** 0.5
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
   * @param {Vec3} vector
   */
  cosAnleBetween (vector) {
    return this.dot(vector) / (this.length() * vector.length())
  }

  /**
   * Funcion para saber si se encunetra cerca un punto de otro.
   * @param {Vec2} vec
   */
  close (vec) {
    if (Math.abs(this.x - vec.x) > 1e-8) {
      return false
    }
    if (Math.abs(this.y - vec.y) > 1e-8) {
      return false
    }
    if (Math.abs(this.z - vec.z) > 1e-8) {
      return false
    }
    return true
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

  /**
   * @param {Array<Vec3>} array
   * @returns {Number} Indice de la posicion del elemento o null.
   */
  isInArray (array) {
    for (let i = 0; i < array.length; i++) {
      if (this.equal(array[i])) {
        return i
      }
    }
    return null
  }

  /**
   * @param {Array<Array<Vec3>>} array
   * @returns {Array<Number>} Indices del elemento o null.
   */
  isInArrayArray (array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (this.equal(array[i][j])) {
          return [i, j]
        }
      }
    }
    return null
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
}

module.exports = Vec3
