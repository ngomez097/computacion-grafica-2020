const WebGLRender = require('./WebGLRender')
const Scene = require('./Scene.js')
const Mesh = require('./Mesh')
const Geometry = require('./Geometry')
const RegularConvexPolygonGeometry = require('./RegularConvexPolygonGeometry')
const dat = require('dat.gui')

console.log('tp02')
let edges = 8
const conf = {
  vel: 0.01,
  wireframe: true,
  size: 0.25,
  padding: 0.25,
  change_color: true,
  f_change_color: function () {
    conf.change_color = !conf.change_color
  }
}

function init (canvasName) {
  initGUI()
  let canvas = document.getElementById(canvasName)
  let wegGLRender = new WebGLRender(canvas)
  let ejesScene = new Scene()
  let objScene = new Scene()

  let nPoligon = null
  let mesh = null

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
    objScene.addMesh(mesh)
  }

  renderLoop(wegGLRender, objScene, ejesScene)
}

// Funcion para realizar la animacion.
function renderLoop (wegGLRender, objScene, ejesScene) {
  wegGLRender.clearBackground(objScene.clearColor)
  wegGLRender.render(ejesScene, true)
  wegGLRender.render(objScene, conf.wireframe)

  for (let i = 1; i <= objScene.meshes.length; i++) {
    let mesh = objScene.meshes[i - 1]
    /** Variaciones */

    // Transformacion
    mesh.t[0] = conf.size * (i - 2) * 2 + (i - 2) * conf.padding

    // Escalado
    mesh.s[0] = conf.size
    mesh.s[1] = conf.size

    // Material
    if (conf.change_color) {
      mesh.material = [
        Math.max(Math.random(), 0.5), // R
        Math.max(Math.random(), 0.5), // G
        Math.max(Math.random(), 0.5) // B
      ]
    }

    mesh.r[2] += conf.vel
  }
  conf.change_color = false

  setTimeout(renderLoop, 1000 / 60, wegGLRender, objScene, ejesScene)
}

function initGUI () {
  let gui = new dat.GUI()
  gui.add(conf, 'vel', 0, 0.1)
  gui.add(conf, 'size', 0.01, 0.5)
  gui.add(conf, 'padding', 0.01, 0.25)
  gui.add(conf, 'wireframe')
  gui.add(conf, 'f_change_color',)
}

init('c')
