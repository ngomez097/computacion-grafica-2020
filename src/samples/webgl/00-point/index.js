const vsSource = require('./vertex-shader.glsl')
const fsSource = require('./fragment-shader.glsl')

const canvas = document.getElementById('c')
const gl = canvas.getContext('webgl')

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vsSource)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fsSource)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

gl.linkProgram(program)
gl.useProgram(program)

// Specify the color for clearing <canvas>
gl.clearColor(0.2, 0.2, 0.2, 1.0)

// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT)

// Draw a point
gl.drawArrays(gl.POINTS, 0, 1)
