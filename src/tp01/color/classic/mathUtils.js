const clamp = function (value, min, max) {
  if (value < min) {
    return min
  } else if (value > max) {
    return max
  }
  return value
}

const hslF = function (n, hsl) {
  let k = (n + hsl[0] / 30) % 12
  let a = hsl[1] * Math.min(hsl[2], 1 - hsl[2])
  let res = hsl[2] - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  return res
}

module.exports = { clamp, hslF }
