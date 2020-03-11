/* global describe, it, expect */

const RGB = require('./rgb')
const RGBA = require('./rgba')

describe('RGB Color - Classic', function () {
  it('should be an instance of RGBA', function () {
    var color = new RGB()
    expect(color instanceof RGBA).toBeTruthy()
  })

  it('should have own properties r,g,b,a', function () {
    var color = new RGB()
    expect(color.hasOwnProperty('r')).toBeTruthy()
    expect(color.hasOwnProperty('g')).toBeTruthy()
    expect(color.hasOwnProperty('b')).toBeTruthy()
    expect(color.hasOwnProperty('a')).toBeTruthy()
  })

  it('should have defined #vec3()', function () {
    var color = new RGB()
    expect(color.vec3).toBeDefined()
  })

  it('should have defined #vec4()', function () {
    var color = new RGB()
    expect(color.vec4).toBeDefined()
  })

  describe('#vec4()', function () {
    it('should return [1,1,1,1] as default', function () {
      var color = new RGB()
      var expected = []

      expected[0] = 1
      expected[1] = 1
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [1,0.5,0.25,1] for (1, 0.5, 0.25)', function () {
      var color = new RGB(1, 0.5, 0.25)
      var expected = []

      expected[0] = 1
      expected[1] = 0.5
      expected[2] = 0.25
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
  })
})
