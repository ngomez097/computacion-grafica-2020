const webGLUtil = require('./WebGLUtil')
const PerspectiveCamera = require('../Camera/PerspectiveCamera')
const Geometry = require('../Objects/Geometry')
const Mesh = require('../Objects/Mesh')

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
      console.error('Could not initialise shaders')
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
    let vertices
    let faces
    let normals
    // Se establece la matriz de proyeccion
    let PMatrix = camera.getProjectionMatrix()
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_PMatrix', PMatrix)

    // Se establece las propiedades de la camara
    let VMatrix = camera.getViewMatrix()
    webGLUtil.setUniformLocation(this._gl, this.prg, 'u_VMatrix', VMatrix)
    webGLUtil.setUniformLocation(this._gl, this.prg, 'f_VMatrix', VMatrix)

    // Dibujar los objetos
    for (let object of scene.objects) {
      ModelMatrix = object.getModelMatrix()
      for (let mesh of object.meshes) {
        vertices = mesh.geometry.vertices
        faces = mesh.geometry.faces
        normals = mesh.geometry.normals

        if (mesh.geometry.type === Geometry.TYPE['2D']) {
          this.setVertexBuffer2D(vertices)
        } else {
          this.setVertexBuffer3D(vertices)
          this.setNormal3D(normals)
        }

        this.setIndexBuffer(faces)

        webGLUtil.setUniformLocation(this._gl, this.prg, 'u_MVMatrix', ModelMatrix)
        webGLUtil.setUniformLocation(this._gl, this.prg, 'f_MVMatrix', ModelMatrix)
        webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Color', mesh.material)
        webGLUtil.setUniformLocation(this._gl, this.prg, 'f_UseNormal', mesh.useNormal)

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
