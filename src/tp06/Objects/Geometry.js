const Vec3 = require('../Utils/Vec3')
// eslint-disable-next-line no-unused-vars
const Vec2 = require('../Utils/Vec2')
const Vertex = require('./Vertex')
const Edge = require('./Edge')
const Face = require('./Face')

const utils = require('../Utils/Utils')
const cos = Math.cos
const sin = Math.sin
const FIXED_SIZE = 2

class Geometry {
  /**
   * @param {Geometry.TYPE} type Es el tipo de geometria que se define, DEFAULT = Geometry.TYPE.3D
   */
  constructor (type = Geometry.TYPE['3D']) {
    /** @type Map<Number, Array<Vertex>> */this.vertices = new Map()
    /** @type Array<Face> */this.faces = []
    /** @type Map<Number, Array<Vec3>> */this.normals = new Map()
    /** @type Array<Edge> */this.edges = []
    /** @type Map<Number, Array<Vec2>> */this.coordinates = new Map()
    /** @type Map<Number, Array<Vec3> */this.tangents = new Map()
    /** @type Map<Number, Array<Vec3> */this.bitangents = new Map()
    this.type = type
    this.verticesBuffer = null
    this.normalsBuffer = null
    this.indexBuffer = null
    this.indexBufferLength = 0
    this.coordinatesBuffer = null
    this.tangentsBuffer = null
    this.bitangentsBuffer = null
    this.shadeSmooth = false
    this.hasChanged = true
    this.smoothAngle = 0.0
  }

  static get TYPE () {
    return {
      '2D': 2,
      '3D': 3
    }
  }

  addToArray (newValues, array, checkForDuplicated = true) {
    let key, index
    let elementArray
    let insertedElements = []
    let element
    let found
    for (let newValue of newValues) {
      if (newValue instanceof Vertex) {
        key = newValue.vertex.x.toFixed(FIXED_SIZE)
      } else {
        key = newValue.x.toFixed(FIXED_SIZE)
      }
      elementArray = array.get(key)
      if (elementArray == null) {
        array.set(key, [newValue])
      } else if (checkForDuplicated) {
        found = false
        for (index = 0; index < elementArray.length; index++) {
          element = elementArray[index]
          if (element.close(newValue)) {
            if (element instanceof Vertex && newValue instanceof Vertex) {
              element.addNormal(newValue.normals[0])
            }
            newValue = element
            found = true
            break
          }
        }
        if (!found) {
          elementArray.push(newValue)
        }
      } else {
        elementArray.push(newValue)
      }
      insertedElements.push(newValue)
    }
    return insertedElements
  }

  /**
   * Funcion que agrega vertices al arreglo de vertices y busca si ya esta insertado.
   * @param {Array<Vec3>} vertices Un arreglo de vertices.
   * @param {Vec3} normal Un la normal de los vertices.
   * @param {Boolean} checkForDuplicated Si se comprueba la existencia del vertice.
   * @returns {Array<Vertex>} Un arreglo que contiene los vertices que pertenecen a la geometria.
   */
  addVertices (vertices, normal, checkForDuplicated = true) {
    let aux = []
    for (let vertex of vertices) {
      aux.push(new Vertex(vertex, normal))
    }
    return this.addToArray(aux, this.vertices, checkForDuplicated)
  }

  /**
   * Funcion que agrega normales al arreglo de normales y busca si ya esta insertado.
   * @param {Array<Vec3>} normals Un arreglo de vertices con el formato [x, y, z].
   * @param {Boolean>} checkForDuplicated Si se comprueba la existencia del vertice.
   * @returns {Array<Vec3>} Un arreglo que contiene las normales que pertenecen a la geometria.
   */
  addNormals (normals, checkForDuplicated = true) {
    return this.addToArray(normals, this.normals, checkForDuplicated)
  }

  /**
   * @param {Array<Vec2>} coordinates
   * @param {Boolean>} checkForDuplicated Si se comprueba la existencia de la coordenada.
   * @returns {Array<Vec2>}
   */
  addCoordinates (coordinates, checkForDuplicated = true) {
    return this.addToArray(coordinates, this.coordinates, checkForDuplicated)
  }

  /**
   * @param {Array<Vec3>} tangents
   * @param {Boolean>} checkForDuplicated Si se comprueba la existencia de la coordenada.
   * @returns {Array<Vec3>}
   */
  addTangents (tangents, checkForDuplicated = true) {
    return this.addToArray(tangents, this.tangents, checkForDuplicated)
  }

  /**
   * @param {Array<Vec3>} bitangents
   * @param {Boolean>} checkForDuplicated Si se comprueba la existencia de la coordenada.
   * @returns {Array<Vec3>}
   */
  addBitangents (bitangents, checkForDuplicated = true) {
    return this.addToArray(bitangents, this.bitangents, checkForDuplicated)
  }

  /**
   * Funcion que agrega caras en el arreglo de caras.
   * @param {Array<Face>} faces Un arreglo con las caras de la geometria
   */
  addFaces (...faces) {
    let i
    let face
    for (face of faces) {
      for (i = 0; i < face.vertexArray.length - 1; i++) {
        this.edges.push(
          new Edge(
            face.vertexArray[i],
            face.vertexArray[i + 1]
          )
        )
      }
      if (face.vertexArray.length > 2) {
        this.edges.push(
          new Edge(
            face.vertexArray[i],
            face.vertexArray[0]
          )
        )
      }
      this.faces.push(face)
    }
  }

  recalculateSmoothNormals () {
    this.vertices.forEach(vertexArray => {
      for (let vertex of vertexArray) {
        vertex.recalculateSmoothNormal(this.smoothAngle)
      }
    })
  }

  setSmoothAngle (angle) {
    let cosAngle = Math.cos(utils.toRadian(angle))
    if (this.smoothAngle !== cosAngle) {
      this.smoothAngle = cosAngle
      this.recalculateSmoothNormals()
      this.hasChanged = true
    }
  }

  getData (wireframe = false) {
    let vertex = []
    let normals = []
    let uvs = []
    let tangents = []
    let bitangents = []
    let arr

    if (wireframe) {
      this.edges.forEach((edge) => {
        utils.pushArrays(vertex, edge.v1.vertex.toArray())
        utils.pushArrays(vertex, edge.v2.vertex.toArray())
      })

      return {
        vertexs: vertex,
        normals: normals,
        uvs: uvs,
        tangents: tangents,
        bitangents: bitangents
      }
    }

    this.faces.forEach((face) => {
      for (let i = 0; i < face.vertexArray.length; i++) {
        utils.pushArrays(vertex,
          face.vertexArray[i].vertex.toArray()
        )

        if (this.normals.size > 0) {
          if (this.shadeSmooth && face.shadeSmooth) {
            arr = face.vertexArray[i].getNormal(face.normal)
            arr = arr != null ? arr.toArray() : face.normal.toArray()
            utils.pushArrays(normals, arr)
          } else {
            utils.pushArrays(normals,
              face.normal.toArray()
            )
          }
        }

        if (this.tangents.size > 0) {
          utils.pushArrays(tangents,
            face.tangent.toArray()
          )
        }

        if (this.bitangents.size > 0) {
          utils.pushArrays(bitangents,
            face.bitangent.toArray()
          )
        }

        if (this.coordinates.size > 0) {
          utils.pushArrays(uvs,
            face.uvArray[i].toArray()
          )
        }
      }
    })

    return {
      vertexs: vertex,
      normals: normals,
      uvs: uvs,
      tangents: tangents,
      bitangents: bitangents
    }
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
    this.vertices.clear()
    this.faces = []
    this.normals.clear()
    this.edges = []
    this.coordinates.clear()
    this.tangents.clear()
    this.bitangents.clear()
    this.hasChanged = true
  }

  /**
   * Funcion que inserta una linea a la geometria.
   * @param {Array<Vec3>} vertices: Se espera que se manden exactamente 3 vertices.
   * @param {Boolean} checkForDuplicated: Si se comprueba la existencia del vertice.
   */
  insertLine (vertices, checkForDuplicated = true) {
    if (vertices.length !== 2) {
      return
    }
    let vertexArray = this.addVertices(vertices, null, checkForDuplicated)

    this.addFaces(
      new Face(
        vertexArray
      )
    )
  }

  /**
   * Funcion que inserta un triangulo a la geometria.
   * @param {Array<Vec3>} vertices: Se espera que se manden exactamente 3 vertices.
   * @param {Boolean} smoothShade: si se duplica el vertice.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   * @param {Number} uvScale: el tamaño de la UV por defecto.
   * @param {Array<Vec2>} uvs: arreglo de las uv.
   * @param {Vec3} tangent: tangente de las uv.
   */
  insertTriangle (vertices, smoothShade = false, flipNormal = false, uvScale = 1.0, uvs = null, tangent = null) {
    if (vertices.length !== 3) {
      return
    }

    let normal
    let bitangent
    let vertexArray
    if (uvs == null) {
      uvs = [
        new Vec2(0, 0),
        new Vec2(uvScale, 0),
        new Vec2(uvScale, uvScale),
      ]
    }

    normal = Vec3.normals(vertices[0], vertices[1 + flipNormal], vertices[2 - flipNormal])
    normal = this.addNormals([normal])[0]

    let res = utils.getTangentBitangent(vertices, uvs, normal)
    tangent = res.tangent
    bitangent = res.bitangent

    vertexArray = this.addVertices(vertices, normal)

    if (flipNormal) {
      let aux = vertexArray[2]
      vertexArray[2] = vertexArray[1]
      vertexArray[1] = aux
    } else {
      bitangent.invert()
    }

    uvs = this.addCoordinates(uvs)
    tangent = this.addTangents([tangent])[0]
    bitangent = this.addBitangents([bitangent])[0]

    this.addFaces(
      new Face(
        vertexArray,
        normal,
        tangent,
        bitangent,
        [uvs[0], uvs[2 - !flipNormal], uvs[1 + !flipNormal]],
        smoothShade
      )
    )
  }

  /**
   * Funcion que inserta un plano a la geometria.
   * @param {Array<Vec3>} vertices Se espera que se manden exactamente 4 vertices.
   * @param {Boolean} smoothShade: si la cara es suave.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   * @param {Number} uvScale: la escala de la UV para la textura.
   * @param {Array<Vec2>} uvs: arreglo de las uv.
   */
  insertPlane (vertices, smoothShade = false, flipNormal = false, uvScale = 1.0, uvs = null) {
    if (vertices.length !== 4) {
      return
    }

    let normal
    let vertexArray
    let tangent
    let bitangent
    if (uvs == null) {
      uvs = [
        new Vec2(0, 0),
        new Vec2(uvScale, 0),
        new Vec2(uvScale, uvScale),
        new Vec2(0, uvScale),
      ]
    } else {
      uvs.forEach((uv, index) => {
        uvs[index] = uv.scale(uvScale)
        return uv
      })
    }

    normal = Vec3.normals(vertices[0], vertices[1 + flipNormal], vertices[2 - flipNormal])
    normal = this.addNormals([normal])[0]

    vertexArray = this.addVertices(vertices, normal)

    let res = utils.getTangentBitangent(vertices, uvs, normal)
    tangent = res.tangent
    bitangent = res.bitangent

    if (!flipNormal) {
      bitangent.invert()
    }

    uvs = this.addCoordinates(uvs)
    tangent = this.addTangents([tangent])[0]
    bitangent = this.addBitangents([bitangent])[0]

    this.addFaces(
      new Face(
        [vertexArray[0], vertexArray[1 + flipNormal], vertexArray[2 - flipNormal]],
        normal,
        tangent,
        bitangent,
        [uvs[0], uvs[2 - !flipNormal], uvs[1 + !flipNormal]],
        smoothShade
      ),
      new Face(
        [vertexArray[0], vertexArray[2 + flipNormal], vertexArray[3 - flipNormal]],
        normal,
        tangent,
        bitangent,
        [uvs[0], uvs[3 - !flipNormal], uvs[2 + !flipNormal]],
        smoothShade
      )
    )
  }

  /**
   * Funcion para insertar una cara con mas de 5 vertices, combierte la cara en triangulos
   * @param {Array<Vec3>} vertices Es un arreglo de vertices.
   * @param {Boolean} smoothShade: si la cara es suave.
   * @param {Boolean} flipNormal: si se dibuja la normal alrevez.
   */
  insertNGon (vertices, smoothShade = false, flipNormal = false) {
    if (vertices.length < 5) {
      return
    }

    let innerIndex = [0]
    let uvs = [new Vec2(1.0, 0.5)]
    let uv
    let isPair = vertices.length % 2 === 0
    let count = Math.floor(vertices.length / 2)
    let da = utils.toRadian(360 / vertices.length)

    count -= isPair
    /* if (isPair) {
      count -= 1
    } */

    const cosR = (angle) => { return 0.5 + 0.5 * cos(angle) }
    const sinR = (angle) => { return 0.5 - 0.5 * sin(angle) }

    for (let i = 0; i < count; i++) {
      uv = [
        new Vec2(cosR(da * (i * 2)), sinR(da * i * 2)),
        new Vec2(cosR(da * (i * 2 + 1)), sinR(da * (i * 2 + 1))),
        new Vec2(cosR(da * (i * 2 + 2)), sinR(da * (i * 2 + 2))),
      ]

      this.insertTriangle([
        vertices[i * 2], vertices[i * 2 + 1], vertices[i * 2 + 2]
      ], smoothShade, flipNormal, 1.0, uv)
      innerIndex.push(i * 2 + 2)
      uvs.push(uv[2])
    }
    if (isPair) {
      uv = [
        new Vec2(cosR(da * (count * 2)), sinR(da * count * 2)),
        new Vec2(cosR(da * (count * 2 + 1)), sinR(da * (count * 2 + 1))),
        new Vec2(1, 0.5),
      ]
      this.insertTriangle([
        vertices[count * 2], vertices[count * 2 + 1], vertices[0]
      ], smoothShade, flipNormal, 1.0, uv)
    }

    if (innerIndex.length === 3) {
      this.insertTriangle([
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]]
      ], false, flipNormal, 1.0, uvs)
    } else if (innerIndex.length === 4) {
      this.insertPlane([
        vertices[innerIndex[0]],
        vertices[innerIndex[1]],
        vertices[innerIndex[2]],
        vertices[innerIndex[3]]
      ], false, flipNormal, 1.0, uvs)
    } else {
      let auxVertices = []
      for (let i of innerIndex) {
        auxVertices.push(vertices[i])
      }
      this.insertNGon(auxVertices, false, flipNormal)
    }
  }

  /**
   */
  getExtremeBoxVertex () {
    if (this.vertices.length === 0) {
      return null
    }
    let max = this.vertices.values().next().value[0].vertex.clone()
    let min = max.clone()
    let vertex
    this.vertices.forEach(vertexArray => {
      for (vertex of vertexArray) {
        max.x = Math.max(max.x, vertex.x)
        max.y = Math.max(max.y, vertex.y)
        max.z = Math.max(max.z, vertex.z)

        min.x = Math.min(min.x, vertex.x)
        min.y = Math.min(min.y, vertex.y)
        min.z = Math.min(min.z, vertex.z)
      }
    })
    return {
      max: max,
      min: min
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
    clone.edges = [...this.edges]
    clone.coordinates = [...this.coordinates]
    clone.tangents = [...this.tangents]
    clone.bitangents = [...this.bitangents]
    clone.hasChanged = true
    return clone
  }
}

module.exports = Geometry
