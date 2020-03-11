const transpose = function (A) {
  let res = []

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      res[x + y * 4] = A[y + x * 4]
    }
  }
  return res
}

const multiply = function (A, B) {
  let res = []
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      res[y + x * 4] = 0
      for (let i = 0; i < 4; i++) {
        res[y + x * 4] += A[y + i * 4] * B[i + x * 4]
      }
    }
  }
  return res
}

module.exports = {
  transpose,
  multiply
}
