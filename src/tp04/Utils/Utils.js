/**
 * Funcion para cambiar de rango un valor.
 */
const map = function (value, min, max, newMin, newMax) {
  return newMin + (value - min) * (newMax - newMin) / (max - min)
}

/**
 * Funcion para obtener la distancia enter 2 puntos
 * @param {*} v1 Vector de 3 coordenadas
 * @param {*} v2 Vector de 3 coordenadas
 */
const distance = function (v1, v2) {
  if (v1.length !== 3 || v2.length !== 3) {
    return -1
  }
  return ((v2[0] - v1[0]) ** 2 + (v2[1] - v1[1]) ** 2 + (v2[2] - v1[2]) ** 2) ** 0.5
}

module.exports = {
  map,
  distance
}
