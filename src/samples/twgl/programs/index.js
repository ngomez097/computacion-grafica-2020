const twgl = require('twgl.js')
const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')
const fsTexture = require('./shaders/fs-texture.glsl')
const vsTexture = require('./shaders/vs-texture.glsl')
const glMatrix = require('gl-matrix')
const mat4 = glMatrix.mat4

const gl = twgl.getWebGLContext(document.getElementById('c'))
const colorProgramInfo = twgl.createProgramInfo(gl, [vs, fs])
const textureProgramInfo = twgl.createProgramInfo(gl, [vsTexture, fsTexture])

const modelMatrix = mat4.create()

const arrays = {
  aPosition: [
    -0.3, -0.3, 0,
    0.3, -0.3, 0,
    0.3, 0.3, 0,
    -0.3, 0.3, 0
  ],
  aTexCoord: [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
  ],
  indices: [
    0, 1, 3,
    1, 2, 3
  ]
}
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

const textures = twgl.createTextures(gl, {
  firefox: {
    src: require('../../textures/firefox-256x256.png')
  },
  // A 1x1 pixel texture from a JavaScript array
  red: {
    mag: gl.NEAREST,
    min: gl.LINEAR,
    src: [
      255, 0, 0, 255
    ]
  }
})

function render (time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas)

  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  const uniforms = {
    uColor: [1, 1, 0],
    uTexture: textures.firefox,
    uModelMatrix: modelMatrix
  }

  mat4.identity(modelMatrix)
  mat4.translate(modelMatrix, modelMatrix, [-0.5, 0.5, 0.0])

  gl.useProgram(textureProgramInfo.program)
  twgl.setBuffersAndAttributes(gl, textureProgramInfo, bufferInfo)
  twgl.setUniforms(textureProgramInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  uniforms.uTexture = textures.red

  mat4.identity(modelMatrix)
  mat4.translate(modelMatrix, modelMatrix, [0.5, 0.5, 0.0])

  gl.useProgram(textureProgramInfo.program)
  twgl.setBuffersAndAttributes(gl, textureProgramInfo, bufferInfo)
  twgl.setUniforms(textureProgramInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  mat4.identity(modelMatrix)
  mat4.translate(modelMatrix, modelMatrix, [-0.5, -0.5, 0.0])

  gl.useProgram(colorProgramInfo.program)
  twgl.setBuffersAndAttributes(gl, colorProgramInfo, bufferInfo)
  twgl.setUniforms(colorProgramInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  uniforms.uColor = [1, 0, 0]
  mat4.identity(modelMatrix)
  mat4.translate(modelMatrix, modelMatrix, [0.5, -0.5, 0.0])

  gl.useProgram(colorProgramInfo.program)
  twgl.setBuffersAndAttributes(gl, colorProgramInfo, bufferInfo)
  twgl.setUniforms(colorProgramInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  window.requestAnimationFrame(render)
}
window.requestAnimationFrame(render)
