const Vec3 = require('../Utils/Vec3')

class Vertex {
  /**
   * @param {Vec3} vertex
   * @param {Vec3} normal
   */
  constructor (vertex = new Vec3(), normal = new Vec3(0.0, 1.0)) {
    this.vertex = vertex
    /** @type {Array<Vec3>} */this.normals = []

    if (normal != null) {
      this.normals.push(normal)
    }
    this.smoothNormals = null
  }

  /**
   * @param {Vertex} vertex
   */
  close (vertex) {
    return this.vertex.close(vertex.vertex)
  }

  /**
   * @param {Vec3} normal
   */
  addNormal (normal) {
    if (normal == null) {
      return
    }
    if (!(normal instanceof Vec3)) {
      console.error('normal is not instance of Vec3', normal)
      return
    }
    if (!normal.isInArray(this.normals)) {
      this.normals.push(normal)
    }
  }

  /**
   * @param {Vec3} faceNormal
   * @return {Vec3}
   */
  getNormal (faceNormal) {
    let maxAngle = 0
    let closeNormal
    let cosAnlge
    let normalArray
    if (this.smoothNormals) {
      normalArray = this.smoothNormals
    } else {
      normalArray = this.normals
    }
    for (let i = 0; i < normalArray.length; i++) {
      cosAnlge = faceNormal.dot(normalArray[i])
      if (cosAnlge > maxAngle) {
        closeNormal = normalArray[i]
        maxAngle = cosAnlge
      }
    }
    return closeNormal
  }

  recalculateSmoothNormal (smoothCosAngle) {
    let normals
    let newNormals = this.normals
    let cosAnlge
    let i, j
    let testedNormals
    let needJoin
    let found
    normals = newNormals
    newNormals = []
    testedNormals = []
    needJoin = []

    for (i = 0; i < normals.length; i++) {
      if (testedNormals.includes(i)) {
        continue
      }
      found = false

      for (j = i + 1; j < normals.length; j++) {
        cosAnlge = normals[i].dot(normals[j])
        if (cosAnlge > smoothCosAngle) {
          let elementIndex = normals[i].isInArrayArray(needJoin)
          if (elementIndex) {
            if (!normals[j].isInArray(needJoin[elementIndex[0]])) {
              needJoin[elementIndex[0]].push(normals[j])
            }
          } else {
            needJoin.push([normals[i], normals[j]])
          }
          found = true
        }
      }

      if (!found && !normals[i].isInArrayArray(needJoin)) {
        newNormals.push(normals[i])
      }
    }

    for (let join of needJoin) {
      let aux = new Vec3()
      join.forEach((vec) => {
        aux = aux.add(vec)
      })
      newNormals.push(aux.normalize())
    }
    this.smoothNormals = newNormals
  }
}

module.exports = Vertex
