// See https://github.com/greggman/twgl.js/blob/master/examples/textures.html

const twgl = require('twgl.js')
const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')

const gl = twgl.getWebGLContext(document.getElementById('c'))
const programInfo = twgl.createProgramInfo(gl, [vs, fs])

const arrays = {
  aPosition: [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
    -0.5, 0.5, 0
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
  // A 2x2 pixel texture from a JavaScript array
  checker: {
    mag: gl.NEAREST,
    min: gl.LINEAR,
    src: [
      255, 255, 255, 255,
      192, 192, 192, 255,
      192, 192, 192, 255,
      255, 255, 255, 255
    ]
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
    uTexture: textures.firefox
    // uTexture: textures.checker
    // uTexture: textures.red
  }

  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
  twgl.setUniforms(programInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  window.requestAnimationFrame(render)
}
window.requestAnimationFrame(render)
