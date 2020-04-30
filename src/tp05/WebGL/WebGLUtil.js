const paintBackground = function (gl, clearColor) {
  gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

const clearDepth = function (gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT)
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
const setUniformLocation = function (gl, attribute, value, isInt = false) {
  if (typeof value === 'number') {
    if (isInt) {
      gl.uniform1i(attribute, value)
    } else {
      gl.uniform1f(attribute, value)
    }
  } else if (typeof value === 'boolean') {
    gl.uniform1i(attribute, value)
  } else if (typeof value === 'object') {
    if (value.length === 3) {
      gl.uniform3fv(attribute, value)
    }
    if (value.length === 2) {
      gl.uniform2fv(attribute, value)
    }
    if (value.length === 16) {
      gl.uniformMatrix4fv(attribute, false, value)
    }
  }
}

/**
 * Funcion para establecer el atributo de un buffer.
 */
const bindAttributeArrayFloat = function (gl, attribute, vertexElements) {
  gl.vertexAttribPointer(attribute
    , vertexElements // Numero de elementos para un vertice
    , gl.FLOAT // Tipo de los elementos
    , false, 0 // 0 para definir que estan ordenados secuencialmente
    , 0 // offset del arreglo
  )
  gl.enableVertexAttribArray(attribute)
}

const bindNewFloatArrayBuffer = function (gl, array, attribute, vertexCompenents = 3) {
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(array),
    gl.STATIC_DRAW)

  bindAttributeArrayFloat(gl, attribute, vertexCompenents)

  return buffer
}

const bindFloatArrayBuffer = function (gl, buffer, attribute, vertexCompenents = 3) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  bindAttributeArrayFloat(gl, attribute, vertexCompenents)

  return buffer
}

const storeUniformsLocation = function (gl, prg, store, variables) {
  for (let variable of variables) {
    store[variable] = gl.getUniformLocation(prg, variable)
  }
}

/** Funcion que recibe un arraglo de indices 2D int
 * y los establece en el buffer
 */
const setNewIndexBuffer = function (gl, indexArray) {
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexArray),
    gl.STATIC_DRAW)

  return buffer
}

module.exports = {
  paintBackground,
  resizeCanvas,
  setUniformLocation,
  bindAttributeArrayFloat,
  clearDepth,
  bindNewFloatArrayBuffer,
  bindFloatArrayBuffer,
  setNewIndexBuffer,
  storeUniformsLocation
}
