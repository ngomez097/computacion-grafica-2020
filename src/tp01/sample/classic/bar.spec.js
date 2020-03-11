/* global describe, it, expect, beforeEach, jasmine, spyOn */

const Foo = require('./foo')
const Bar = require('./bar')

describe('Bar - Classic', function () {
  var bar

  beforeEach(function () {
    bar = new Bar('some-text', 'some-other')
  })
  it('should be instanceof Foo', function () {
    expect(bar instanceof Foo).toBeTruthy()
  })

  describe('#method()', function () {
    beforeEach(function () {
      spyOn(Foo.prototype, 'method').and.callThrough()
    })
    it('should be defined', function () {
      expect(bar.method).toBeDefined()
      expect(bar.method).toEqual(jasmine.any(Function))
    })
    it('should return "invoked method()"', function () {
      expect(bar.method()).toBe('invoked method()')
    })
    it('should invoke Foo.prototype#method()', function () {
      bar.method()
      expect(Foo.prototype.method).toHaveBeenCalled()
    })
  })

  describe('#fooMethod()', function () {
    beforeEach(function () {
      spyOn(Foo.prototype, 'fooMethod').and.callThrough()
    })
    it('should be defined ', function () {
      expect(bar.fooMethod).toBeDefined()
      expect(bar.fooMethod).toEqual(jasmine.any(Function))
    })
    it('should return "invoked fooMethod() from Bar"', function () {
      expect(bar.fooMethod()).toBe('invoked fooMethod() from Bar')
    })
    it('should invoke Foo.prototype#fooMethod()', function () {
      bar.fooMethod()
      expect(Foo.prototype.fooMethod).toHaveBeenCalled()
    })
  })

  describe('#barMethod()', function () {
    it('should be defined', function () {
      expect(bar.barMethod).toBeDefined()
      expect(bar.barMethod).toEqual(jasmine.any(Function))
    })
    it('should return "invoked barMethod()"', function () {
      expect(bar.barMethod()).toBe('invoked barMethod()')
    })
  })

  describe('#text', function () {
    it('should be own property', function () {
      expect(bar.hasOwnProperty('text')).toBeTruthy()
    })
    it('should be equal to "some-text"', function () {
      expect(bar.text).toBe('some-text')
    })
  })

  describe('#other', function () {
    it('should be own property', function () {
      expect(bar.hasOwnProperty('other')).toBeTruthy()
    })
    it('should be equal to "some-other"', function () {
      expect(bar.other).toBe('some-other')
    })
  })

  describe('#myBarProp', function () {
    it('should set and get', function () {
      bar.myBarProp = 'some-value'
      expect(bar.myBarProp).toBe('myBarProp: some-value')
    })
  })

  describe('#myFooProp', function () {
    it('should set and get', function () {
      bar.myFooProp = 'some-value'
      expect(bar.myFooProp).toBe('myFooProp: some-value')
    })
  })
})
