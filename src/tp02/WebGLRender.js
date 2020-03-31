const webGLUtil = require('./WebGLUtil')
const Scene = require('./Scene')

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
  }

  initShader (pathShader, type) {
    const source = require('' + pathShader)
    let shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)
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

  drawElementsLineStrip (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.LINE_STRIP, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  clearBackground (color) {
    webGLUtil.resizeCanvas(this._gl)
    webGLUtil.paintBackground(this._gl, color)
  }

  /**
   * Metodo para dibjur en el canvas la escena.
   * @param scene Escena a dibujar.
   * @param {boolean} wireframe determina si se dibuja el wireframe, default = false.
   */
  render (scene = new Scene()) {
    // Dibujar ejes si los hay
    for (let axe of scene.axes) {
      let vertices = axe.geometry.getVertices2DToArray()
      let faces = axe.geometry.getFacesToArray()

      this.setVertexBuffer2D(vertices)
      this.setIndexBuffer(faces)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Transform', axe.t)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Scale', axe.s)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Color', axe.material)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Rotate', axe.r)

      this.drawElementsLineStrip(faces)
    }

    // Dibujar los meshes
    let meshes = scene.meshes
    for (let mesh of meshes) {
      let vertices = mesh.geometry.getVertices2DToArray()
      let faces = mesh.geometry.getFacesToArray()

      this.setVertexBuffer2D(vertices)
      this.setIndexBuffer(faces)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Transform', mesh.t)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Scale', mesh.s)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Color', mesh.material)
      webGLUtil.setUniformLocation(this._gl, this.prg, 'u_Rotate', mesh.r)

      if (!mesh.isWireframe) {
        this.drawElementsTriangle(faces)
      } else {
        this.drawElementsLineLoop(faces)
      }
    }
  }
}

module.exports = WebGLRender
