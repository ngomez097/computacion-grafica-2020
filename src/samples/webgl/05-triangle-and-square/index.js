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

// Cache attribute/uniform location
const aPosition = gl.getAttribLocation(program, 'aPosition')
gl.enableVertexAttribArray(aPosition)
const uColor = gl.getUniformLocation(program, 'uColor')

// Yellow Triangle
const triangleVBOData = new Float32Array([
  -0.25, 0.0, 0.0, // First vertex
  -0.50, 0.5, 0.0, // Second vertex
  -0.75, 0.0, 0.0 // Third vertex
])

// Create Vertex Buffer Object
const triangleVBO = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO)

// Populate Buffer Object
gl.bufferData(gl.ARRAY_BUFFER, triangleVBOData, gl.STATIC_DRAW)

// Bind Buffer to a shader attribute
gl.vertexAttribPointer(
  aPosition, 3, gl.FLOAT, false,
  triangleVBOData.BYTES_PER_ELEMENT * 0, triangleVBOData.BYTES_PER_ELEMENT * 0
)

// Clean up
gl.bindBuffer(gl.ARRAY_BUFFER, null)

const triangleColor = new Float32Array([
  1.0, // red channel
  1.0, // green channel
  0.0, // blue channel
  1.0 // alpha channel
])

gl.uniform4fv(uColor, triangleColor)

const triangleIBOData = new Uint16Array([
  0, // Index #1 of the vertex in the vertex buffer object
  1, // Index #2 of the vertex in the vertex buffer object
  2 // Index #3 of the vertex in the vertex buffer object
])

// Create Index Buffer Object
const triangleIBO = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIBO)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIBOData, gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Draw Triangle
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIBO)
gl.drawElements(gl.TRIANGLES, triangleIBOData.length, gl.UNSIGNED_SHORT, 0)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Free buffered memory
gl.deleteBuffer(triangleVBO)
gl.deleteBuffer(triangleIBO)

// Purple Square with 2 triangles
const squareVBOData = new Float32Array([
  0.25, 0.0, 0.0, // First vertex
  0.75, 0.0, 0.0, // Second vertex
  0.75, 0.5, 0.0, // Third vertex
  0.25, 0.5, 0.0 // Fourth vertex
])

// Create Vertex Buffer Object
const squareVBO = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, squareVBO)

// Populate Buffer Object
gl.bufferData(gl.ARRAY_BUFFER, squareVBOData, gl.STATIC_DRAW)

// Bind Buffer to a shader attribute
gl.vertexAttribPointer(
  aPosition, 3, gl.FLOAT, false,
  squareVBOData.BYTES_PER_ELEMENT * 0, squareVBOData.BYTES_PER_ELEMENT * 0
)

// Clean up
gl.bindBuffer(gl.ARRAY_BUFFER, null)

const squareColor = new Float32Array([
  1.0, // red channel
  0.0, // green channel
  1.0, // blue channel
  1.0 // alpha channel
])

gl.uniform4fv(uColor, squareColor)

const squareIBOData = new Uint16Array([
  // First triangle
  0, // Index #1 of the vertex in the vertex buffer object
  1, // Index #2 of the vertex in the vertex buffer object
  2, // Index #3 of the vertex in the vertex buffer object
  // Seconde triangle
  0, // Index #1 of the vertex in the vertex buffer object
  2, // Index #3 of the vertex in the vertex buffer object
  3 // Index #4 of the vertex in the vertex buffer object
])

// Create Index Buffer Object
const squareIBO = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIBO)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, squareIBOData, gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Draw Square
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIBO)
gl.drawElements(gl.TRIANGLES, squareIBOData.length, gl.UNSIGNED_SHORT, 0)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Free buffered memory
gl.deleteBuffer(squareVBO)
gl.deleteBuffer(squareIBO)
