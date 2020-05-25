// eslint-disable-next-line no-unused-vars
const Vec3 = require('../Utils/Vec3')
// eslint-disable-next-line no-unused-vars
const Vec2 = require('../Utils/Vec2')
// eslint-disable-next-line no-unused-vars
const Vertex = require('./Vertex')

class Face {
  /**
   * @param {Array<Vertex>} vertexArray
   * @param {Vec3} normal
   * @param {Vec3} tangent
   * @param {Vec3} bitangent
   * @param {Array<Vec2>} UVArray
   */
  constructor (vertexArray, normal, tangent, bitangent, UVArray, shadeSmooth = false) {
    this.vertexArray = vertexArray
    this.normal = normal
    this.tangent = tangent
    this.bitangent = bitangent
    this.uvArray = UVArray
    this.shadeSmooth = shadeSmooth
  }
}

module.exports = Face
