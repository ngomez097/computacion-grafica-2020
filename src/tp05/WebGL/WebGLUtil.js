const Vec3 = require('../Utils/Vec3')

/**
 * @param {RenderingContext} gl
 * @param {Vec3} clearColor
 */
const paintBackground = function (gl, clearColor) {
  if (!(clearColor instanceof Vec3)) {
    console.error('clearColor is not Vec3')
    return
  }
  gl.clearColor(clearColor.x, clearColor.y, clearColor.z, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

/**
 * @param {RenderingContext} gl
 */
const clearDepth = function (gl) {
  gl.clear(gl.DEPTH_BUFFER_BIT)
}

/**
 * @param {RenderingContext} gl
 */
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

/**
 * Funcion para setear el valor a un uniform
 * @param {RenderingContext} gl
 * @param {*} attribute
 * @param {*} value
 * @param {*} isInt
 */
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
    if (value instanceof Vec3) {
      gl.uniform3fv(attribute, value.toArray())
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
 * @param {RenderingContext} gl
 * @param {*} attribute
 * @param {Array} vertexElements
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

/**
 * @param {RenderingContext} gl
 * @param {Array} array
 * @param {*} attribute
 * @param {*} vertexCompenents
 */
const bindNewFloatArrayBuffer = function (gl, array, attribute, vertexCompenents = 3) {
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(array),
    gl.STATIC_DRAW)

  bindAttributeArrayFloat(gl, attribute, vertexCompenents)

  return buffer
}

/**
 * @param {RenderingContext} gl
 * @param {WebGLBuffer} buffer
 * @param {*} attribute
 * @param {Number} vertexCompenents
 */
const bindFloatArrayBuffer = function (gl, buffer, attribute, vertexCompenents = 3) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  bindAttributeArrayFloat(gl, attribute, vertexCompenents)
}

/**
 * @param {RenderingContext} gl
 * @param {Array} array
 * @param {*} attribute
 * @param {*} vertexCompenents
 */
const createTexture = function (gl, imageSrc) {
  let texture = gl.createTexture()
  const image = new Image()
  image.src = imageSrc
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    )
  }
  return texture
}

/**
 * @param {RenderingContext} gl
 * @param {WebGLTexture} texture
 * @param {*} attribute
 * @param {Number} vertexCompenents
 */
const bindTexture = function (gl, texture, activeTexture = gl.TEXTURE0) {
  gl.activeTexture(activeTexture)
  gl.bindTexture(gl.TEXTURE_2D, texture)
}

/**
 * @param {RenderingContext} gl
 * @param {WebGLProgram} prg
 * @param {Array} store
 * @param {Array<String>} variables
 */
const storeUniformsLocation = function (gl, prg, store, variables) {
  for (let variable of variables) {
    store[variable] = gl.getUniformLocation(prg, variable)
  }
}

/**
 * Funcion que recibe un arraglo de indices 2D int
 * y los establece en el buffer
 * @param {RenderingContext} gl
 * @param {Array<Number>} indexArray
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
  storeUniformsLocation,
  createTexture,
  bindTexture
}
