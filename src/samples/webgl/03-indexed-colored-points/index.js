const { resizeCanvas } = require('../utils')
const vsSource = require('./vertex-shader.glsl')
const fsSource = require('./fragment-shader.glsl')

const canvas = document.getElementById('c')
const gl = canvas.getContext('webgl')

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fsSource)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

gl.linkProgram(program)
gl.useProgram(program)

resizeCanvas(gl.canvas)

// Specify the color for clearing <canvas>
gl.clearColor(0.2, 0.2, 0.2, 1.0)

// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT)

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

const vboData = new Float32Array([
  0.5, 0.0, 0.0, // First vertex
  0.0, 0.5, 0.0, // Second vertex
  -0.5, 0.0, 0.0 // Third vertex
])

// Create Vertex Buffer Object
const vbo = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

// Populate Buffer Object
gl.bufferData(gl.ARRAY_BUFFER, vboData, gl.STATIC_DRAW)

// Bind Buffer to a shader attribute
const aPosition = gl.getAttribLocation(program, 'aPosition')
gl.vertexAttribPointer(
  aPosition, 3, gl.FLOAT, false,
  vboData.BYTES_PER_ELEMENT * 0, vboData.BYTES_PER_ELEMENT * 0
)
gl.enableVertexAttribArray(aPosition)

// Clean up
gl.bindBuffer(gl.ARRAY_BUFFER, null)

const cboData = new Float32Array([
  1.0, 0.0, 0.0, // red
  0.0, 1.0, 0.0, // green
  0.0, 0.0, 1.0 // blue
])

// Create Color Buffer Object
const cbo = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cbo)
gl.bufferData(gl.ARRAY_BUFFER, cboData, gl.STATIC_DRAW)

// Bind Buffer to a shader attribute
const aColor = gl.getAttribLocation(program, 'aColor')
gl.vertexAttribPointer(
  aColor, 3, gl.FLOAT, false,
  vboData.BYTES_PER_ELEMENT * 0, vboData.BYTES_PER_ELEMENT * 0
)
gl.enableVertexAttribArray(aColor)

// Clean up
gl.bindBuffer(gl.ARRAY_BUFFER, null)

const iboData = new Uint16Array([
  0, // Index #1 of the vertex in the vertex buffer object
  1, // Index #2 of the vertex in the vertex buffer object
  2 // Index #3 of the vertex in the vertex buffer object
])

// Create Index Buffer Object
const ibo = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iboData, gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Draw 3 points
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
gl.drawElements(gl.POINTS, iboData.length, gl.UNSIGNED_SHORT, 0)
// Or draw a triangle
// gl.drawElements(gl.TRIANGLES, iboData.length, gl.UNSIGNED_SHORT, 0)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Free buffered memory
gl.deleteBuffer(vbo)
gl.deleteBuffer(cbo)
gl.deleteBuffer(ibo)
