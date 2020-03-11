let Hex = require('./hex')

class Style extends Hex {
  constructor (hex) {
    let val = 0
    let auxHex = ''
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
