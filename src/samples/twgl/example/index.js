const twgl = require('twgl.js')
const Stats = require('stats.js')
const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const gl = twgl.getWebGLContext(document.getElementById('c'))
const programInfo = twgl.createProgramInfo(gl, [vs, fs])

const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
}
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

function render (time) {
  stats.begin()

  twgl.resizeCanvasToDisplaySize(gl.canvas)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  const uniforms = {
    time: time * 0.001,
    resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight],
  }

  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
  twgl.setUniforms(programInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  stats.end()

  window.requestAnimationFrame(render)
}
window.requestAnimationFrame(render)
