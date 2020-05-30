const ObjectScene = require('../Objects/ObjectScene')
const Vec3 = require('../Utils/Vec3')
const Vec2 = require('../Utils/Vec2')
const Face = require('../Objects/Face')
const utils = require('../Utils/Utils')

class ImporterOBJ {
  /**
   * @param {String} fileContent
   * @param {Number} objIndex
   */
  static async importOBJ (fileContent, objIndex = 0) {
    console.log('Loading OBJ...')
    let initTime = window.performance.now()
    let objs = fileContent.split('o ')
    let line
    let vertexArray = []
    let uvsArray = []
    let uvs, vertex, normal, tangent, bitangent
    let v1, v2, v3
    if (objIndex + 1 >= objs.length) {
      console.log('Not valid id.')
      return null
    }

    let lines = objs[objIndex + 1].split('\n')
    let obj = new ObjectScene()
    let geometry = obj.meshes[0].geometry
    let vec3
    let vec2
    for (let i = 1; i < lines.length; i++) {
      line = lines[i].split(' ')
      switch (line[0]) {
        case 'v':
          vec3 = new Vec3(Number(line[1]), Number(line[2]), Number(line[3]))
          vertexArray.push(geometry.addVertices([vec3], null, false)[0])
          break

        case 'vt':
          vec2 = new Vec2(Number(line[1]), 1 - Number(line[2]))
          uvsArray.push(geometry.addCoordinates([vec2], false)[0])
          break

        case 'f':
          v1 = line[1].split('/')
          v2 = line[2].split('/')
          v3 = line[3].split('/')

          vertex = [
            vertexArray[v1[0] - 1], vertexArray[v2[0] - 1], vertexArray[v3[0] - 1]
          ]

          normal = Vec3.normals(vertex[0].vertex, vertex[1].vertex, vertex[2].vertex)
          normal = geometry.addNormals([normal])[0]

          if (v1.length > 1 && v1[1] !== '') {
            uvs = [
              uvsArray[v1[1] - 1],
              uvsArray[v2[1] - 1],
              uvsArray[v3[1] - 1]
            ]
            let res = utils.getTangentBitangent([
              vertex[0].vertex, vertex[1].vertex, vertex[2].vertex
            ], uvs, normal)
            tangent = geometry.addTangents([res.tangent])[0]
            bitangent = geometry.addBitangents([res.bitangent])[0]
          } else {
            uvs = null
            tangent = null
            bitangent = null
          }

          for (let i = 0; i < 3; i++) {
            vertex[i].addNormal(normal)
          }

          geometry.addFaces(
            new Face(vertex, normal, tangent, bitangent, uvs, true)
          )
          break

        default:
          break
      }
    }
    geometry.recalculateSmoothNormals()
    console.log(`End loading OBJ, time: ${((window.performance.now() - initTime) / 1000).toFixed(2)} s`)
    return obj
  }
}

module.exports = ImporterOBJ
