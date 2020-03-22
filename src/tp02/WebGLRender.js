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
    var vxShader = this.getShader('./vertex-shader.glsl', this._gl.VERTEX_SHADER)
    var fgShader = this.getShader('./fragment-shader.glsl', this._gl.FRAGMENT_SHADER)
    this.prg = this._gl.createProgram()
    this._gl.attachShader(this.prg, vxShader)
    this._gl.attachShader(this.prg, fgShader)
    this._gl.linkProgram(this.prg)

    if (!this._gl.getProgramParameter(this.prg, this._gl.LINK_STATUS)) {
      alert('Could not initialise shaders')
    }

    this._gl.useProgram(this.prg)
  }

  getShader (pathShader, type) {
    const source = require('' + pathShader)
    let shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)

    return shader
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

    webGLUtil.setUniformLocation('xFactor', 1.0)
    webGLUtil.setUniformLocation('yFactor', 1.0)
    webGLUtil.bindAttributeArrayFloat('aVertexPosition', 2)
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

  render (scene = new Scene()) {
    webGLUtil.paintBackground(this._gl, scene.clearColor)
    let meshes = scene.meshes
    for (let mesh of meshes) {
      let vertices = mesh.geometry.getVertices2DToArray()
      let faces = mesh.geometry.getFacesToArray()

      this.setVertexBuffer2D(vertices)
      this.setIndexBuffer(faces)
      this.drawElementsTriangle(faces)
    }
  }
}

module.exports = WebGLRender
