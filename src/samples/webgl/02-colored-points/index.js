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

// Draw 3 points
gl.drawArrays(gl.POINTS, 0, 3)
// Or draw a triangle
// gl.drawArrays(gl.TRIANGLES, 0, 3)

// Free buffered memory
gl.deleteBuffer(vbo)
gl.deleteBuffer(cbo)
