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

// Variables utilizadas para la animacion del cubo.
let angle
let face
let maxAngle

// Objeto con las opciones de la camara.
const cameraConf = {
  fov: 60,
  eye: [0.0, 5.0, 10.0],
  center: [0, 0, 0],
  rpy: [0, -30, 0],
  useOrthographicCamera: false,
  useLookAt: false,
  vel: 0.2
}

// Objeto con las opciones del mouse.
const mouseConf = {
  sensitivityX: 0.10,
  sensitivityY: 0.10
}

// Objeto con las opciones del cubo.
const cubeConf = {
  pos: [-6, 0, 0],
  scale: [1, 1, 1],
  rotation: [0.0, 0.0, 0.0],
  prevLocalRotation: [0, 0, 0],
  rotationq: [0, 0, 0, 1],
  isWireframe: false,
  useQuaternion: false,
  anim: true
}

// Objeto con las opciones del cono.
const coneConf = {
  pos: [-2, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  vertex: 8,
  shadeSmooth: false,
  isWireframe: false
}

// Objeto con las opciones del cilindro.
const cylinderConf = {
  pos: [2, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  segments: 8,
  shadeSmooth: false,
  isWireframe: false
}

// Objeto con las opciones de la esfera.
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

console.log(
  'Controles\n' +
  '- Click: entrar en modo Fly.\n' +
  '- w / s: mover hacia al frente / atras de la camara.\n' +
  '- a / d: mover hacia la izquierda / derecha de la camara.\n' +
  '- Space / Ctrl: subir / bajar la camara.\n' +
  '- q / e: Roll de la camara.\n' +
  '- Hold shift: mover mas rapido la camara.\n'
)
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
  cube.rotation = cubeConf.rotation
  cube.rq = cubeConf.rotationq

  // Creacion de un cono.
  cone = new Cone(coneConf.vertex, 1, 2, coneConf.shadeSmooth)
  scene.addObjects(cone)

  // Linkeando los valores del cono
  cone.t = coneConf.pos
  cone.s = coneConf.scale
  cone.rotation = coneConf.rotation

  // Creacion de un cilindro.
  cylinder = new Cylinder(cylinderConf.segments, 1, 2, cylinderConf.shadeSmooth)
  scene.addObjects(cylinder)

  // Linkeando los valores del cilindro
  cylinder.t = cylinderConf.pos
  cylinder.s = cylinderConf.scale
  cylinder.rotation = cylinderConf.rotation

  // Creacion de una esfera.
  sphere = new Sphere(sphereConf.vertex, sphereConf.rings, sphereConf.radius, sphereConf.shadeSmooth)
  scene.addObjects(sphere)

  // Linkeando los valores de la esfera
  sphere.t = sphereConf.pos
  sphere.s = sphereConf.scale
  sphere.rotation = sphereConf.rotation

  // Capturando el cursor para poder mover la camara.
  document.addEventListener('pointerlockchange', e => {
    if (document.pointerLockElement !== canvas) {
      canvas.onmousemove = null
    }
  })

  // Capturando las teclas apretadas para poder desplazar la camara.
  document.addEventListener('keydown', e => {
    keyPressed[e.key.toLowerCase()] = true
  })

  document.addEventListener('keyup', e => {
    keyPressed[e.key.toLowerCase()] = false
  })

  // Funcion para mover el pitch y yaw de la camara con el mouse.
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

  angle = 0
  face = 0
  maxAngle = 90
  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  // Controles para la camara libre
  if (keyPressed.shift) {
    cameraConf.vel = 0.4
  } else {
    cameraConf.vel = 0.2
  }
  if (keyPressed.w) {
    camera.moveForward(cameraConf.vel)
  } else if (keyPressed.s) {
    camera.moveBackward(cameraConf.vel)
  }

  if (keyPressed.d) {
    camera.moveRight(cameraConf.vel)
  } else if (keyPressed.a) {
    camera.moveLeft(cameraConf.vel)
  }

  if (keyPressed.q) {
    camera.addRoll(0.5)
  } else if (keyPressed.e) {
    camera.addRoll(-0.5)
  }
  if (keyPressed[' ']) {
    cameraConf.eye[1] += cameraConf.vel
  } else if (keyPressed.control) {
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

  // Animacion Rotacion local
  if (cubeConf.anim) {
    if (angle >= maxAngle) {
      angle = 0
      face = Math.round(Math.random() * 2)
      maxAngle = Math.round(Math.random() * 45 + 45)
    }
    cube.rotateLocal(1, face)
    angle++
  }

  // Camara
  if (cameraConf.useOrthographicCamera && camera instanceof PerspectiveCamera) {
    camera = new OrthographicCamera()

    // Linkeando los valores de la nueva camara.
    camera.eye = cameraConf.eye
    camera.center = cameraConf.center
    camera.rpy = cameraConf.rpy
  } else if (!cameraConf.useOrthographicCamera && camera instanceof OrthographicCamera) {
    camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

    // Linkeando los valores de la nueva camara.
    camera.eye = cameraConf.eye
    camera.center = cameraConf.center
    camera.rpy = cameraConf.rpy
  }
  camera.useLookAt = cameraConf.useLookAt

  // Configuracion de la camara
  if (camera instanceof PerspectiveCamera) {
    camera.setFovFromDegrees(cameraConf.fov)
  }
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
  cubeGUI.add(cubeConf, 'anim')
  let position = cubeGUI.addFolder('Position')
  position.add(cubeConf.pos, 0, -10, 10).name('X')
  position.add(cubeConf.pos, 1, -10, 10).name('Y')
  position.add(cubeConf.pos, 2, -10, 10).name('Z')
  let scale = cubeGUI.addFolder('Scale')
  scale.add(cubeConf.scale, 0, 0, 10).name('X')
  scale.add(cubeConf.scale, 1, 0, 10).name('Y')
  scale.add(cubeConf.scale, 2, 0, 10).name('Z')
  let rotate = cubeGUI.addFolder('Rotate')
  rotate.add(cubeConf.rotation, 0).name('X').listen()
  rotate.add(cubeConf.rotation, 1).name('Y').listen()
  rotate.add(cubeConf.rotation, 2).name('Z').listen()
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
  let cameraRotation = camera.addFolder('Look At')
  cameraRotation.add(cameraConf.center, 0, 0, 10).name('X')
  cameraRotation.add(cameraConf.center, 1, 0, 10).name('Y')
  cameraRotation.add(cameraConf.center, 2, 0, 10).name('Z')
}

init('c')
