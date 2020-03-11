const regl = require('regl')()
const vs = require('./shaders/vs.glsl')
const fs = require('./shaders/fs.glsl')

const drawTexture = regl({
  frag: fs,

  vert: vs,

  attributes: {
    position: [
      [-0.5, -0.5, 0],
      [0.5, -0.5, 0],
      [0.5, 0.5, 0],
      [-0.5, 0.5, 0],
    ],
    texCoord: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]
  },

  uniforms: {
    texture: regl.prop('texture')
  },

  elements: [
    [0, 1, 2],
    [0, 2, 3]
  ]
})

// From a square array
const nestedArrayTexture = regl.texture([ // eslint-disable-line no-unused-vars
  [ [0, 255, 0], [255, 0, 0] ],
  [ [0, 0, 255], [255, 255, 255] ]
])

// From an Image element
const image = new Image()
image.src = require('./../../textures/firefox-256x256.png')
image.onload = () => {
  // Note: images are loaded asynchronous
  imageTexture({
    data: image,
    flipY: true,
  })
}

const imageTexture = regl.texture()
const clearOpts = {
  color: [0.2, 0.2, 0.2, 1],
  depth: 1,
}

regl.frame((context) => {
  regl.clear(clearOpts)

  drawTexture({ texture: imageTexture })
  // drawTexture({texture: nestedArrayTexture})
})
