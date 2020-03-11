const regl = require('regl')()

// See http://regl.party/api#inputs

const drawTriangle = regl({
  vert: `
  precision mediump float;

  attribute vec3 position;

  void main () {
    gl_Position = vec4(position, 1);
  }
  `,

  frag: `
  precision mediump float;

  uniform vec3 color;

  void main () {
    gl_FragColor = vec4(color, 1);
  }
  `,

  uniforms: {
    color: regl.prop('color'),
  },

  attributes: {
    position: [
      [-0.2, -0.2, 0],
      [0.2, -0.2, 0],
      [0.2, 0.2, 0],
    ],
  },

  elements: [
    [0, 1, 2],
  ]
})

const clearOptions = {
  color: [0.2, 0.2, 0.2, 1],
  depth: 1,
}

const triangleColor = [1, 1, 0]

regl.frame((context) => {
  regl.clear(clearOptions)
  drawTriangle({ color: triangleColor })
})
