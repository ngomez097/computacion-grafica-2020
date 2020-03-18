let RGB = require('./rgb')

class Hex extends RGB {
  constructor (hex) {
    // Se desplaza el hex correspondiente a la posicion de cada color
    // siendo esta en bits = rrrrrrrrggggggggbbbbbbbb
    let r = (hex >> 16) & 0xff
    let g = (hex >> 8) & 0xff
    let b = hex & 0xff
    super(r, g, b)
  }
}

module.exports = Hex
