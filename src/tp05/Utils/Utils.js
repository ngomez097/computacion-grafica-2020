/**
 * Funcion para cambiar de rango un valor.
 */
const map = function (value, min, max, newMin, newMax) {
  return newMin + (value - min) * (newMax - newMin) / (max - min)
}

/**
 * Funcion para obtener la distancia enter 2 puntos
 * @param {*} v1 Vector de n coordenadas
 * @param {*} v2 Vector de n coordenadas
 */
const distance = function (v1, v2) {
  let aux = 0
  for (let i = 0; i < v1.length; i++) {
    aux += (v2[i] - v1[i]) ** 2.0
  }
  return aux ** 0.5
}

const getFovX = function (fovY, aspectRatio) {
  fovY = toRadian(fovY)
  return toDegres(2 * Math.atan(Math.tan(fovY / 2.0) * aspectRatio))
}

const toRadian = function (angle) {
  return angle * Math.PI / 180.0
}

const toDegres = function (angle) {
  return angle * 180.0 / Math.PI
}

const arraysEqual = function (array1, array2) {
  if (array1.length !== array2.length) {
    return false
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false
    }
  }
  return true
}

const copyArrayValues = function (array1, array2) {
  if (array1.length !== array2.length) {
    return
  }
  for (let i = 0; i < array1.length; i++) {
    array1[i] = array2[i]
  }
}

const clamp = function (value, min, max) {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

/**
 * @param {Array} array1
 * @param {Array} array2
 */
const pushArrays = function (array1, array2) {
  for (let i = 0; i < array2.length; i++) {
    array1.push(array2[i])
  }
}

module.exports = {
  map,
  distance,
  getFovX,
  toRadian,
  arraysEqual,
  copyArrayValues,
  clamp,
  pushArrays
}
