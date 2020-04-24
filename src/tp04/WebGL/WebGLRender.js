const webGLUtil = require('./WebGLUtil')
const PerspectiveCamera = require('../Camera/PerspectiveCamera')
const Geometry = require('../Objects/Geometry')
const Mesh = require('../Objects/Mesh')

const mat4 = require('gl-matrix/mat4')
const vec3 = require('gl-matrix/vec3')

class WebGLRender {
  constructor (canvas) {
    if (canvas == null) {
      alert('there is no canvas on this page')
      return
    }
    let posibleWebGL = ['webgl',
      'experimental-webgl',
      'webkit-3d',
      'moz-webgl'
    ]
    this._gl = null
    for (let name of posibleWebGL) {
      this._gl = canvas.getContext(name)
      if (this._gl) {
        break
      }
    }
    this.initWebGL()
  }

  initWebGL () {
    if (this.prg != null) {
      return
    }
    this.prg = this._gl.createProgram()

    this.initShader('./vertex-shader.glsl', this._gl.VERTEX_SHADER)
    this.initShader('./fragment-shader.glsl', this._gl.FRAGMENT_SHADER)

    this._gl.linkProgram(this.prg)

    if (!this._gl.getProgramParameter(this.prg, this._gl.LINK_STATUS)) {
      console.error(this._gl.getProgramInfoLog(this.prg))
    }

    this._gl.useProgram(this.prg)
    this._gl.enable(this._gl.DEPTH_TEST)
    this._gl.enable(this._gl.CULL_FACE)
    this._gl.cullFace(this._gl.BACK)
  }

  initShader (pathShader, type) {
    const source = require('' + pathShader)
    let shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)

    let message = this._gl.getShaderInfoLog(shader)

    if (message.length > 0) {
      /* message may be an error or a warning */
      console.error(message)
    }

    this._gl.attachShader(this.prg, shader)
  }

  /** Funcion que recibe un arraglo de vertices 2D float
   * y los establece en el buffer
   */
  setVertexBuffer2D (vertexArray) {
    this.vertex_buffer = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertex_buffer)

    this._gl.bufferData(this._gl.ARRAY_BUFFER,
      new Float32Array(vertexArray),
      this._gl.STATIC_DRAW)

    webGLUtil.bindAttributeArrayFloat(this._gl, this.prg, 'a_VertexPosition', 2)
    // Desvinculacion del buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
  }

  setVertexBuffer3D (vertexArray) {
    this.vertex_buffer = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertex_buffer)

    this._gl.bufferData(this._gl.ARRAY_BUFFER,
      new Float32Array(vertexArray),
      this._gl.STATIC_DRAW)

    webGLUtil.bindAttributeArrayFloat(this._gl, this.prg, 'a_VertexPosition', 3)
    // Desvinculacion del buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
  }

  setNormal3D (normalArray) {
    this.vertex_buffer = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertex_buffer)

    this._gl.bufferData(this._gl.ARRAY_BUFFER,
      new Float32Array(normalArray),
      this._gl.STATIC_DRAW)

    webGLUtil.bindAttributeArrayFloat(this._gl, this.prg, 'a_VertexNormal', 3)
    // Desvinculacion del buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
  }

  /** Funcion que recibe un arraglo de indices 2D int
   * y los establece en el buffer
   */
  setIndexBuffer (indexArray) {
    this.index_buffer = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)

    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indexArray),
      this._gl.STATIC_DRAW)

    // Desvinculacion del buffer
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null)
  }

  drawElementsTriangle (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.TRIANGLES, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  drawElementsLineLoop (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.LINE_LOOP, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  drawElementsLines (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.LINES, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  clearBackground (color) {
    webGLUtil.resizeCanvas(this._gl)
    webGLUtil.paintBackground(this._gl, color)
  }

  /**
   *  Funcion para calcular la direccion de un rayo desde la camara
   * con respecto a un punto en la pantalla.
   * @param {*} x Posicion x de la pantalla.
   * @param {*} y Posicion y de la pantalla.
   * @param {*} camera Camara de la cual calcular el rayo.
   */
  rayCasting (x, y, camera) {
    let matP = camera.getProjectionMatrix()
    let matV = camera.getViewMatrix()
    let canvas = this._gl.canvas
    let aux = []

    mat4.invert(matP, matP)
    mat4.invert(matV, matV)

    let nx = 2.0 * x / canvas.clientWidth - 1.0
    let ny = 1.0 - 2.0 * y / canvas.clientHeight
    let vector = [nx, ny, -1.0, 0.0]

    mat4.multiply(aux, matP, vector)
    vector = [aux[0], aux[1], -1.0, 0.0]

    mat4.multiply(aux, matV, vector)
    vector = [aux[0], aux[1], aux[2]]

    vec3.normalize(vector, vector)
    return vector
  }

  /**
   * Metodo para dibjur en el canvas la escena.
   * @param {Scene} scene Escena a dibujar.
   * @param {Camera} camera Camara donde se dibujara.
   */
  render (scene, camera) {
    // Establecer la relacion de aspecto de la camara
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight
    }

    let ModelMatrix
    let InvertseTransposeModelMatrix
    let vertices
    let faces
    let normals

    // Se establece la matriz de proyeccion
    let PMatrix = camera.getProjectionMatrix()
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_PMatrix', PMatrix)

    // Se establece las propiedades de la camara
    let VMatrix = camera.getViewMatrix()
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_VMatrix', VMatrix)
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_eyes_position', camera.eye)

    /* Se establece las luces. */
    // Luz de ambiente.
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_ambientLight', scene.ambientLight)
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_ambientLightIntensity', scene.ambientLightIntensity)

    // Luz directa.
    if (scene.dirLight !== null) {
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_dirLight.dir', scene.dirLight.direction)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_dirLight.color', scene.dirLight.color)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_dirLight.intensity', scene.dirLight.intensity)
    }

    // Luces puntuales
    let numLights = 0
    for (let pointLight of scene.pointLights) {
      if (pointLight.enable === false) {
        continue
      }
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_pointLights[${numLights}].pos`, pointLight.position)
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_pointLights[${numLights}].color`, pointLight.color)
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_pointLights[${numLights}].intensity`, pointLight.intensity)
      numLights++
    }
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_numPointLights', numLights, true)

    // Luces Spot
    numLights = 0
    for (let spotLight of scene.spotLights) {
      if (spotLight.enable === false) {
        continue
      }
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_spotLights[${numLights}].pos`, spotLight.position)
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_spotLights[${numLights}].color`, spotLight.color)
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_spotLights[${numLights}].intensity`, spotLight.intensity)
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_spotLights[${numLights}].dir`, spotLight.direction)
      webGLUtil.setUniformLocation(this._gl, this.prg, `u_spotLights[${numLights}].angle`, spotLight.angle)
      numLights++
    }
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_numSpotLights', numLights, true)

    // Dibujar los objetos
    for (let object of scene.objects) {
      if (object.enableRender === false) {
        continue
      }
      ModelMatrix = object.getModelMatrix()
      InvertseTransposeModelMatrix = object.getInverseTransposeMatrix(ModelMatrix)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_MVMatrix', ModelMatrix)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_MVInverseTransposeMatrix', InvertseTransposeModelMatrix)

      // Dibujando cada malla del objeto.
      let meshes = [...object.meshes]
      if (object.showLocalAxis) {
        meshes = meshes.concat(object.localAxisRepresentation.meshes)
      }

      for (let mesh of meshes) {
        vertices = mesh.geometry.vertices
        normals = mesh.geometry.normals

        if (mesh.renderType === Mesh.RENDER_TYPE.LINES) {
          faces = mesh.geometry.wireframeFaces
        } else {
          faces = mesh.geometry.faces
        }

        if (mesh.geometry.type === Geometry.TYPE['2D']) {
          this.setVertexBuffer2D(vertices)
        } else {
          this.setVertexBuffer3D(vertices)
          this.setNormal3D(normals)
        }

        this.setIndexBuffer(faces)

        webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Color', mesh.material)
        webGLUtil.setUniformLocation(this._gl, this.prg, 'u_SpecularColor', mesh.specularColor)
        webGLUtil.setUniformLocation(this._gl, this.prg, 'u_UseNormal', mesh.useNormal)

        if (mesh.clearDepth) {
          this._gl.disable(this._gl.DEPTH_TEST)
        }

        if (mesh.renderType === Mesh.RENDER_TYPE.TRIANGLES) {
          this.drawElementsTriangle(faces)
        } else if (mesh.renderType === Mesh.RENDER_TYPE.LINE_LOOP) {
          this.drawElementsLineLoop(faces)
        } else {
          this.drawElementsLines(faces)
        }

        if (mesh.clearDepth) {
          this._gl.enable(this._gl.DEPTH_TEST)
        }
      }
    }
  }
}

module.exports = WebGLRender
