const twgl = require('twgl.js')
const glMatrix = require('gl-matrix')
const dat = require('dat.gui')

const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')

const gl = twgl.getWebGLContext(document.getElementById('c'))
const programInfo = twgl.createProgramInfo(gl, [vs, fs])

const arrays = {
  aPosition: [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0
  ]
}
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

const mat4 = glMatrix.mat4
const modelMatrix = mat4.create()

const state = {
  tx: 0,
  ty: 0,
  tz: 0,
  color: [1, 0, 0]
}

const gui = new dat.GUI()
gui.add(state, 'tx', -5, 5, 0.1)
gui.add(state, 'ty', -5, 5, 0.1)
gui.add(state, 'tz', -5, 5, 0.1)

function render (time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas)

  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  glMatrix.mat4.identity(modelMatrix)
  glMatrix.mat4.translate(modelMatrix, modelMatrix, [state.tx, state.ty, state.tz])

  const uniforms = {
    uColor: [1, 1, 0],
    uModelMatrix: modelMatrix
  }

  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
  twgl.setUniforms(programInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
