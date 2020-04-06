const map = function (value, min, max, newMin, newMax) {
  return newMin + (value - min) * (newMax - newMin) / (max - min)
}

module.exports = {
  map
}
