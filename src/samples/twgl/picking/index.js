const twgl = require('twgl.js')
const glMatrix = require('gl-matrix')
const mat4 = glMatrix.mat4

const gl = twgl.getWebGLContext(document.getElementById('c'))
const programInfo = twgl.createProgramInfo(gl, [
  require('./shaders/vs.glsl'),
  require('./shaders/fs.glsl')
])
const pickingProgramInfo = twgl.createProgramInfo(gl, [
  require('./shaders/picking-vs.glsl'),
  require('./shaders/picking-fs.glsl')
])

const framebufferInfo = createFramebufferInfo(gl)

let pickingCoord = null
gl.canvas.addEventListener('click', function (evt) {
  pickingCoord = {
    x: evt.offsetX,
    y: gl.canvas.height - evt.offsetY
  }
  console.log(pickingCoord)
})
const readout = new Uint8Array(1 * 1 * 4)

let meshCount = 1
const meshes = [
  createTriangleMesh(gl, [0, 0, 0.1], [255, 255, 0]),
  createTriangleMesh(gl, [0, 0.5, -0.1], [0, 255, 255])
]

const projectionMatrix = mat4.create()
mat4.perspective(projectionMatrix, Math.PI / 4, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.001, 100)
const viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 2, 2], [0, 0, 0], [0, 1, 0])

const sharedUniforms = {
  uProjectionMatrix: projectionMatrix,
  uViewMatrix: viewMatrix
}
const localUniforms = {}

function render (time) {
  renderWith(programInfo)
  // Uncomment to see the framebuffer texture
  // renderWith(pickingProgramInfo)

  if (pickingCoord) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferInfo.framebuffer)
    renderWith(pickingProgramInfo)

    // read one pixel
    gl.readPixels(pickingCoord.x, pickingCoord.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, readout)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    console.log('picked color', readout)
    printPickedMesh(readout)
    pickingCoord = null
  }

  window.requestAnimationFrame(render)
}
window.requestAnimationFrame(render)

function renderWith (programInfo) {
  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  twgl.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  gl.useProgram(programInfo.program)

  meshes.forEach((mesh) => {
    localUniforms.uColor = mesh.color
    localUniforms.uPickingColor = mesh.pickingColor
    localUniforms.uModelMatrix = mesh.modelMatrix
    twgl.setUniforms(programInfo, sharedUniforms, localUniforms)
    twgl.setBuffersAndAttributes(gl, programInfo, mesh.bufferInfo)
    twgl.drawBufferInfo(gl, mesh.bufferInfo, gl.TRIANGLES)
  })
}

function createFramebufferInfo (gl) {
  const attachments = [
    {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      min: gl.LINEAR,
      mag: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE
    },
    {
      format: gl.DEPTH_COMPONENT16
    }
  ]

  twgl.resizeCanvasToDisplaySize(gl.canvas)
  const framebufferInfo = twgl.createFramebufferInfo(gl, attachments, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  return framebufferInfo
}

function createTriangleMesh (gl, position, color) {
  const arrays = {
    aPosition: [
      -0.5, -0.5, 0,
      0.5, -0.5, 0,
      -0.5, 0.5, 0
    ],
    aTexcoord: [
      0, 0,
      1, 0,
      0, 1
    ]
  }

  // Use a texture so there is not a uniform color
  const coloredChecker = twgl.createTexture(gl, {
    mag: gl.NEAREST,
    min: gl.LINEAR,
    src: [
      color[0] * 0.8, color[1] * 0.8, color[2] * 0.8, 255,
      color[0], color[1], color[2], 255,
      color[0], color[1], color[2], 255,
      color[0] * 0.8, color[1] * 0.8, color[2] * 0.8, 255
    ]
  })

  const modelMatrix = mat4.create()
  mat4.identity(modelMatrix)
  mat4.translate(modelMatrix, modelMatrix, position)

  const id = meshCount++

  return {
    id: id,
    // use the red channel to identify mesh by picked color
    pickingColor: [id / 255, 0, 0],
    bufferInfo: twgl.createBufferInfoFromArrays(gl, arrays),
    modelMatrix: modelMatrix,
    color: coloredChecker
  }
}

function printPickedMesh (readout) {
  meshes.forEach((mesh) => {
    if (mesh.id === readout[0]) {
      console.log(`Selected mesh with id ${mesh.id}`)
      console.log('Set a flag or something to signal that this mesh was picked', mesh)
    }
  })
}
