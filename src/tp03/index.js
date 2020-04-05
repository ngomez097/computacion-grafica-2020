const WebGLRender = require('./WebGLRender')
const Scene = require('./Scene.js')
const Mesh = require('./Mesh')
const RegularConvexPolygonGeometry = require('./RegularConvexPolygonGeometry')
const ObjectScene = require('./ObjectScene')
const Axes = require('./Axes')
const PerspectiveCamera = require('./PerspectiveCamera')
const Grid = require('./GridFloor')
const dat = require('dat.gui')

console.log('tp03')
let edges = 8
const objects = {
  vel: 1,
  wireframe: false,
  size: 1.0,
  padding: 0.25,
  change_color: true,
  f_change_color: function () {
    objects.change_color = !objects.change_color
  },
}

const cameraConf = {
  fov: 45,
  center: [0, 2.0, 10.0],
  rotate: [0, 45, 0]
}

let wegGLRender
let scene = new Scene()
let camera

function init (canvasName) {
  initGUI()
  let canvas = document.getElementById(canvasName)
  wegGLRender = new WebGLRender(canvas)
  camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)
  camera.center = cameraConf.center
  camera.rotate = cameraConf.rotate

  let nPoligon
  let mesh
  let obj
  // Creacion de los ejes
  let axes = new Axes(10, [true, true, true])
  scene.addObjects(axes)

  // Creacion de la grilla
  let grid = new Grid(10)
  scene.addObjects(grid)

  // Creacion de los poligonos
  for (let i = 1; i <= 3; i++) {
    nPoligon = new RegularConvexPolygonGeometry(edges * i)
    mesh = new Mesh(nPoligon)
    mesh.t[2] = 1
    obj = new ObjectScene(mesh)
    scene.addObjects(obj)
  }

  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene, camera)

  for (let i = 2; i < scene.objects.length; i++) {
    for (let mesh of scene.objects[i].meshes) {
      /** Variaciones */

      // Transformacion
      mesh.t[0] = (objects.size * 2 + objects.padding) * (i - 3)

      // Escalado
      mesh.s[0] = objects.size
      mesh.s[1] = objects.size

      // Material
      if (objects.change_color) {
        mesh.material = [
          Math.max(Math.random(), 0.5), // R
          Math.max(Math.random(), 0.5), // G
          Math.max(Math.random(), 0.5) // B
        ]
      }

      mesh.isWireframe = objects.wireframe

      mesh.r[0] += objects.vel
    }
  }
  // Configuracion de la camara
  camera.setFovFromDegrees(cameraConf.fov)
  camera.center = cameraConf.center
  camera.rotate = cameraConf.rotate

  objects.change_color = false

  requestAnimationFrame(renderLoop)
}

function initGUI () {
  let gui = new dat.GUI()
  let object = gui.addFolder('Objetos')
  object.add(objects, 'vel', 0, 5)
  object.add(objects, 'size', 0.01, 1.0)
  object.add(objects, 'padding', 0.01, 0.25)
  object.add(objects, 'wireframe')
  object.add(objects, 'f_change_color',)

  let camera = gui.addFolder('Camera')
  camera.add(cameraConf, 'fov', 0, 90)
  let cameraPosition = camera.addFolder('Position')
  cameraPosition.add(cameraConf.center, 0, 0, 20).name('X')
  cameraPosition.add(cameraConf.center, 1, 0, 20).name('Y')
  cameraPosition.add(cameraConf.center, 2, 0, 20).name('Z')
  let cameraRotation = camera.addFolder('Rotation')
  cameraRotation.add(cameraConf.rotate, 0, 0, 360).name('X')
  cameraRotation.add(cameraConf.rotate, 1, 0, 360).name('Y')
  cameraRotation.add(cameraConf.rotate, 2, 0, 360).name('Z')
}

init('c')
