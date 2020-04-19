const WebGLRender = require('./WebGL/WebGLRender')
const Scene = require('./WebGL/Scene')
const Axis = require('./Objects/Axis')
const Mesh = require('./Objects/Mesh')
const PerspectiveCamera = require('./Camera/PerspectiveCamera')
const OrthographicCamera = require('./Camera/OrthographicCamera')
const Grid = require('./Objects/GridFloor')
const Cube = require('./Objects/Cube')
const Cone = require('./Objects/Cone')
const Cylinder = require('./Objects/Cylinder')
const Sphere = require('./Objects/Sphere')
const DirLight = require('./Light/DirLight')
const PointLight = require('./Light/PointLight')

const vec3 = require('gl-matrix/vec3')
const dat = require('dat.gui')

console.log('tp04')

// Variables utilizadas para la animacion del cubo.
let angle
let face
let maxAngle

// Objeto con las opciones de la escena.
const sceneConf = {
  colorBackground: [0.0, 0.0, 0.0],
  ambientLight: [0.01, 0.01, 0.01]
}

// Objeto con las opciones de la camara.
const cameraConf = {
  fov: 60,
  eye: [0.0, 7.0, 11.0],
  center: [0, 0, 0],
  rpy: [0, -30, 0],
  useOrthographicCamera: false,
  useLookAt: false,
  vel: 0.2
}

// Objeto con la cofiguracion de la grilla.
const gridConf = {
  size: 20.0,
  gap: 1.0,
  enable: true
}

// Objeto con la cofiguracion de los ejes.
const axisConf = {
  size: 10,
  show_axis: [true, true, true]
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
  segments: 16,
  shadeSmooth: true,
  isWireframe: false
}

// Objeto con las opciones de la esfera.
const sphereConf = {
  pos: [6, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  rings: 16,
  vertex: 16,
  radius: 1,
  shadeSmooth: true,
  isWireframe: false
}

// Configuracion luz puntual 1
const direccionalLightConf = {
  direction: [0.0, -1.0, 0.0],
  color: [10.0, 25.0, 10.0]
}

// Configuracion luz puntual 1
const pointLight1Conf = {
  pos: [-5.0, 3.0, 5.0],
  color: [255.0, 100.0, 60.0],
  intensity: 20,
  enable: true,
  showRepresentation: true
}

// Configuracion luz puntual 2
const pointLight2Conf = {
  pos: [5.0, 3.0, 5.0],
  color: [80.0, 150.0, 255.0],
  intensity: 20,
  enable: true,
  showRepresentation: true
}

let wegGLRender
let scene
let grid
let axis
let dirLight
let camera
let cube
let cone
let sphere
let cylinder
let canvas
let pointLights = []

console.log(
  'Controles\n' +
  '- Click: entrar en modo Fly.\n' +
  '- w / s:        mover hacia al frente / atras de la camara.\n' +
  '- a / d:        mover hacia la izquierda / derecha de la camara.\n' +
  '- Space / Ctrl: subir / bajar la camara.\n' +
  '- q / e:        Roll de la camara.\n' +
  '- Hold shift:   mover mas rapido la camara.\n'
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

  // Creando la escena.
  scene = new Scene(sceneConf.colorBackground)

  // Linkeando los valores de la camara.
  camera.eye = cameraConf.eye
  camera.center = cameraConf.center
  camera.vel = cameraConf.vel
  camera.addPitch(cameraConf.rpy[1])

  // Creacion de la grilla
  grid = new Grid(20)
  scene.addObjects(grid)

  // Creacion de los ejes
  axis = new Axis(axisConf.size, axisConf.show_axis)
  scene.addObjects(axis)

  // Insertando luces.
  // Luz direccional.
  dirLight = new DirLight(
    direccionalLightConf.direction,
    vec3.scale([], direccionalLightConf.color, 1.0 / 255.0)
  )
  scene.dirLight = dirLight

  // Luz ambiental.
  scene.ambientLight = [0.01, 0.01, 0.01]

  // Luces puntuales.
  // Luz 1
  pointLights[0] = new PointLight(
    pointLight1Conf.pos,
    pointLight1Conf.intensity,
    vec3.scale([], pointLight1Conf.color, 1.0 / 255.0),
    new Cube(0.25)
  )
  pointLights[0].conf = pointLight1Conf
  scene.addPointLights(pointLights[0])

  // Luz 2
  pointLights[1] = new PointLight(
    pointLight2Conf.pos,
    pointLight2Conf.intesity,
    vec3.scale([], pointLight2Conf.color, 1.0 / 255.0),
    new Cube(0.25)
  )
  pointLights[1].conf = pointLight2Conf
  scene.addPointLights(pointLights[1])

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

  // Actualizando la grilla y los ejes.
  grid.enableRender = gridConf.enable
  axis.enableRender = gridConf.enable

  // Actualizando luces.
  scene.ambientLight = vec3.scale([], sceneConf.ambientLight, 1.0 / 255.0)

  // Luz direccional
  scene.dirLight.color = vec3.scale([], direccionalLightConf.color, 1.0 / 255.0)

  // Luces puntuales.
  let conf
  for (let pointLight of pointLights) {
    conf = pointLight.conf
    pointLight.intensity = conf.intensity
    pointLight.enable = conf.enable
    pointLight.representation.enableRender = conf.showRepresentation
    let color = vec3.scale([], conf.color, 1.0 / 255.0)
    pointLight.representation.meshes[0].material = color
    pointLight.color = color
  }

  requestAnimationFrame(renderLoop)
}

function initGUI () {
  let gui = new dat.GUI()
  // Grilla y Ejes
  gui.add(gridConf, 'enable').name('Show grid & axis')

  // Objectos
  let object = gui.addFolder('Objects')

  // Cubo
  let cubeGUI = object.addFolder('Cube')
  cubeGUI.add(cubeConf, 'isWireframe')
  cubeGUI.add(cubeConf, 'useQuaternion')
  cubeGUI.add(cubeConf, 'anim')
  let positionGUI = cubeGUI.addFolder('Position')
  positionGUI.add(cubeConf.pos, 0, -10, 10).name('X')
  positionGUI.add(cubeConf.pos, 1, -10, 10).name('Y')
  positionGUI.add(cubeConf.pos, 2, -10, 10).name('Z')
  let scaleGUI = cubeGUI.addFolder('Scale')
  scaleGUI.add(cubeConf.scale, 0, 0, 10).name('X')
  scaleGUI.add(cubeConf.scale, 1, 0, 10).name('Y')
  scaleGUI.add(cubeConf.scale, 2, 0, 10).name('Z')
  let rotateGUI = cubeGUI.addFolder('Rotate')
  rotateGUI.add(cubeConf.rotation, 0).name('X').listen()
  rotateGUI.add(cubeConf.rotation, 1).name('Y').listen()
  rotateGUI.add(cubeConf.rotation, 2).name('Z').listen()
  let rotateQGUI = cubeGUI.addFolder('RotateQuaternion')
  rotateQGUI.add(cubeConf.rotationq, 0, 0, 1).name('X')
  rotateQGUI.add(cubeConf.rotationq, 1, 0, 1).name('Y')
  rotateQGUI.add(cubeConf.rotationq, 2, 0, 1).name('Z')
  rotateQGUI.add(cubeConf.rotationq, 3, 0, 10).name('W')

  // Cono
  let coneGUI = object.addFolder('Cone')
  coneGUI.add(coneConf, 'isWireframe')
  coneGUI.add(coneConf, 'shadeSmooth')
  coneGUI.add(coneConf, 'vertex', 3, 64, 1).name('Base Vertex')
  positionGUI = coneGUI.addFolder('Position')
  positionGUI.add(coneConf.pos, 0, -10, 10).name('X')
  positionGUI.add(coneConf.pos, 1, -10, 10).name('Y')
  positionGUI.add(coneConf.pos, 2, -10, 10).name('Z')
  scaleGUI = coneGUI.addFolder('Scale')
  scaleGUI.add(coneConf.scale, 0, 0, 10).name('X')
  scaleGUI.add(coneConf.scale, 1, 0, 10).name('Y')
  scaleGUI.add(coneConf.scale, 2, 0, 10).name('Z')
  rotateGUI = coneGUI.addFolder('Rotate')
  rotateGUI.add(coneConf.rotation, 0, 0, 360).name('X')
  rotateGUI.add(coneConf.rotation, 1, 0, 360).name('Y')
  rotateGUI.add(coneConf.rotation, 2, 0, 360).name('Z')

  // Cilindro
  let cylinderGUI = object.addFolder('Cylinder')
  cylinderGUI.add(cylinderConf, 'isWireframe')
  cylinderGUI.add(cylinderConf, 'shadeSmooth')
  cylinderGUI.add(cylinderConf, 'segments', 3, 64, 1).name('Segments')
  positionGUI = cylinderGUI.addFolder('Position')
  positionGUI.add(cylinderConf.pos, 0, -10, 10).name('X')
  positionGUI.add(cylinderConf.pos, 1, -10, 10).name('Y')
  positionGUI.add(cylinderConf.pos, 2, -10, 10).name('Z')
  scaleGUI = cylinderGUI.addFolder('Scale')
  scaleGUI.add(cylinderConf.scale, 0, 0, 10).name('X')
  scaleGUI.add(cylinderConf.scale, 1, 0, 10).name('Y')
  scaleGUI.add(cylinderConf.scale, 2, 0, 10).name('Z')
  rotateGUI = cylinderGUI.addFolder('Rotate')
  rotateGUI.add(cylinderConf.rotation, 0, 0, 360).name('X')
  rotateGUI.add(cylinderConf.rotation, 1, 0, 360).name('Y')
  rotateGUI.add(cylinderConf.rotation, 2, 0, 360).name('Z')

  // Esfera
  let sphereGUI = object.addFolder('Sphere')
  sphereGUI.add(sphereConf, 'isWireframe')
  sphereGUI.add(sphereConf, 'shadeSmooth')
  sphereGUI.add(sphereConf, 'vertex', 3, 64, 1).name('Ring Vertex')
  sphereGUI.add(sphereConf, 'rings', 1, 64, 1).name('Rings')

  positionGUI = sphereGUI.addFolder('Position')
  positionGUI.add(sphereConf.pos, 0, -10, 10).name('X')
  positionGUI.add(sphereConf.pos, 1, -10, 10).name('Y')
  positionGUI.add(sphereConf.pos, 2, -10, 10).name('Z')
  scaleGUI = sphereGUI.addFolder('Scale')
  scaleGUI.add(sphereConf.scale, 0, 0, 10).name('X')
  scaleGUI.add(sphereConf.scale, 1, 0, 10).name('Y')
  scaleGUI.add(sphereConf.scale, 2, 0, 10).name('Z')
  rotateGUI = sphereGUI.addFolder('Rotate')
  rotateGUI.add(sphereConf.rotation, 0, 0, 360).name('X')
  rotateGUI.add(sphereConf.rotation, 1, 0, 360).name('Y')
  rotateGUI.add(sphereConf.rotation, 2, 0, 360).name('Z')

  // Camara
  let cameraGUI = gui.addFolder('Camera')
  cameraGUI.add(cameraConf, 'fov', 0, 90)
  cameraGUI.add(cameraConf, 'useLookAt').name('Use LookAt?')
  cameraGUI.add(cameraConf, 'useOrthographicCamera')
  let cameraPositionGUI = cameraGUI.addFolder('Position')
  cameraPositionGUI.add(cameraConf.eye, 0).name('X').listen()
  cameraPositionGUI.add(cameraConf.eye, 1).name('Y').listen()
  cameraPositionGUI.add(cameraConf.eye, 2).name('Z').listen()
  let cameraRotationGUI = cameraGUI.addFolder('Look At')
  cameraRotationGUI.add(cameraConf.center, 0, 0, 10).name('X')
  cameraRotationGUI.add(cameraConf.center, 1, 0, 10).name('Y')
  cameraRotationGUI.add(cameraConf.center, 2, 0, 10).name('Z')

  // Luces
  let lucesGUI = gui.addFolder('Lights')

  // Luz de ambiente.
  lucesGUI.addColor(sceneConf, 'ambientLight').name('Ambient Light')

  // Luz direccional.
  let dirLight = lucesGUI.addFolder('Directional Light')
  dirLight.addColor(direccionalLightConf, 'color')
  positionGUI = dirLight.addFolder('Direction')
  positionGUI.add(direccionalLightConf.direction, 0, -10, 10).name('X')
  positionGUI.add(direccionalLightConf.direction, 1, -10, 10).name('Y')
  positionGUI.add(direccionalLightConf.direction, 2, -10, 10).name('Z')

  // Luces Puntuales
  let pointGUI = lucesGUI.addFolder('Point Lights')

  // Luz puntual 1
  let point1GUI = pointGUI.addFolder('Point Light 1')
  point1GUI.add(pointLight1Conf, 'intensity', 0, 100, 0.1)
  point1GUI.add(pointLight1Conf, 'enable').name('Enable')
  point1GUI.add(pointLight1Conf, 'showRepresentation').name('Show Cube')
  point1GUI.addColor(pointLight1Conf, 'color')
  positionGUI = point1GUI.addFolder('Position')
  positionGUI.add(pointLight1Conf.pos, 0, -10, 10).name('X')
  positionGUI.add(pointLight1Conf.pos, 1, -10, 10).name('Y')
  positionGUI.add(pointLight1Conf.pos, 2, -10, 10).name('Z')

  // Luz puntual 2
  let point2GUI = pointGUI.addFolder('Point Light 2')
  point2GUI.add(pointLight2Conf, 'intensity', 0, 100, 0.1)
  point2GUI.add(pointLight2Conf, 'enable').name('Enable')
  point2GUI.add(pointLight2Conf, 'showRepresentation').name('Show Cube')
  point2GUI.addColor(pointLight2Conf, 'color')
  positionGUI = point2GUI.addFolder('Position')
  positionGUI.add(pointLight2Conf.pos, 0, -10, 10).name('X')
  positionGUI.add(pointLight2Conf.pos, 1, -10, 10).name('Y')
  positionGUI.add(pointLight2Conf.pos, 2, -10, 10).name('Z')
}

init('c')
