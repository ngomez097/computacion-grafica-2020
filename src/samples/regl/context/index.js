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

      // Notice that view and projection are passed by the parent commant "setupCamera"
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

const view = mat4.create()
const projection = mat4.create()

const teapotMesh = new Mesh([-10, 0, 5], require('teapot'))
const bunnyMesh = new Mesh([10, 0, -5], require('bunny'))

// See
// http://regl.party/api#scoped-commands
// http://regl.party/api#context
const setupCamera = regl({
  context: {
    projection: (context) => {
      mat4.perspective(
        projection,
        Math.PI / 4,
        context.viewportWidth / context.viewportHeight,
        0.001,
        1000
      )

      return projection
    },
    view: (context, props) => {
      mat4.lookAt(
        view,
        props.eye,
        [0, 0, 0],
        [0, 1, 0]
      )

      return view
    }
  },

  uniforms: {
    projection: regl.context('projection'),
    view: regl.context('view')
  }
})

regl.clear({
  color: [0, 0, 0, 1],
  depth: 1
})

setupCamera(
  {
    eye: [20, 20, 20]
  },
  () => {
    teapotMesh.draw()
    bunnyMesh.draw()
  }
)
