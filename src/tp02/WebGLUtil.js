const paintBackground = function (gl, clearColor) {
  gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const resizeCanvas = function (gl) {
  let canvas = gl.canvas
  let displayWidth = Math.floor(canvas.clientWidth)
  let displayHeight = Math.floor(canvas.clientHeight)

  if (gl.canvas.width !== displayWidth ||
      gl.canvas.height !== displayHeight) {
    gl.canvas.width = displayWidth
    gl.canvas.height = displayHeight
  }
  gl.viewport(0, 0, canvas.width, canvas.height)
}

/** Funcion para setear el valor a un uniform */
const setUniformLocation = function (gl, prg, attr, value) {
  const atribute = gl.getUniformLocation(prg, attr)
  if (typeof value === 'number') {
    gl.uniform1f(atribute, value)
  }
}

const bindAttributeArrayFloat = function (gl, prg, attribute, vertexElements) {
  let aAttribute = gl.getAttribLocation(prg, attribute)
  gl.vertexAttribPointer(aAttribute
    , vertexElements // Numero de elementos para un vertice
    , gl.FLOAT // Tipo de los elementos
    , false, 0 // 0 para definir que estan ordenados secuencialmente
    , 0 // offset del arreglo
  )
  gl.enableVertexAttribArray(aAttribute)
}

module.exports = {
  paintBackground,
  resizeCanvas,
  setUniformLocation,
  bindAttributeArrayFloat
}
