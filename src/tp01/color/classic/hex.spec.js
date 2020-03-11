/* global describe, it, expect */

const Hex = require('./hex')
const RGBA = require('./rgba')

describe('Hex Color - Classic', function () {
  it('should be an instance of RGBA', function () {
    var color = new Hex(0xffffff)
    expect(color instanceof RGBA).toBeTruthy()
  })

  it('should have own properties r,g,b,a', function () {
    var color = new Hex(0xffffff)
    expect(color.hasOwnProperty('r')).toBeTruthy()
    expect(color.hasOwnProperty('g')).toBeTruthy()
    expect(color.hasOwnProperty('b')).toBeTruthy()
    expect(color.hasOwnProperty('a')).toBeTruthy()
  })

  it('should have defined #vec3()', function () {
    var color = new Hex(0xffffff)
    expect(color.vec3).toBeDefined()
  })

  it('should have defined #vec4()', function () {
    var color = new Hex(0xffffff)
    expect(color.vec4).toBeDefined()
  })

  describe('#vec4()', function () {
    it('should return [1,1,1,1] for 0xffffff', function () {
      var color = new Hex(0xffffff)
      var expected = []

      expected[0] = 1
      expected[1] = 1
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,0,0,1] for 0x000000', function () {
      var color = new Hex(0x000000)
      var expected = []

      expected[0] = 0
      expected[1] = 0
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [1,0,0,1] for 0xff0000', function () {
      var color = new Hex(0xff0000)
      var expected = []

      expected[0] = 1
      expected[1] = 0
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,1,0,1] for 0x00ff00', function () {
      var color = new Hex(0x00ff00)
      var expected = []

      expected[0] = 0
      expected[1] = 1
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,0,1,1] for 0x0000ff', function () {
      var color = new Hex(0x0000ff)
      var expected = []

      expected[0] = 0
      expected[1] = 0
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
  })
})
