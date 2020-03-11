/* global describe, it, expect */

const Style = require('./style')
const RGBA = require('./rgba')

describe('Style Color - Classic', function () {
  it('should be an instance of RGBA', function () {
    var color = new Style('#ffffff')
    expect(color instanceof RGBA).toBeTruthy()
  })

  it('should have own properties r,g,b,a', function () {
    var color = new Style('#ffffff')
    expect(color.hasOwnProperty('r')).toBeTruthy()
    expect(color.hasOwnProperty('g')).toBeTruthy()
    expect(color.hasOwnProperty('b')).toBeTruthy()
    expect(color.hasOwnProperty('a')).toBeTruthy()
  })

  it('should have defined #vec3()', function () {
    var color = new Style('#ffffff')
    expect(color.vec3).toBeDefined()
  })

  it('should have defined #vec4()', function () {
    var color = new Style('#ffffff')
    expect(color.vec4).toBeDefined()
  })

  describe('#vec4()', function () {
    it('should return [1,1,1,1] for #ffffff', function () {
      var color = new Style('#ffffff')
      var expected = []

      expected[0] = 1
      expected[1] = 1
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
    it('should return [0,0,0,1] for #000000', function () {
      var color = new Style('#000000')
      var expected = []

      expected[0] = 0
      expected[1] = 0
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
    it('should return [1,0,0,1] for #ff0000', function () {
      var color = new Style('#ff0000')
      var expected = []

      expected[0] = 1
      expected[1] = 0
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
    it('should return [0,1,0,1] for #00ff00', function () {
      var color = new Style('#00ff00')
      var expected = []

      expected[0] = 0
      expected[1] = 1
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
    it('should return [0,0,1,1] for #0000ff', function () {
      var color = new Style('#0000ff')
      var expected = []

      expected[0] = 0
      expected[1] = 0
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,0,0,1] for #000', function () {
      var color = new Style('#000')
      var expected = []

      expected[0] = 0
      expected[1] = 0
      expected[2] = 0
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,0,1,1] for #00f', function () {
      var color = new Style('#00f')
      var expected = []

      expected[0] = 0
      expected[1] = 0
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [0,1,1,1] for #0ff', function () {
      var color = new Style('#0ff')
      var expected = []

      expected[0] = 0
      expected[1] = 1
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })

    it('should return [1,1,1,1] for #fff', function () {
      var color = new Style('#fff')
      var expected = []

      expected[0] = 1
      expected[1] = 1
      expected[2] = 1
      expected[3] = 1
      expect(color.vec4()).toEqual(expected)
    })
  })
})
