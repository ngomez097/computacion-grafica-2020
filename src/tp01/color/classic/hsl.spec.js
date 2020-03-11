/* global describe, it, expect */

const HSL = require('./hsl')
const RGBA = require('./rgba')

describe('HSL Color - Classic', function () {
  it('should be an instance of RGBA', function () {
    var color = new HSL(120, 1.0, 0.5)
    expect(color instanceof RGBA).toBeTruthy()
  })

  it('should have own properties r,g,b,a', function () {
    var color = new HSL(120, 1.0, 0.5)
    expect(color.hasOwnProperty('r')).toBeTruthy()
    expect(color.hasOwnProperty('g')).toBeTruthy()
    expect(color.hasOwnProperty('b')).toBeTruthy()
    expect(color.hasOwnProperty('a')).toBeTruthy()
  })

  it('should have defined #vec3()', function () {
    var color = new HSL(120, 1.0, 0.5)
    expect(color.vec3).toBeDefined()
  })

  it('should have defined #vec4()', function () {
    var color = new HSL(120, 1.0, 0.5)
    expect(color.vec4).toBeDefined()
  })

  describe('#vec4()', function () {
    it('should return [0,1,0,1] for (120, 1.0, 0.5)', function () {
      var color = new HSL(120, 1.0, 0.5)
      var expected = []

      expected[0] = 0
      expected[1] = 1
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [1,1,0,1] for (60, 1.0, 0.5)', function () {
      var color = new HSL(60, 1.0, 0.5)
      var expected = []

      expected[0] = 1
      expected[1] = 1
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,1,1,1] for (180, 1.0, 0.5)', function () {
      var color = new HSL(180, 1.0, 0.5)
      var expected = []

      expected[0] = 0
      expected[1] = 1
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
  })
})
