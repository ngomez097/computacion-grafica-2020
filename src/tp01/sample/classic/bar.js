const Foo = require('./foo')

class Bar extends Foo {
  constructor (text, other) {
    super(text)
    this.other = other
  }

  barMethod () {
    return 'invoked barMethod()'
  }

  fooMethod () {
    return super.fooMethod() + ' from Bar'
  }

  get myBarProp () {
    return 'myBarProp: ' + this._myBarProp
  }

  set myBarProp (value) {
    this._myBarProp = value
  }
}

module.exports = Bar
