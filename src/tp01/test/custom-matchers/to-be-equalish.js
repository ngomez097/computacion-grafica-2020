const EPSILON = 0.00001

const toBeEqualish = (util, customEqualityTesters) => ({

  compare: (actual, expected) => {
    const result = {
      pass: true
    }

    for (let index = 0; index < expected.length; index++) {
      result.pass = result.pass && Math.abs(actual[index] - expected[index]) < EPSILON
    }

    if (result.pass) {
      result.message = 'Expected [' + actual + '] not to be ~[' + expected + ']'
    } else {
      result.message = 'Expected [' + actual + '] to be ~[' + expected + ']'
    }

    return result
  }

})

module.exports = toBeEqualish
