class WebGLUtils {
  constructor (elementName) {
    /** Color fondo componente rojo. Default: 0.9 */
    this.bg_r = 0.15

    /** Color fondo componente verde. Default: 0.9 */
    this.bg_g = 0.15

    /** Color fondo componente azul. Default: 0.9 */
    this.bg_b = 0.15

    this.canvasName = elementName

    let canvas = document.getElementById(elementName)
    /** Default: Canvas size */
    this.c_width = canvas.width

    /** Default: Canvas size */
    this.c_height = canvas.height

    this.gl = null
  }

  getGLContext () {
    let canvas = document.getElementById(this.canvasName)
    if (canvas == null) {
      alert('there is no canvas on this page')
      return
    }
    let names = ['webgl',
      'experimental-webgl',
      'webkit-3d',
      'moz-webgl'
    ]

    for (let name of names) {
      this.gl = canvas.getContext(name)
      if (this.gl) {
        break
      }
    }
  }

  paintBackground () {
    this.gl.clearColor(this.bg_r,
      this.bg_g,
      this.bg_b, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)
  }

  initWebGL () {
    if (this.prg != null) {
      return
    }
    this.getGLContext(this.canvasName)

    var vxShader = this.getShader('./vertex-shader.glsl', this.gl.VERTEX_SHADER)
    var fgShader = this.getShader('./fragment-shader.glsl', this.gl.FRAGMENT_SHADER)
    this.prg = this.gl.createProgram()
    this.gl.attachShader(this.prg, vxShader)
    this.gl.attachShader(this.prg, fgShader)
    this.gl.linkProgram(this.prg)

    if (!this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS)) {
      alert('Could not initialise shaders')
    }

    this.gl.useProgram(this.prg)
  }

  getShader (pathShader, type) {
    const source = require('' + pathShader)
    let shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    return shader
  }

  /** Funcion para setear el valor a un uniform */
  setUniformLocation (attr, value) {
    const atribute = this.gl.getUniformLocation(this.prg, attr)
    if (typeof value === 'number') {
      this.gl.uniform1f(atribute, value)
    }
  }

  bindAttributeArrayFloat (attribute, vertexElements) {
    let aVertexPosition = this.gl.getAttribLocation(this.prg, attribute)
    this.gl.vertexAttribPointer(aVertexPosition
      , vertexElements // Numero de elementos para un vertice
      , this.gl.FLOAT // Tipo de los elementos
      , false, 0 // 0 para definir que estan ordenados secuencialmente
      , 0 // offset del arreglo
    )
    this.gl.enableVertexAttribArray(aVertexPosition)
  }

  /** Funcion que recibe un arraglo de vertices 2D float
   * y los establece en el buffer
   */
  setVertexBuffer2D (vertexArray) {
    this.vertex_buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer)

    this.gl.bufferData(this.gl.ARRAY_BUFFER,
      new Float32Array(vertexArray),
      this.gl.STATIC_DRAW)

    this.setUniformLocation('xFactor', 1.0)
    this.setUniformLocation('yFactor', 1.0)
    this.bindAttributeArrayFloat('aVertexPosition', 2)

    // Desvinculacion del buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
  }

  /** Funcion que recibe un arraglo de indices 2D int
   * y los establece en el buffer
   */
  setIndexBuffer (indexArray) {
    this.index_buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)

    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indexArray),
      this.gl.STATIC_DRAW)

    // Desvinculacion del buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
  }

  drawElementsTriangle (indexArray) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this.gl.drawElements(this.gl.TRIANGLES, indexArray.length, this.gl.UNSIGNED_SHORT, 0)
  }

  drawElementsLineLoop (indexArray) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this.gl.drawElements(this.gl.LINE_LOOP, indexArray.length, this.gl.UNSIGNED_SHORT, 0)
  }
}

module.exports = WebGLUtils
