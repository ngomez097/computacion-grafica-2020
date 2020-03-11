/* global jasmine, describe, it, expect, beforeEach */
const customMatchers = require('../test/custom-matchers')

const vec3 = require('./')

describe('vec3', () => {
  let X
  let Y
  let Z
  let NX
  let NY
  let NZ
  let ONES
  let ZEROS

  beforeEach(() => {
    // FIXME: use custom equality https://jasmine.github.io/2.9/custom_equality.html
    jasmine.addMatchers(customMatchers)
    X = [1, 0, 0]
    Y = [0, 1, 0]
    Z = [0, 0, 1]
    NX = [-1, 0, 0]
    NY = [0, -1, 0]
    NZ = [0, 0, -1]
    ONES = [1, 1, 1]
    ZEROS = [0, 0, 0]
  })

  // TODO: add length test

  describe('normalize', () => {
    let actual
    beforeEach(() => {
      actual = vec3.normalize(ONES)
    })
    it('should return a 3 component vector', () => {
      expect(actual.length).toBe(3)
    })

    it('should return a normalized vector', () => {
      expect(actual).toBeEqualish([0.57735, 0.57735, 0.57735])
    })
  })

  describe('cross', () => {
    it('should return a 3 component vector', () => {
      const actual = vec3.cross(X, Y)
      expect(actual.length).toBe(3)
    })
    it('should return a cross product', () => {
      const actual = vec3.cross(X, Y)
      expect(actual).toBeEqualish(Z)
    })
    it('should return a cross product', () => {
      const actual = vec3.cross(Y, Z)
      expect(actual).toBeEqualish(X)
    })
    it('should return a cross product', () => {
      const actual = vec3.cross(NZ, NY)
      expect(actual).toBeEqualish(NX)
    })
  })

  describe('normals', () => {
    it('should return a 3 component vector', () => {
      const actual = vec3.normals(ZEROS, X, Y)
      expect(actual.length).toBe(3)
    })
    it('should return a normal for a CCW triangle points', () => {
      const actual = vec3.normals(ZEROS, X, Y)
      expect(actual).toBeEqualish(Z)
    })
    it('should return a normal for a CCW triangle points', () => {
      const actual = vec3.normals(ZEROS, Y, NX)
      expect(actual).toBeEqualish(Z)
    })
    it('should return a normal for a CCW triangle points', () => {
      const actual = vec3.normals(ZEROS, Y, Z)
      expect(actual).toBeEqualish(X)
    })
    it('should return a normal for a CCW triangle points', () => {
      const actual = vec3.normals(ZEROS, Y, NZ)
      expect(actual).toBeEqualish(NX)
    })
  })
})
