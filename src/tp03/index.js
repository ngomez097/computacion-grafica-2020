const WebGLRender = require('./WebGL/WebGLRender')
const Scene = require('./WebGL/Scene')
const Axes = require('./Objects/Axes')
const Mesh = require('./Objects/Mesh')
const PerspectiveCamera = require('./Camera/PerspectiveCamera')
const OrthographicCamera = require('./Camera/OrthographicCamera')
const Grid = require('./Objects/GridFloor')
const Cube = require('./Objects/Cube')
const Cone = require('./Objects/Cone')
const Cylinder = require('./Objects/Cylinder')
const Sphere = require('./Objects/Sphere')
const dat = require('dat.gui')

console.log('tp03')
const cameraConf = {
  fov: 60,
  eye: [0.0, 5.0, 10.0],
  center: [0, 0, 0],
  rpy: [0, -30, 0],
  useOrthographicCamera: false,
  useLookAt: false,
  vel: 0.2
}

const mouseConf = {
  isDragging: false,
  sensitivityX: 0.10,
  sensitivityY: 0.10
}

const cubeConf = {
  pos: [-6, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  localRotation: [0, 0, 0],
  prevLocalRotation: [0, 0, 0],
  rotationq: [0, 0, 0, 1],
  isWireframe: false,
  useQuaternion: false
}

const coneConf = {
  pos: [-2, -1.0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  vertex: 8,
  shadeSmooth: false,
  isWireframe: false
}

const cylinderConf = {
  pos: [2, -1, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  segments: 8,
  shadeSmooth: false,
  isWireframe: false
}

const sphereConf = {
  pos: [6, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  rings: 8,
  vertex: 8,
  radius: 1,
  shadeSmooth: false,
  isWireframe: false
}

let wegGLRender
let scene = new Scene()
let camera
let cube
let cone
let sphere
let cylinder
let canvas

/**
 * Controles
 * - w / s: mover hacia al frente / atras de la camara.
 * - a / d: mover hacia la izquierda / derecha de la camara.
 * - q / e: subir / bajar la camara.
 * - Hold shift: mover mas rapido la camara.
 */
let keyPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  q: false,
  e: false,
  shift: false
}

function init (canvasName) {
  initGUI()
  canvas = document.getElementById(canvasName)
  wegGLRender = new WebGLRender(canvas)
  camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

  // Linkeando los valores de la camara.
  camera.eye = cameraConf.eye
  camera.center = cameraConf.center
  camera.vel = cameraConf.vel
  camera.addPitch(cameraConf.rpy[1])

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
  cube.t = cubeConf.pos
  cube.s = cubeConf.scale
  cube.r = cubeConf.rotation
  cube.rq = cubeConf.rotationq

  // Creacion de un cono.
  cone = new Cone(coneConf.vertex, 1, 2, coneConf.shadeSmooth)
  scene.addObjects(cone)

  // Linkeando los valores del cono
  cone.t = coneConf.pos
  cone.s = coneConf.scale
  cone.r = coneConf.rotation

  // Creacion de un cilindro.
  cylinder = new Cylinder(cylinderConf.segments, 1, 2, cylinderConf.shadeSmooth)
  scene.addObjects(cylinder)

  // Linkeando los valores del cilindro
  cylinder.t = cylinderConf.pos
  cylinder.s = cylinderConf.scale
  cylinder.r = cylinderConf.rotation

  // Creacion de una esfera.
  sphere = new Sphere(sphereConf.vertex, sphereConf.rings, sphereConf.radius, sphereConf.shadeSmooth)
  scene.addObjects(sphere)

  // Linkeando los valores de la esfera
  sphere.t = sphereConf.pos
  sphere.s = sphereConf.scale
  sphere.r = sphereConf.rotation

  document.addEventListener('pointerlockchange', e => {
    if (document.pointerLockElement !== canvas) {
      canvas.onmousemove = null
    }
  })

  document.addEventListener('keydown', e => {
    keyPressed[e.key.toLowerCase()] = true
  })

  document.addEventListener('keyup', e => {
    keyPressed[e.key.toLowerCase()] = false
  })

  canvas.onclick = function (event) {
    mouseConf.isDragging = true
    canvas.requestPointerLock()
    canvas.onmousemove = function (event) {
      let aspect = canvas.clientWidth / canvas.clientHeight

      let auxX
      let auxY

      auxX = event.movementX * mouseConf.sensitivityX
      auxY = event.movementY * mouseConf.sensitivityY * aspect

      if (cameraConf.rpy[1] - auxY > 89.0) {
        cameraConf.rpy[1] = 89.0
      } else if (cameraConf.rpy[1] - auxY < -89.0) {
        cameraConf.rpy[1] = -89.0
      } else {
        camera.addPitch(-auxY)
        cameraConf.rpy[1] -= auxY
      }
      camera.addYaw(-auxX)
    }
  }

  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  if (keyPressed.shift) {
    cameraConf.vel = 0.4
  } else {
    cameraConf.vel = 0.2
  }
  if (keyPressed.w) {
    camera.moveForward(cameraConf.vel)
  }

  if (keyPressed.s) {
    camera.moveBackward(cameraConf.vel)
  }

  if (keyPressed.d) {
    camera.moveRight(cameraConf.vel)
  }

  if (keyPressed.a) {
    camera.moveLeft(cameraConf.vel)
  }

  if (keyPressed.q) {
    cameraConf.eye[1] += cameraConf.vel
  }

  if (keyPressed.e) {
    cameraConf.eye[1] -= cameraConf.vel
  }

  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene, camera)

  // Cubo
  if (cubeConf.isWireframe) {
    cube.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cube.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }
  cube.useQuaternion = cubeConf.useQuaternion

  cube.rotateLocal(
    cubeConf.localRotation[0] - cubeConf.prevLocalRotation[0]
    , 0)
  cube.rotateLocal(
    cubeConf.localRotation[1] - cubeConf.prevLocalRotation[1]
    , 1)
  cube.rotateLocal(
    cubeConf.localRotation[2] - cubeConf.prevLocalRotation[2]
    , 2)

  cubeConf.prevLocalRotation[0] = cubeConf.localRotation[0]
  cubeConf.prevLocalRotation[1] = cubeConf.localRotation[1]
  cubeConf.prevLocalRotation[2] = cubeConf.localRotation[2]

  // Cono
  if (coneConf.isWireframe) {
    cone.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cone.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }

  if (coneConf.vertex !== cone.baseVertexCount || coneConf.shadeSmooth !== cone.shadeSmooth) {
    cone.baseVertexCount = coneConf.vertex
    cone.shadeSmooth = coneConf.shadeSmooth
    cone.constructCone()
  }

  // Cilindro
  if (cylinderConf.isWireframe) {
    cylinder.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    cylinder.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }
  if (cylinderConf.segments !== cylinder.segments || cylinderConf.shadeSmooth !== cylinder.shadeSmooth) {
    cylinder.segments = cylinderConf.segments
    cylinder.shadeSmooth = cylinderConf.shadeSmooth
    cylinder.constructCylinder()
  }

  // Esfera
  if (sphereConf.isWireframe) {
    sphere.meshes[0].renderType = Mesh.RENDER_TYPE.LINE_LOOP
  } else {
    sphere.meshes[0].renderType = Mesh.RENDER_TYPE.TRIANGLES
  }
  if (sphereConf.rings !== sphere.rings || sphereConf.shadeSmooth !== sphere.shadeSmooth ||
    sphereConf.vertex !== sphere.vertexRing) {
    sphere.rings = sphereConf.rings
    sphere.shadeSmooth = sphereConf.shadeSmooth
    sphere.vertexRing = sphereConf.vertex
    sphere.constructSphere()
  }

  // Camara
  if (cameraConf.useOrthographicCamera && camera instanceof PerspectiveCamera) {
    camera = new OrthographicCamera()

    // Linkeando los valores de la camara.
    camera.eye = cameraConf.eye
    camera.center = cameraConf.center
    camera.rpy = cameraConf.rpy
  } else if (!cameraConf.useOrthographicCamera && camera instanceof OrthographicCamera) {
    camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

    // Linkeando los valores de la camara.
    camera.eye = cameraConf.eye
    camera.center = cameraConf.center
    camera.rpy = cameraConf.rpy
  }
  camera.useLookAt = cameraConf.useLookAt

  // Configuracion de la camara
  camera.setFovFromDegrees(cameraConf.fov)
  requestAnimationFrame(renderLoop)
}

function initGUI () {
  let gui = new dat.GUI()
  // Objectos
  let object = gui.addFolder('Objects')

  // Cubo
  let cubeGUI = object.addFolder('Cube')
  cubeGUI.add(cubeConf, 'isWireframe')
  cubeGUI.add(cubeConf, 'useQuaternion')
  let position = cubeGUI.addFolder('Position')
  position.add(cubeConf.pos, 0, -10, 10).name('X')
  position.add(cubeConf.pos, 1, -10, 10).name('Y')
  position.add(cubeConf.pos, 2, -10, 10).name('Z')
  let scale = cubeGUI.addFolder('Scale')
  scale.add(cubeConf.scale, 0, 0, 10).name('X')
  scale.add(cubeConf.scale, 1, 0, 10).name('Y')
  scale.add(cubeConf.scale, 2, 0, 10).name('Z')
  let rotate = cubeGUI.addFolder('Rotate')
  rotate.add(cubeConf.rotation, 0, 0, 360).name('X')
  rotate.add(cubeConf.rotation, 1, 0, 360).name('Y')
  rotate.add(cubeConf.rotation, 2, 0, 360).name('Z')
  let localrotate = cubeGUI.addFolder('Local Rotate')
  localrotate.add(cubeConf.localRotation, 0, 0, 360).name('X')
  localrotate.add(cubeConf.localRotation, 1, 0, 360).name('Y')
  localrotate.add(cubeConf.localRotation, 2, 0, 360).name('Z')
  let rotateQ = cubeGUI.addFolder('RotateQuaternion')
  rotateQ.add(cubeConf.rotationq, 0, 0, 1).name('X')
  rotateQ.add(cubeConf.rotationq, 1, 0, 1).name('Y')
  rotateQ.add(cubeConf.rotationq, 2, 0, 1).name('Z')
  rotateQ.add(cubeConf.rotationq, 3, 0, 10).name('W')

  // Cono
  let coneGUI = object.addFolder('Cone')
  coneGUI.add(coneConf, 'isWireframe')
  coneGUI.add(coneConf, 'shadeSmooth')
  coneGUI.add(coneConf, 'vertex', 3, 64, 1).name('Base Vertex')
  position = coneGUI.addFolder('Position')
  position.add(coneConf.pos, 0, -10, 10).name('X')
  position.add(coneConf.pos, 1, -10, 10).name('Y')
  position.add(coneConf.pos, 2, -10, 10).name('Z')
  scale = coneGUI.addFolder('Scale')
  scale.add(coneConf.scale, 0, 0, 10).name('X')
  scale.add(coneConf.scale, 1, 0, 10).name('Y')
  scale.add(coneConf.scale, 2, 0, 10).name('Z')
  rotate = coneGUI.addFolder('Rotate')
  rotate.add(coneConf.rotation, 0, 0, 360).name('X')
  rotate.add(coneConf.rotation, 1, 0, 360).name('Y')
  rotate.add(coneConf.rotation, 2, 0, 360).name('Z')

  // Cilindro
  let cylinderGUI = object.addFolder('Cylinder')
  cylinderGUI.add(cylinderConf, 'isWireframe')
  cylinderGUI.add(cylinderConf, 'shadeSmooth')
  cylinderGUI.add(cylinderConf, 'segments', 3, 64, 1).name('Segments')
  position = cylinderGUI.addFolder('Position')
  position.add(cylinderConf.pos, 0, -10, 10).name('X')
  position.add(cylinderConf.pos, 1, -10, 10).name('Y')
  position.add(cylinderConf.pos, 2, -10, 10).name('Z')
  scale = cylinderGUI.addFolder('Scale')
  scale.add(cylinderConf.scale, 0, 0, 10).name('X')
  scale.add(cylinderConf.scale, 1, 0, 10).name('Y')
  scale.add(cylinderConf.scale, 2, 0, 10).name('Z')
  rotate = cylinderGUI.addFolder('Rotate')
  rotate.add(cylinderConf.rotation, 0, 0, 360).name('X')
  rotate.add(cylinderConf.rotation, 1, 0, 360).name('Y')
  rotate.add(cylinderConf.rotation, 2, 0, 360).name('Z')

  // Esfera
  let sphereGUI = object.addFolder('Sphere')
  sphereGUI.add(sphereConf, 'isWireframe')
  sphereGUI.add(sphereConf, 'shadeSmooth')
  sphereGUI.add(sphereConf, 'vertex', 3, 64, 1).name('Ring Vertex')
  sphereGUI.add(sphereConf, 'rings', 1, 64, 1).name('Rings')

  position = sphereGUI.addFolder('Position')
  position.add(sphereConf.pos, 0, -10, 10).name('X')
  position.add(sphereConf.pos, 1, -10, 10).name('Y')
  position.add(sphereConf.pos, 2, -10, 10).name('Z')
  scale = sphereGUI.addFolder('Scale')
  scale.add(sphereConf.scale, 0, 0, 10).name('X')
  scale.add(sphereConf.scale, 1, 0, 10).name('Y')
  scale.add(sphereConf.scale, 2, 0, 10).name('Z')
  rotate = sphereGUI.addFolder('Rotate')
  rotate.add(sphereConf.rotation, 0, 0, 360).name('X')
  rotate.add(sphereConf.rotation, 1, 0, 360).name('Y')
  rotate.add(sphereConf.rotation, 2, 0, 360).name('Z')

  // Camara
  let camera = gui.addFolder('Camera')
  camera.add(cameraConf, 'fov', 0, 90)
  camera.add(cameraConf, 'useLookAt').name('Use LookAt?')
  camera.add(cameraConf, 'useOrthographicCamera')
  let cameraPosition = camera.addFolder('Position')
  cameraPosition.add(cameraConf.eye, 0).name('X').listen()
  cameraPosition.add(cameraConf.eye, 1).name('Y').listen()
  cameraPosition.add(cameraConf.eye, 2).name('Z').listen()
  rotate = camera.addFolder('Rotate')
  rotate.add(cameraConf.rpy, 0, 0, 360).name('Roll')
  let cameraRotation = camera.addFolder('Look At')
  cameraRotation.add(cameraConf.center, 0, 0, 10).name('X')
  cameraRotation.add(cameraConf.center, 1, 0, 10).name('Y')
  cameraRotation.add(cameraConf.center, 2, 0, 10).name('Z')
}

init('c')
