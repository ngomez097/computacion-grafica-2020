const regl = require('regl')()
const glMatrix = require('gl-matrix')
const dat = require('dat.gui')
const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')

// See http://regl.party/api#this

class Mesh {
  constructor (color, vertices, indices) {
    this.color = color
    this.position = regl.buffer(vertices)
    this.elements = regl.elements(indices)
    this.model = glMatrix.mat4.create()
    this.tx = 0
    this.ty = 0
    this.tz = 0
  }
}

Mesh.prototype.draw = regl({
  vert: vs,

  frag: fs,

  uniforms: {
    model: function () {
      glMatrix.mat4.identity(this.model)
      glMatrix.mat4.translate(
        this.model,
        this.model,
        [this.tx, this.ty, this.tz]
      )

      return this.model
    },
    color: regl.this('color'),
  },

  attributes: {
    position: regl.this('position')
  },

  elements: regl.this('elements')
})

const mesh = new Mesh(
  [1, 0, 1],
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

const clearOptions = {
  color: [0.2, 0.2, 0.2, 1],
  depth: 1,
}

regl.frame((context) => {
  regl.clear(clearOptions)
  mesh.draw()
})

const gui = new dat.GUI()
var f1 = gui.addFolder('Translate X')
f1.add(mesh, 'tx', -2, 2, 0.01)
var f2 = gui.addFolder('Translate Y + Z')
f2.add(mesh, 'ty', -2, 2, 0.01)
f2.add(mesh, 'tz', -2, 2, 0.01)

f1.open()
f2.open()
