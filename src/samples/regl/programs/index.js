const regl = require('regl')()
const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')
const fsTexture = require('./shaders/fs-texture.glsl')
const vsTexture = require('./shaders/vs-texture.glsl')

// See http://regl.party/api#this

class Mesh {
  constructor (center, color, vertices, indices) {
    this.color = color
    this.position = regl.buffer(vertices)
    this.elements = regl.elements(indices)
    this.model = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      center[0], center[1], center[2], 1
    ]
  }
}

Mesh.prototype.draw = regl({
  vert: vs,

  frag: fs,

  uniforms: {
    model: regl.this('model'),
    color: regl.this('color'),
  },

  attributes: {
    position: regl.this('position')
  },

  elements: regl.this('elements')
})

class MeshWithTexture {
  constructor (center, textureSrc, vertices, texCoords, indices) {
    this.center = center
    this.texture = regl.texture()
    const image = new Image()
    image.src = textureSrc
    image.onload = () => {
      // Note: images are loaded asynchronous
      this.texture({
        data: image,
        flipY: true,
      })
    }
    this.position = regl.buffer(vertices)
    this.texCoords = texCoords
    this.elements = regl.elements(indices)
    this.model = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      center[0], center[1], center[2], 1
    ]

    this.draw = regl({
      vert: vsTexture,

      frag: fsTexture,

      uniforms: {
        model: regl.this('model'),
        texture: regl.this('texture'),
      },

      attributes: {
        position: regl.this('position'),
        texCoords: regl.this('texCoords'),
      },

      elements: regl.this('elements')
    })
  }
}

const mesh1 = new Mesh(
  [-0.5, 0.5, 0],
  [1, 1, 0],
  [
    [-0.2, -0.2, 0],
    [0.2, -0.2, 0],
    [0.2, 0.2, 0],
    [-0.2, 0.2, 0],
  ],
  [
    [0, 1, 2],
    [0, 2, 3],
  ]
)

const mesh2 = new Mesh(
  [-0.5, -0.5, 0],
  [0, 1, 1],
  [
    [-0.2, -0.2, 0],
    [0.2, -0.2, 0],
    [0.2, 0.2, 0],
    [-0.2, 0.2, 0],
  ],
  [
    [0, 1, 2],
    [0, 2, 3],
  ]
)

const mesh3 = new MeshWithTexture(
  [0.5, 0.5, 0],
  require('./../../textures/firefox-256x256.png'),
  [
    [-0.2, -0.2, 0],
    [0.2, -0.2, 0],
    [0.2, 0.2, 0],
    [-0.2, 0.2, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ],
  [
    [0, 1, 2],
    [0, 2, 3],
  ]
)

const mesh4 = new MeshWithTexture(
  [0.5, -0.5, 0],
  require('./../../textures/earthmap-1024x512.jpg'),
  [
    [-0.2, -0.2, 0],
    [0.2, -0.2, 0],
    [0.2, 0.2, 0],
    [-0.2, 0.2, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ],
  [
    [0, 1, 2],
    [0, 2, 3],
  ]
)

const meshes = [mesh1, mesh2, mesh3, mesh4]
const clearOptions = {
  color: [0.2, 0.2, 0.2, 1],
  depth: 1,
}

regl.frame((context) => {
  regl.clear(clearOptions)

  meshes.forEach((mesh) => mesh.draw())
})
