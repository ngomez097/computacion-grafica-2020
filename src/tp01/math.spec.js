/* global describe, it, expect */

const math = require('./math')

describe('math', () => {
  describe('add()', () => {
    it('should add numbers', () => {
      expect(math.add(1, 2)).toBe(3)
    })
  })

  describe('add2()', () => {
    it('should add numbers', () => {
      expect(math.add2({ x: 1, y: 2 })).toBe(3)
    })
  })

  describe('add3()', () => {
    it('should add numbers', () => {
      expect(math.add3({ x: 1, y: 2 })).toBe(3)
    })
  })

  describe('mul()', () => {
    it('should multiply numbers', () => {
      expect(math.mul(3, 2)).toBe(6)
    })
  })

  describe('mul2()', () => {
    it('should multiply numbers', () => {
      expect(math.mul2([3, 2])).toBe(6)
    })
  })
})
