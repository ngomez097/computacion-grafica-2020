const WebGLRender = require('./WebGLRender')
const Scene = require('./Scene')
const Mesh = require('./Mesh')
const RegularConvexPolygonGeometry = require('./RegularConvexPolygonGeometry')

console.log('tp02')
let edges = 4

function init (canvasName) {
  let nPoligon = new RegularConvexPolygonGeometry(edges)
  let mesh = new Mesh(nPoligon, null)
  let scene = new Scene()
  scene.addMesh(mesh)
  let canvas = document.getElementById(canvasName)
  let wegGLRender = new WebGLRender(canvas)

  renderLoop(wegGLRender, scene, nPoligon)
}

function renderLoop (wegGLRender, scene, nPoligon) {
  wegGLRender.render(scene)
  /*if (obj.n < 20) {
    obj.n = obj.n + 1
    setTimeout(renderLoop, 1000 / 2, wegGLRender, scene, nPoligon)
  }*/
}

init('c')
