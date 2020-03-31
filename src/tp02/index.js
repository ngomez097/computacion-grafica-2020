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

let wegGLRender
let scene

function init (canvasName) {
  initGUI()
  let canvas = document.getElementById(canvasName)
  wegGLRender = new WebGLRender(canvas)
  scene = new Scene()

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

  scene.addAxes(ejeXMesh, ejeYMesh)

  // Creacion de los poligonos
  for (let i = 1; i <= 3; i++) {
    nPoligon = new RegularConvexPolygonGeometry(edges * i)
    mesh = new Mesh(nPoligon)
    scene.addMesh(mesh)
  }

  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene)

  for (let i = 0; i < scene.meshes.length; i++) {
    let mesh = scene.meshes[i]
    /** Variaciones */

    // Transformacion
    mesh.t[0] = (conf.size * 2 + conf.padding) * (i - 1)

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

    mesh.isWireframe = conf.wireframe

    mesh.r[2] += conf.vel
  }
  conf.change_color = false

  requestAnimationFrame(renderLoop)
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
