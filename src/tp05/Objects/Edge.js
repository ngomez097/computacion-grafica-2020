// eslint-disable-next-line no-unused-vars
const Vertex = require('./Vertex')

class Edge {
  /**
   * @param {Vertex} v1
   * @param {Vertex} v2
   */
  constructor (v1, v2) {
    this.v1 = v1
    this.v2 = v2
  }

  /**
   * @param {Edge} edge
   */
  close (edge) {
    return this.v1.close(edge.v1) && this.v2.close(edge.v2)
  }
}

module.exports = Edge
