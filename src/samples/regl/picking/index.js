const regl = require('regl')()
const { mat4 } = require('gl-matrix')

const vert = `
precision mediump float;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

attribute vec3 position;
attribute vec2 texCoord;

varying vec2 vTexCoord;

void main () {
  gl_Position = projection * view * model * vec4(position, 1);
  vTexCoord = texCoord;
}
`

const frag = `
precision mediump float;

uniform vec3 color;
uniform sampler2D texture;

varying vec2 vTexCoord;

void main () {
  gl_FragColor = texture2D(texture, vTexCoord);
}
`

const vert4picking = `
precision mediump float;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

attribute vec3 position;

void main () {
  gl_Position = projection * view * model * vec4(position, 1);
}
`

const frag4picking = `
precision mediump float;

uniform vec3 color;

void main () {
  gl_FragColor = vec4(color, 1);
}
`

const drawTriangle = regl({
  uniforms: {
    color: regl.prop('color4picking'),
    texture: regl.prop('texture'),
    model: (context, props) => {
      const [tx, ty, tz] = props.center
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
      ]
    },
  },

  attributes: {
    position: [
      [-1, -1, 0],
      [1, -1, 0],
      [1, 1, 0],
    ],
    texCoord: [
      [0, 0],
      [1, 0],
      [1, 1],
    ]
  },

  elements: [
    [0, 1, 2],
  ]
})

const projection = mat4.create()
const view = mat4.create()

const setupCamera = regl({
  context: {
    projection: (context) =>
      mat4.perspective(
        projection,
        Math.PI / 4,
        context.viewportWidth / context.viewportHeight,
        0.001,
        1000
      ),
    view: (context, props) =>
      mat4.lookAt(
        view,
        props.eye,
        [0, 0, 0],
        [0, 1, 0]
      )
  },

  uniforms: {
    projection: regl.context('projection'),
    view: regl.context('view')
  }
})

const createTexture = (r, g, b) =>
  regl.texture([
    [ [r, g, b], [r * 0.8, g * 0.8, b * 0.8] ],
    [ [r * 0.8, g * 0.8, b * 0.8], [r, g, b] ]
  ])

const texture1 = createTexture(255, 255, 0)
const texture2 = createTexture(0, 255, 255)

const clearOptions = {
  color: [0.2, 0.2, 0.2, 1],
  depth: 1,
}

const eye = [0, 5, 5]

let pickingCoord = null
regl._gl.canvas.addEventListener('click', function (evt) {
  pickingCoord = {
    x: evt.offsetX,
    y: evt.offsetY
  }
})

const fbo = regl.framebuffer({
  width: regl._gl.drawingBufferWidth,
  height: regl._gl.drawingBufferHeight,
  colorFormat: 'rgba',
  colorType: 'uint8'
})

const drawNormal = regl({
  vert,
  frag,
})

const draw4picking = regl({
  vert: vert4picking,
  frag: frag4picking,
  framebuffer: fbo
})

const draw4pickingDebug = regl({ // eslint-disable-line no-unused-vars
  vert: vert4picking,
  frag: frag4picking,
})

const drawTriangles = () => {
  regl.clear(clearOptions)

  drawTriangle({
    texture: texture1,
    color4picking: [1, 0, 0],
    center: [0, 0, -0.5],
  })
  drawTriangle({
    texture: texture2,
    color4picking: [0, 1, 0],
    center: [0, 0, 0.5]
  })
}

regl.frame((context) => {
  setupCamera(
    {
      eye
    },
    () => {
      drawNormal(() => {
        drawTriangles()
      })
      // draw4pickingDebug(() => {
      //   drawTriangles()
      // })

      if (pickingCoord) {
        draw4picking((context) => {
          drawTriangles()

          console.log(pickingCoord)
          const { x, y } = pickingCoord
          pickingCoord = null

          const pixels = regl.read({
            x: x * context.pixelRatio,
            y: context.drawingBufferHeight - y * context.pixelRatio,
            width: 1,
            height: 1,
            data: new Uint8Array(1 * 1 * 4)
          })

          console.log(pixels)
        })
      }
    }
  )
})
