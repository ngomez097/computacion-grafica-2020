const RegularConvexPolygonGeometry = require('./RegularConvexPolygonGeometry')

console.log('tp02')
let count = 4

function init (canvasName) {
  let nPoligon = new RegularConvexPolygonGeometry(
    count, 0.8, false, canvasName)
  renderLoop(nPoligon)
}

function renderLoop (obj) {
  obj.draw()
  if (obj.n < 20) {
    obj.n = obj.n + 1
    setTimeout(renderLoop, 1000 / 2, obj)
  }
}

init('c')
