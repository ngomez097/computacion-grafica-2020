// See http://regl.party/api#props

const regl = require('regl')()
const { mat4 } = require('gl-matrix')
const vert = require('./vs.glsl')
const frag = require('./fs.glsl')

class Mesh {
  // First we create a constructor
  constructor (center, { positions, cells }) {
    this.center = center
    this.positions = positions
    this.cells = cells

    // Then we assign regl commands directly to the prototype of the class
    this.draw = regl({
      vert: vert,

      frag: frag,

      uniforms: {
        // dynamic properties are invoked with the same `this` as the command
        model: () => {
          var c = this.center
          return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            c[0], c[1], c[2], 1
          ]
        },

        view: regl.prop('view'),
        projection: regl.prop('projection')
      },

      attributes: {
        // here we are using 'positions' property of the mesh
        position: regl.this('positions')
      },

      // and same for the cells
      elements: regl.this('cells'),

      // primitive: 'triangles', // by default
      // primitive: 'lines',
      // primitive: 'points'
    })
  }
}

regl.clear({
  color: [0, 0, 0, 1],
  depth: 1
})

const gl = regl._gl

const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight
const view = mat4.create()
mat4.lookAt(view, [20, 20, 20], [0, 0, 0], [0, 1, 0])
const projection = mat4.create()
mat4.perspective(projection, Math.PI / 4, aspect, 0.001, 1000)

const teapotMesh = new Mesh([-10, 0, 5], require('teapot'))
const bunnyMesh = new Mesh([10, 0, -5], require('bunny'))

bunnyMesh.draw({
  view,
  projection
})

teapotMesh.draw({
  view,
  projection
})
