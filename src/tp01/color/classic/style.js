let Hex = require('./hex')

class Style extends Hex {
  constructor (hex) {
    let val = 0
    let auxHex = ''

    //  Como no se obtenía información se opto por
    // duplicar el carácter cuando venia el hex en
    // el formato reducido.
    if (hex.length === 4) {
      for (let i = 1; i < 4; i++) {
        auxHex += hex.charAt(i) + hex.charAt(i)
      }
    } else {
      auxHex = hex.slice(1, hex.length)
    }
    val = parseInt('0x' + auxHex.slice(0, auxHex.length))
    super(val)
  }
}

module.exports = Style
