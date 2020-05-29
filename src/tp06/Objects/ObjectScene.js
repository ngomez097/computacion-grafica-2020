const Mesh = require('./Mesh')
const ObjectProperty = require('./ObjectProperty')
const Axis = require('../Axis/Axis')
const Material = require('./Material/Material')
const Vec3 = require('../Utils/Vec3')

class ObjectScene extends ObjectProperty {
  /**
   * @param {Mesh.renderType} renderType Forma en la que se dibujara.
   * @param  {...any} meshes mallas extras del objeto.
   */
  constructor (renderType = Mesh.RENDER_TYPE.TRIANGLES, ...meshes) {
    super()
    let mesh = new Mesh(
      new Material(),
      renderType
    )
    this.meshes = [mesh]
    this.enableRender = true
    this.showLocalAxis = false
    this.localAxisRepresentation = new Axis()
    this.selectable = false
    this.useMeshAsBounding = true
    /** @type Array<Mesh> */this.normalsRay = []
    this.showNormalsRay = false

    for (let mesh of meshes) {
      this.meshes.push(mesh)
    }
  }

  getMeshes () {
    return this.meshes
  }

  /**
   * Funcion para determinar si se muestra la maya como Wireframe.
   * @param {*} bool True si se muestra el wireframe.
   * @param {*} mesh La maya objetivo.
   */
  showWireframe (bool, mesh = 0) {
    if (bool && this.meshes[mesh].renderType !== Mesh.RENDER_TYPE.LINES) {
      this.meshes[mesh].renderType = Mesh.RENDER_TYPE.LINES
      this.meshes[mesh].geometry.hasChanged = true
    } else if (!bool && this.meshes[mesh].renderType !== Mesh.RENDER_TYPE.TRIANGLES) {
      this.meshes[mesh].renderType = Mesh.RENDER_TYPE.TRIANGLES
      this.meshes[mesh].geometry.hasChanged = true
    }
  }

  shadeSmooth (bool) {
    for (let mesh of this.meshes) {
      if (mesh.geometry.shadeSmooth !== bool) {
        mesh.geometry.shadeSmooth = bool
        mesh.geometry.hasChanged = true
      }
    }
  }

  showNomrals (active, length = 0.5) {
    let mesh
    let normalArray
    if (this.meshes[0].geometry.hasChanged) {
      this.normalsRay = []
    }
    if (this.normalsRay.length === 0 && active === true) {
      mesh = new Mesh(
        new Material(new Vec3(0.8, 0.8, 0.8)),
        Mesh.RENDER_TYPE.LINES
      )
      this.normalsRay.push(
        mesh
      )

      this.meshes[0].geometry.vertices.forEach(vertex => {
        if (this.meshes[0].geometry.shadeSmooth) {
          normalArray = vertex.smoothNormals
        } else {
          normalArray = vertex.normals
        }
        normalArray.forEach(normal => {
          mesh.geometry.insertLine([
            vertex.vertex,
            vertex.vertex.add(normal.scale(length))
          ])
        })
      })
    }
    if (active !== this.showNomrals) {
      this.showNormalsRay = active
    }
  }

  remesh () {
    console.log('Remesh Function not implemented.')
  }
}

module.exports = ObjectScene
