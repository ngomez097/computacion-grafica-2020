const Vec3 = require('../Utils/Vec3')
// eslint-disable-next-line no-unused-vars
const Vec2 = require('../Utils/Vec2')

class Geometry {
  /**
   * @param {Geometry.TYPE} type Es el tipo de geometria que se define, DEFAULT = Geometry.TYPE.3D
   */
  constructor (type = Geometry.TYPE['3D']) {
    this.vertices = []
    this.faces = []
    this.normals = []
    this.wireframeFaces = []
    this.coordinates = []
    this.tangents = []
    this.type = type
    this.verticesBuffer = null
    this.normalsBuffer = null
    this.indexBuffer = null
    this.coordinatesBuffer = null
    this.tangentsBuffer = null
    this.textureHasChanged = true
    this.hasChanged = true
  }

  static get TYPE () {
    return {
      '2D': 2,
      '3D': 3
    }
  }

  /**
   * Funcion que agrega vertices al arreglo de vertices y busca si ya esta insertado.
   * @param {Array<Vec3>} vertices Un arreglo de vertices con el formato [x, y, z].
   * @param {Boolean} duplicated Si se permite tener vertices duplicados.
   * @returns Un arreglo que contiene los indices de los vertices insertados.
   */
  addVertices (vertices, duplicated = false) {
    let auxIndex = this.vertices.length / 3
    let found = false
    let index = []
    let i
    for (let vertice of vertices) {
      if (duplicated !== undefined && !duplicated) {
        // Buscando duplicados
        for (i = auxIndex - 1; i >= 0; i -= 1) {
          if (vertice.distance(this.getVertice(i)) < 0.01) {
            index.push(i)
            found = true
            break
          }
        }
        if (found) {
          found = false
          continue
        }
      }

      this.vertices.push(...vertice.toArray())

      index.push(auxIndex)
      auxIndex++
    }
    return index
  }

  /**
   * Funcion que agrega caras en el arreglo de caras.
   * @param {Array} faces Un arreglo con los indices de los
   *  vertices que conforman la cara.
   */
  addFaces (...faces) {
    let i
    for (let face of faces) {
      for (i = 0; i < face.length - 1; i++) {
        this.faces.push(face[i])
        this.wireframeFaces.push(face[i], face[i + 1])
      }
      if (face.length > 2) {
        this.wireframeFaces.push(face[i], face[0])
      }
      this.faces.push(face[i])
    }
  }

  /**
   * Funcion para obtener un vertice.
   * @param  {Number} index El indice del vertice
   */
  getVertice (index) {
    let vertice
    let fixIndex
    vertice = new Vec3()
    fixIndex = index * this.type
    vertice.x = this.vertices[fixIndex]
    vertice.y = this.vertices[++fixIndex]
    vertice.z = this.vertices[++fixIndex]

    return vertice
  }

  /**
   * Funcion para obtener los vertices.
   * @param  {...Number} index Los indices para obtener los vertices.
   */
  getVertices (...index) {
    let vertices = []
    let vertice
    let fixIndex
    for (let i of index) {
      vertice = new Vec3()
      fixIndex = i * this.type
      vertice.x = this.vertices[fixIndex]
      vertice.y = this.vertices[++fixIndex]
      vertice.z = this.vertices[++fixIndex]
      vertices.push(vertice)
    }

    return vertices
  }

  /**
   * Funcion para agregar normales a los vertices.
   * @param {Array<Number>} index Arreglo que trae los indices de los vertices a cuales corresponde la normal.
   * @param  {...Vec3} normals Arreglo con las normales.
   */
  addNormals (index, ...normals) {
    if (index.length !== normals.length) {
      return false
    }

    for (let i = 0; i < index.length; i++) {
      let normal = normals[i]
      let auxIndex = index[i] * 3

      if (this.normals[auxIndex] !== undefined) {
        normal.x += this.normals[auxIndex]
        normal.y += this.normals[auxIndex + 1]
        normal.z += this.normals[auxIndex + 2]

        normal.normalize()
      }
      this.normals[auxIndex] = normal.x
      this.normals[auxIndex + 1] = normal.y
      this.normals[auxIndex + 2] = normal.z
    }

    return true
  }

  /**
   * Funcion para agregar normales a los vertices.
   * @param {Array<Number>} index Arreglo que trae los indices de los vertices a cuales corresponde la normal.
   * @param {Vec3} normal La normal para los vertices.
   */
  setNormal (index, normal) {
    let auxNormal
    for (let i = 0; i < index.length; i++) {
      let auxIndex = index[i] * 3
      auxNormal = new Vec3().copy(normal)
      if (this.normals[auxIndex] !== undefined) {
        auxNormal.x += this.normals[auxIndex]
        auxNormal.y += this.normals[auxIndex + 1]
        auxNormal.z += this.normals[auxIndex + 2]

        auxNormal.normalize()
      }
      this.normals[auxIndex] = auxNormal.x
      this.normals[auxIndex + 1] = auxNormal.y
      this.normals[auxIndex + 2] = auxNormal.z
    }

    return true
  }

  /**
   * Funcion para obtener los vertices.
   * @param  {Array<Number>} index Los indices para obtener los vertices.
   */
  getNormals (index) {
    let normals = []
    let normal
    let fixIndex
    for (let i of index) {
      fixIndex = i * this.type
      normal = new Vec3(
        this.normals[fixIndex],
        this.normals[++fixIndex],
        this.normals[++fixIndex],
      )
      normals.push(normal)
    }

    if (normals.length === 1) {
      return normals[0]
    }
    return normals
  }

  /**
   * Funcion para limpiar los datos de la geometria.
   */
  clearData () {
    this.vertices = []
    this.faces = []
    this.normals = []
    this.wireframeFaces = []
    this.coordinates = []
    this.tangents = []
    this.hasChanged = true
  }

  /**
   * Funcion que inserta una linea a la geometria.
   * @param {Array<Vec3>} vertices: Se espera que se manden exactamente 3 vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertLine (vertices, duplicated = true) {
    if (vertices.length !== 2) {
      return
    }
    let index = this.addVertices(vertices, duplicated)

    this.addFaces(
      [index[0], index[1]]
    )
  }

  /**
   * Funcion que inserta un triangulo a la geometria.
   * @param {Array<Vec3>} vertices: Se espera que se manden exactamente 3 vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertTriangle (vertices, duplicated = false, flipNormal = false) {
    if (vertices.length !== 3) {
      return
    }
    let normal
    let index = this.addVertices(vertices, duplicated)

    if (flipNormal) {
      this.addFaces(
        [index[0], index[2], index[1]]
      )
      normal = Vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      this.addFaces(
        [index[0], index[1], index[2]]
      )
      normal = Vec3.normals(vertices[0], vertices[1], vertices[2])
    }

    this.setNormal(
      [index[0], index[1], index[2]],
      normal
    )
  }

  /**
   * Funcion que inserta un plano a la geometria.
   * @param {Array<Vec3>} vertices Se espera que se manden exactamente 4 vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   * @param {Number} uvScale: la escala de la UV para la textura.
   */
  insertPlane (vertices, duplicated = false, flipNormal = false, uvScale = 1.0) {
    if (vertices.length !== 4) {
      return
    }
    let normal
    let index = this.addVertices(vertices, duplicated)

    if (flipNormal) {
      this.addFaces(
        [index[0], index[2], index[1]],
        [index[0], index[3], index[2]]
      )
      normal = Vec3.normals(vertices[0], vertices[2], vertices[1])
    } else {
      this.addFaces(
        [index[0], index[1], index[2]],
        [index[0], index[2], index[3]]
      )
      normal = Vec3.normals(vertices[0], vertices[1], vertices[2])
    }

    this.setNormal(
      [index[0], index[1], index[2], index[3]],
      normal
    )

    let edges
    let deltaUV
    let uvs = [
      new Vec2(0, 0),
      new Vec2(uvScale, 0),
      new Vec2(uvScale, uvScale),
      new Vec2(0, uvScale)
    ]

    edges = [vertices[1].sub(vertices[0]), vertices[2].sub(vertices[0])]
    deltaUV = [uvs[1].sub(uvs[0]), uvs[2].sub(uvs[0])]

    let r = 1.0 / (deltaUV[0].x * deltaUV[1].y - deltaUV[0].y * deltaUV[1].x)
    let tangent = (edges[0].scale(deltaUV[1].y)).sub(edges[1].scale(deltaUV[0].y)).scale(r)
    if (!flipNormal) {
      tangent.invert()
    }
    this.setCoordinates(
      [index[0], index[1], index[2], index[3]],
      uvs,
      tangent
    )
  }

  /**
   * Funcion para insertar una cara con mas de 5 vertices, combierte la cara en triangulos
   * @param {Array<Vec3>} vertices Es un arreglo de vertices.
   * @param {Boolean} duplicated: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertNGon (vertices, duplicated = false, flipNormal = false) {
    if (vertices.length < 5) {
      return
    }

    let innerIndex = [0]
    let isPair = vertices.length % 2 === 0
    let count = Math.floor(vertices.length / 2)

    count -= isPair
    /* if (isPair) {
      count -= 1
    } */

    for (let i = 0; i < count; i++) {
      this.insertTriangle([
        vertices[i * 2], vertices[i * 2 + 1], vertices[i * 2 + 2]
      ], duplicated, flipNormal)
      innerIndex.push(i * 2 + 2)
    }
    if (isPair) {
      this.insertTriangle([
        vertices[count * 2], vertices[count * 2 + 1], vertices[0]
      ], duplicated, flipNormal)
    }

    if (innerIndex.length === 3) {
      this.insertTriangle([
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]]
      ], false, flipNormal)
    } else if (innerIndex.length === 4) {
      this.insertPlane([
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]],
        vertices[innerIndex[3]]
      ], false, flipNormal)
    } else {
      let auxVertices = []
      for (let i of innerIndex) {
        auxVertices.push(vertices[i])
      }
      this.insertNGon(auxVertices, false, flipNormal)
    }
  }

  /**
   * @param {Array<Number>} indexs
   * @param {Array<Vec2>} coordinates
   * @param {Vec3} tangent
   */
  setCoordinates (indexs, coordinates, tangent) {
    for (let i = 0; i < indexs.length; i++) {
      this.coordinates[indexs[i] * 2] = coordinates[i].x
      this.coordinates[indexs[i] * 2 + 1] = coordinates[i].y

      if (tangent) {
        this.tangents[indexs[i] * 3] = tangent.x
        this.tangents[indexs[i] * 3 + 1] = tangent.y
        this.tangents[indexs[i] * 3 + 2] = tangent.z
      }
    }
  }

  /**
   * Funcion para realizar una copia de la clase.
   */
  clone () {
    let clone = new Geometry(this.type)
    clone.vertices = [...this.vertices]
    clone.faces = [...this.faces]
    clone.normals = [...this.normals]
    clone.wireframeFaces = [...this.wireframeFaces]
    clone.coordinates = [...this.coordinates]
    clone.tangents = [...this.tangents]
    clone.hasChanged = true
    return clone
  }
}

module.exports = Geometry
