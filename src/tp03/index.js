const WebGLRender = require('./WebGL/WebGLRender')
const Scene = require('./Scene.js')
const Axes = require('./Objects/Axes')
const Mesh = require('./Objects/Mesh')
const PerspectiveCamera = require('./Camera/PerspectiveCamera')
const Grid = require('./Objects/GridFloor')
const Cube = require('./Objects/Cube')
const util = require('./Utils')
const dat = require('dat.gui')

console.log('tp03')
const objects = {
  wireframe: false,
  change_color: true,
  f_change_color: function () {
    objects.change_color = !objects.change_color
  },
}

const cameraConf = {
  fov: 45,
  eye: [0, 2.0, 5.0],
  center: [0, 0, 0],
  rotateY: 0
}

let wegGLRender
let scene = new Scene()
let camera
let cube

function init (canvasName) {
  initGUI()
  let canvas = document.getElementById(canvasName)
  wegGLRender = new WebGLRender(canvas)
  camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

  // Linkeando los valores de la camara.
  camera.eye = cameraConf.eye
  camera.center = cameraConf.center

  // Creacion de la grilla
  let grid = new Grid(20)
  scene.addObjects(grid)

  // Creacion de los ejes
  let axes = new Axes(10, [true, true, true])
  scene.addObjects(axes)

  // Creacion de un cubo.
  cube = new Cube(2)
  scene.addObjects(cube)

  canvas.addEventListener('mousemove', event => {
    cameraConf.rotateY = util.map(event.clientX, 0, canvas.clientWidth, 0, 360)
  })
  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene, camera)

  // Cubo
  if (objects.wireframe) {
    cube.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cube.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }

  // Configuracion de la camara
  camera.setFovFromDegrees(cameraConf.fov)
  camera.rotate[1] = cameraConf.rotateY
  objects.change_color = false

  requestAnimationFrame(renderLoop)
}

function initGUI () {
  let gui = new dat.GUI()
  let object = gui.addFolder('Objetos')
  object.add(objects, 'wireframe')
  object.add(objects, 'f_change_color',)

  let camera = gui.addFolder('Camera')
  camera.add(cameraConf, 'fov', 0, 90)
  let cameraPosition = camera.addFolder('Position')
  cameraPosition.add(cameraConf.eye, 0, 0, 20).name('X')
  cameraPosition.add(cameraConf.eye, 1, 0, 20).name('Y')
  cameraPosition.add(cameraConf.eye, 2, 0, 20).name('Z')
  let cameraRotation = camera.addFolder('Look At')
  cameraRotation.add(cameraConf.center, 0, 0, 10).name('X')
  cameraRotation.add(cameraConf.center, 1, 0, 10).name('Y')
  cameraRotation.add(cameraConf.center, 2, 0, 10).name('Z')
}

init('c')
