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

module.exports = {
  map,
  distance,
  getFovX,
  toRadian
}
