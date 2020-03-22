const WebGLRender = require('./WebGLRender')
const Scene = require('./Scene.js')
const Mesh = require('./Mesh')
const Geometry = require('./Geometry')
const RegularConvexPolygonGeometry = require('./RegularConvexPolygonGeometry')

console.log('tp02')
let edges = 8

function init (canvasName) {
  let canvas = document.getElementById(canvasName)
  let wegGLRender = new WebGLRender(canvas)
  let ejesScene = new Scene()
  let objScene = new Scene()

  let nPoligon = null
  let mesh = null
  let size = 0.25
  let padding = 0.05

  // Creacion de los ejes
  let ejeXGeometry = new Geometry()
  ejeXGeometry.vertices = [[0.0, 0.0], [1.0, 0.0]]
  ejeXGeometry.faces = [[0, 1]]
  let ejeXMesh = new Mesh(ejeXGeometry)
  ejeXMesh.material = [1.0, 0.3, 0.3]

  let ejeYGeometry = new Geometry()
  ejeYGeometry.vertices = [[0.0, 0.0], [0.0, 1.0]]
  ejeYGeometry.faces = [[0, 1]]
  let ejeYMesh = new Mesh(ejeYGeometry)
  ejeYMesh.material = [0.4, 1.0, 0.4]

  ejesScene.addMesh(ejeXMesh, ejeYMesh)

  // Creacion de los poligonos
  for (let i = 1; i <= 3; i++) {
    nPoligon = new RegularConvexPolygonGeometry(edges * i)
    mesh = new Mesh(nPoligon)
    // Transformacion
    mesh.t[0] = size * (i - 2) * 2 + (i - 2) * padding

    // Escalado
    mesh.s[0] = size
    mesh.s[1] = size

    // Material
    mesh.material = [
      Math.max(Math.random(), 0.5), // R
      Math.max(Math.random(), 0.5), // G
      Math.max(Math.random(), 0.5) // B
    ]
    objScene.addMesh(mesh)
  }

  renderLoop(wegGLRender, objScene, ejesScene)
}

// Funcion para realizar la animacion.
function renderLoop (wegGLRender, objScene, ejesScene) {
  wegGLRender.clearBackground(objScene.clearColor)
  wegGLRender.render(ejesScene)
  wegGLRender.render(objScene)
  for (let mesh of objScene.meshes) {
    mesh.r[2] += 0.01
  }

  setTimeout(renderLoop, 1000 / 60, wegGLRender, objScene, ejesScene)
}

init('c')
