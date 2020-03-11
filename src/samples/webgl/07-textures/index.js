const { resizeCanvas } = require('../utils')
const vsSource = require('./vertex-shader.glsl')
const fsSource = require('./fragment-shader.glsl')
const glMatrix = require('gl-matrix')

const canvas = document.getElementById('c')
const gl = canvas.getContext('webgl')
const mat4 = glMatrix.mat4

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

// Specify the color for clearing <canvas>
gl.clearColor(0.2, 0.2, 0.2, 1.0)

// Cache attribute/uniform location
const aPosition = gl.getAttribLocation(program, 'aPosition')
const aTexCoord = gl.getAttribLocation(program, 'aTexCoord')
const uColor = gl.getUniformLocation(program, 'uColor')
const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix')
const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix')
const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix')
const uUseLighting = gl.getUniformLocation(program, 'uUseLighting')
const uUseTexture = gl.getUniformLocation(program, 'uUseTexture')
const uSampler = gl.getUniformLocation(program, 'uSampler')

gl.uniform1i(uUseLighting, false)
gl.uniform1i(uUseTexture, true)

// Purple Square with 2 triangles
const squareVBOData = new Float32Array([
  -0.25, 0.0, 0.0, // First vertex
  0.25, 0.0, 0.0, // Second vertex
  0.25, 0.5, 0.0, // Third vertex
  -0.25, 0.5, 0.0 // Fourth vertex
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
gl.enableVertexAttribArray(aPosition)

// Map Texture coordinates
const stTBOData = new Float32Array([
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0
])
const stTBO = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, stTBO)
gl.bufferData(gl.ARRAY_BUFFER, stTBOData, gl.STATIC_DRAW)

gl.vertexAttribPointer(
  aTexCoord, 2, gl.FLOAT, false,
  stTBOData.BYTES_PER_ELEMENT * 0, stTBOData.BYTES_PER_ELEMENT * 0
)
gl.enableVertexAttribArray(aTexCoord)

// Clean up
gl.bindBuffer(gl.ARRAY_BUFFER, null)

const squareColor = new Float32Array([
  0.7, // red channel
  0.7, // green channel
  0.7, // blue channel
  0.7 // alpha channel
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

// Creates a new identity matrix
const squareModelMatrix = mat4.create()
// See http://glmatrix.net/docs/mat4.html
glMatrix.mat4.translate(
  squareModelMatrix,
  squareModelMatrix,
  [0.5, 0.0, 0.0]
)
gl.uniformMatrix4fv(uProjectionMatrix, false, mat4.create())
gl.uniformMatrix4fv(uViewMatrix, false, mat4.create())
gl.uniformMatrix4fv(uModelMatrix, false, squareModelMatrix)

// Configure texture
const textureBO = gl.createTexture()
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, textureBO)

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

// Fill the texture with a 1x1 blue pixel.
gl.texImage2D(
  gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  new Uint8Array([255, 255, 255, 255])
)
gl.uniform1i(uSampler, 0)

loadTexture(gl, require('../../textures/firefox-256x256.png'), textureBO, function () {
  bindTextureToSampler(gl, textureBO)
  draw()
})

function loadTexture (gl, imageSrc, textureBO, callback) {
  const image = new Image()
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textureBO)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.bindTexture(gl.TEXTURE_2D, null)
    callback()
  }
  image.src = imageSrc
}

function bindTextureToSampler (gl, textureBO) {
  gl.bindTexture(gl.TEXTURE_2D, textureBO)
  gl.uniform1i(uSampler, 0)
}

function draw () {
  // Draw Square
  resizeCanvas(gl.canvas)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIBO)
  gl.drawElements(gl.TRIANGLES, squareIBOData.length, gl.UNSIGNED_SHORT, 0)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
}

draw()
