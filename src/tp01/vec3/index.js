const normalize = (a) => {
  let normal = 1 / ((a[0] ** 2 + a[1] ** 2 + a[2] ** 2) ** 0.5)
  let outVec3 = [a[0] * normal, a[1] * normal, a[2] * normal]
  return outVec3
}

const cross = (a, b) => {
  let outVec3 = [a[1] * b[2] - a[2] * b[1],
    -a[0] * b[2] + a[2] * b[0],
    a[0] * b[1] - a[1] * b[0]]

  return outVec3
}

const normals = (a, b, c) => {
  let vec1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  let vec2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let res = cross(vec1, vec2)
  res = normalize(res)
  return res
}

module.exports = {
  normalize,
  cross,
  normals
}
