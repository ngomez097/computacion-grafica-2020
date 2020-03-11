class Foo {
  constructor (text) {
    this.text = text
  }

  method () {
    return 'invoked method()'
  }

  fooMethod () {
    return 'invoked fooMethod()'
  }

  get myFooProp () {
    return 'myFooProp: ' + this._myFooProp
  }

  set myFooProp (value) {
    this._myFooProp = value
  }
}

module.exports = Foo
