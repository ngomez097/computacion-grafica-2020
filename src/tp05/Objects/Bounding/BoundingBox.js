const Bounding = require('./Bounding')
const Vec3 = require('../../Utils/Vec3')

class BoundingBox extends Bounding {
  /*     v2     v1
   *    *-------*
   *   /|      /|
   *  /v3   v0/ |
   * *--|----*  |
   * |  *----|--* v5
   * | /v6   | /
   * |/      |/
   * *-------* v4
   * v7
   *
   * v0 = max
   * v6 = min
   */

  /**
   * @param {Vec3} max
   * @param {Vec3} min
   */
  constructor (max, min) {
    super()
    let scaleFactor = 1.0
    let vertexs = [
      max,
      new Vec3(max.x, max.y, min.z),
      new Vec3(min.x, max.y, min.z),
      new Vec3(min.x, max.y, max.z),
      new Vec3(max.x, min.y, max.z),
      new Vec3(max.x, min.y, min.z),
      min,
      new Vec3(min.x, min.y, max.z),
    ]
    vertexs.forEach(e => e.scale(scaleFactor))

    // Arriba
    this.lines.geometry.insertLine([
      vertexs[0], vertexs[1]
    ])
    this.lines.geometry.insertLine([
      vertexs[1], vertexs[2]
    ])
    this.lines.geometry.insertLine([
      vertexs[2], vertexs[3]
    ])
    this.lines.geometry.insertLine([
      vertexs[3], vertexs[0]
    ])

    // Abajo
    this.lines.geometry.insertLine([
      vertexs[4], vertexs[5]
    ])
    this.lines.geometry.insertLine([
      vertexs[5], vertexs[6]
    ])
    this.lines.geometry.insertLine([
      vertexs[6], vertexs[7]
    ])
    this.lines.geometry.insertLine([
      vertexs[7], vertexs[4]
    ])

    // Laterales
    this.lines.geometry.insertLine([
      vertexs[0], vertexs[4]
    ])
    this.lines.geometry.insertLine([
      vertexs[1], vertexs[5]
    ])
    this.lines.geometry.insertLine([
      vertexs[2], vertexs[6]
    ])
    this.lines.geometry.insertLine([
      vertexs[3], vertexs[7]
    ])
  }
}

module.exports = BoundingBox
