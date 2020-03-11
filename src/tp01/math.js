// Varias formas de declarar una funcion
// y obtener los argumentos

function sum (x, b) {
  return x + b
}

var add2 = function (obj) {
  return obj.x + obj.y
}

var add3 = function ({ x, y }) {
  return x + y
}

const mul = (x, y) => x * y

module.exports = {
  add: sum,
  add2,
  add3,
  mul,
  mul2 ([x, y]) {
    return x * y
  }
}
