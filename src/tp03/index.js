const WebGLRender = require('./WebGL/WebGLRender')
const Scene = require('./Scene.js')
const Axes = require('./Objects/Axes')
const Mesh = require('./Objects/Mesh')
const PerspectiveCamera = require('./Camera/PerspectiveCamera')
const Grid = require('./Objects/GridFloor')
const Cube = require('./Objects/Cube')
const Cone = require('./Objects/Cone')
const Cylinder = require('./Objects/Cylinder')
const dat = require('dat.gui')

console.log('tp03')
const cameraConf = {
  fov: 45,
  eye: [2.0, 5.0, 10.0],
  center: [0, 0, 0],
  rotateY: 0
}

const cubeConf = {
  pos: [3, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  isWireframe: false
}

const coneConf = {
  pos: [-3, -1.0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  isWireframe: false
}

const cylinderConf = {
  pos: [0, -1.0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  isWireframe: false
}

const mouseConf = {
  isDragging: false,
  sensitivityX: 0.4,
  sensitivityY: 0.05,
  lastPos: [-1, -1]
}

let wegGLRender
let scene = new Scene()
let camera
let cube
let cone
let cylinder

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
  let axes = new Axes(10)
  scene.addObjects(axes)

  // Creacion de un cubo.
  cube = new Cube(2)
  scene.addObjects(cube)

  // Linkeando los valores del cubo
  cube.meshes[0].t = cubeConf.pos
  cube.meshes[0].s = cubeConf.scale
  cube.meshes[0].r = cubeConf.rotation

  // Creacion de un cono.
  cone = new Cone(8, 1, 2)
  scene.addObjects(cone)

  // Linkeando los valores del cono
  cone.meshes[0].t = coneConf.pos
  cone.meshes[0].s = coneConf.scale
  cone.meshes[0].r = coneConf.rotation

  // Creacion de un cilindro.
  cylinder = new Cylinder(16, 1, 2)
  scene.addObjects(cylinder)

  // Linkeando los valores del cilindro
  cylinder.meshes[0].t = cylinderConf.pos
  cylinder.meshes[0].s = cylinderConf.scale
  cylinder.meshes[0].r = cylinderConf.rotation

  canvas.addEventListener('mousedown', event => {
    mouseConf.isDragging = true
    mouseConf.lastPos = [event.clientX, event.clientY]
  })
  canvas.addEventListener('mousemove', event => {
    if (!mouseConf.isDragging) {
      return
    }

    let aspect = canvas.clientWidth / canvas.clientHeight

    let auxX = event.clientX
    let auxY = event.clientY

    cameraConf.rotateY += (mouseConf.lastPos[0] - auxX) * mouseConf.sensitivityX
    cameraConf.eye[1] += (auxY - mouseConf.lastPos[1]) * mouseConf.sensitivityY * aspect

    mouseConf.lastPos = [auxX, auxY]
  })
  canvas.addEventListener('mouseup', event => {
    mouseConf.isDragging = false
  })

  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene, camera)

  // Cubo
  if (cubeConf.isWireframe) {
    cube.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cube.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }

  if (coneConf.isWireframe) {
    cone.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cone.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }

  if (cylinderConf.isWireframe) {
    cylinder.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cylinder.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }

  // Configuracion de la camara
  camera.setFovFromDegrees(cameraConf.fov)
  camera.rotate[1] = cameraConf.rotateY

  requestAnimationFrame(renderLoop)
}

function initGUI () {
  let gui = new dat.GUI()
  // Objectos
  let object = gui.addFolder('Objects')
  // Cubo
  let cubeGUI = object.addFolder('Cube')
  cubeGUI.add(cubeConf, 'isWireframe')
  let position = cubeGUI.addFolder('Position')
  position.add(cubeConf.pos, 0, -10, 10).name('X')
  position.add(cubeConf.pos, 1, -10, 10).name('Y')
  position.add(cubeConf.pos, 2, -10, 10).name('Z')
  let scale = cubeGUI.addFolder('Scale')
  scale.add(cubeConf.scale, 0, -10, 10).name('X')
  scale.add(cubeConf.scale, 1, -10, 10).name('Y')
  scale.add(cubeConf.scale, 2, -10, 10).name('Z')
  let rotate = cubeGUI.addFolder('Rotate')
  rotate.add(cubeConf.rotation, 0, 0, 360).name('X')
  rotate.add(cubeConf.rotation, 1, 0, 360).name('Y')
  rotate.add(cubeConf.rotation, 2, 0, 360).name('Z')

  // Cono
  let coneGUI = object.addFolder('Cone')
  coneGUI.add(coneConf, 'isWireframe')
  position = coneGUI.addFolder('Position')
  position.add(coneConf.pos, 0, -10, 10).name('X')
  position.add(coneConf.pos, 1, -10, 10).name('Y')
  position.add(coneConf.pos, 2, -10, 10).name('Z')
  scale = coneGUI.addFolder('Scale')
  scale.add(coneConf.scale, 0, -10, 10).name('X')
  scale.add(coneConf.scale, 1, -10, 10).name('Y')
  scale.add(coneConf.scale, 2, -10, 10).name('Z')
  rotate = coneGUI.addFolder('Rotate')
  rotate.add(coneConf.rotation, 0, 0, 360).name('X')
  rotate.add(coneConf.rotation, 1, 0, 360).name('Y')
  rotate.add(coneConf.rotation, 2, 0, 360).name('Z')

  // Cilindro
  let cylinderGUI = object.addFolder('Cylinder')
  cylinderGUI.add(cylinderConf, 'isWireframe')
  position = cylinderGUI.addFolder('Position')
  position.add(cylinderConf.pos, 0, -10, 10).name('X')
  position.add(cylinderConf.pos, 1, -10, 10).name('Y')
  position.add(cylinderConf.pos, 2, -10, 10).name('Z')
  scale = cylinderGUI.addFolder('Scale')
  scale.add(cylinderConf.scale, 0, -10, 10).name('X')
  scale.add(cylinderConf.scale, 1, -10, 10).name('Y')
  scale.add(cylinderConf.scale, 2, -10, 10).name('Z')
  rotate = cylinderGUI.addFolder('Rotate')
  rotate.add(cylinderConf.rotation, 0, 0, 360).name('X')
  rotate.add(cylinderConf.rotation, 1, 0, 360).name('Y')
  rotate.add(cylinderConf.rotation, 2, 0, 360).name('Z')

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
