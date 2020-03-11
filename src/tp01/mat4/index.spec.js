/* global jasmine, describe, it, expect, beforeEach */
const customMatchers = require('../test/custom-matchers')
const mat4 = require('./')

describe('mat4', () => {
  let A
  let I

  beforeEach(() => {
    // FIXME: use custom equality https://jasmine.github.io/2.9/custom_equality.html
    jasmine.addMatchers(customMatchers)
    A = [
      1, 2, 3, 4,
      5, 6, 7, 7,
      9, 10, 11, 12,
      13, 14, 15, 16
    ]
    I = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  })

  describe('transpose', () => {
    it('should return a 16 component vector', () => {
      const actual = mat4.transpose(A)
      expect(actual.length).toBe(16)
    })
    it('should return a transposed vector', () => {
      const actual = mat4.transpose(A)
      expect(actual).toBeEqualish([
        1, 5, 9, 13,
        2, 6, 10, 14,
        3, 7, 11, 15,
        4, 7, 12, 16
      ])
    })
  })

  describe('mul', () => {
    it('should return a 16 component vector "matrix"', () => {
      const actual = mat4.multiply(A, I)
      expect(actual.length).toBe(16)
    })
    it('should return the same vector when it\'s multiplied by the Identity "matrix"', () => {
      const actual = mat4.multiply(A, I)
      expect(actual).toBeEqualish(A)
    })
    it('should return a multiplied vector "matrix"', () => {
      const actual = mat4.multiply(A, A)
      expect(actual).toBeEqualish([
        90, 100, 110, 118,
        189, 214, 239, 258,
        314, 356, 398, 430,
        426, 484, 542, 586
      ])
    })
  })
})
