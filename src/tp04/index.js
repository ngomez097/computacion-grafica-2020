const WebGLRender = require('./WebGL/WebGLRender')
const Scene = require('./WebGL/Scene')
const Axis = require('./Axis/Axis')
const PerspectiveCamera = require('./Camera/PerspectiveCamera')
const OrthographicCamera = require('./Camera/OrthographicCamera')
const Grid = require('./Objects/GridFloor')
const Cube = require('./Objects/Cube')
const Cone = require('./Objects/Cone')
const Cylinder = require('./Objects/Cylinder')
const Sphere = require('./Objects/Sphere')
const DirLight = require('./Light/DirLight')
const Line = require('./Objects/Line')
const PointLight = require('./Light/PointLight')
const SpotLight = require('./Light/SpotLight')
const FPSControl = require('./Control/FPSControl')

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
  ambientLight: [255.0, 255.0, 255.0],
  ambientLightIntensity: 0.05
}

// Objeto con las opciones de la camara.
const cameraConf = {
  fov: 60,
  eye: [0.0, 7.0, 11.0],
  center: [0, 0, 0],
  useOrthographicCamera: false,
  useLookAt: false,
}

// Objeto con la cofiguracion de la grilla.
const gridConf = {
  size: 20.0,
  gap: 1.0,
  enable: false
}

// Objeto con la cofiguracion de los ejes.
const axisConf = {
  size: 10,
  show_axis: [true, true, true]
}

// Objecto para la configuracion del piso.
const floorConf = {
  pos: [0.0, -1.5, 0.0],
  size: 50.0,
  scale: [1.0, 0.01, 1.0],
}

// Objeto con las opciones del cubo.
const cubeConf = {
  pos: [-6, 0, 0],
  scale: [1, 1, 1],
  rotation: [0.0, 0.0, 0.0],
  rotationq: [0, 0, 0, 1],
  showWireframe: false,
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
  showWireframe: false
}

// Objeto con las opciones del cilindro.
const cylinderConf = {
  pos: [2, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  segments: 16,
  shadeSmooth: true,
  showWireframe: false
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
  showWireframe: false
}

// Configuracion luz direccional
const direccionalLightConf = {
  direction: [1.0, -1.0, 0.0],
  color: [255.0, 255.0, 255.0],
  intensity: 0.05
}

// Configuracion luz puntual 1
const pointLight1Conf = {
  name: 'Point Light 1',
  pos: [-5.0, 3.0, 6.0],
  color: [255.0, 0.0, 50.0],
  intensity: 100,
  enable: true,
  showRepresentation: true
}

// Configuracion luz puntual 2
const pointLight2Conf = {
  name: 'Point Light 2',
  pos: [5.0, 3.0, 6.0],
  color: [50.0, 0.0, 255.0],
  intensity: 100,
  enable: true,
  showRepresentation: true
}

// Configuracion luz puntual 3
const pointLight3Conf = {
  name: 'Point Light 3',
  pos: [0.0, 3.0, -6.0],
  color: [50.0, 255.0, 50.0],
  intensity: 100,
  enable: true,
  showRepresentation: true
}

// Configuracion del Spot Light
const spotLightConf = {
  name: 'Spot Light 1',
  pos: [0.0, 10.0, 0.0],
  color: [255.0, 255.0, 255.0],
  direction: [0.0, -1.0, 0.0],
  maxAngle: 0.8,
  intensity: 100,
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
let Lights = []
let control

console.log(
  'Controles\n' +
  '- Right click: entrar en modo Fly.\n' +
  '- Left click: se lanza un rayo de prueba.\n' +
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
  canvas = document.getElementById(canvasName)
  wegGLRender = new WebGLRender(canvas)

  // Creacion de la camara.
  camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

  // Creando la escena.
  scene = new Scene(sceneConf.colorBackground)

  // Creando el control de la camara.
  control = new FPSControl()

  // Linkeando los valores de la camara.
  camera.eye = cameraConf.eye
  camera.center = cameraConf.center
  camera.vel = cameraConf.vel
  camera.addPitch(control.fpsConf.rpy[1])

  // Creacion de la grilla
  grid = new Grid(20)
  grid.enableRender = gridConf.enable
  scene.addObjects(grid)

  // Creacion de los ejes
  axis = new Axis(axisConf.size, axisConf.show_axis)
  axis.enableRender = gridConf.enable
  scene.addObjects(axis)

  // Insertando luces.
  // Luz direccional.
  dirLight = new DirLight(
    direccionalLightConf.intensity,
    direccionalLightConf.direction,
    vec3.scale([], direccionalLightConf.color, 1.0 / 255.0)
  )
  scene.dirLight = dirLight

  // Luz ambiental.
  scene.ambientLight = [0.01, 0.01, 0.01]

  // Luces puntuales.
  // Luz 1
  Lights[0] = new PointLight(
    pointLight1Conf.pos,
    pointLight1Conf.intensity,
    vec3.scale([], pointLight1Conf.color, 1.0 / 255.0),
    new Cube(0.25)
  )
  Lights[0].conf = pointLight1Conf
  Lights[0].enable = pointLight1Conf.enable
  scene.addPointLights(Lights[0])

  // Luz 2
  Lights[1] = new PointLight(
    pointLight2Conf.pos,
    pointLight2Conf.intensity,
    vec3.scale([], pointLight2Conf.color, 1.0 / 255.0),
    new Cube(0.25)
  )
  Lights[1].conf = pointLight2Conf
  Lights[1].enable = pointLight2Conf.enable
  scene.addPointLights(Lights[1])

  // Luz 3
  Lights[2] = new PointLight(
    pointLight3Conf.pos,
    pointLight3Conf.intensity,
    vec3.scale([], pointLight3Conf.color, 1.0 / 255.0),
    new Cube(0.25)
  )
  Lights[2].conf = pointLight3Conf
  Lights[2].enable = pointLight3Conf.enable
  scene.addPointLights(Lights[2])

  // Lampara
  Lights[3] = new SpotLight(
    spotLightConf.maxAngle,
    spotLightConf.pos,
    spotLightConf.intensity,
    spotLightConf.color,
    spotLightConf.direction,
    new Cube(0.25)
  )
  Lights[3].conf = spotLightConf
  Lights[3].enable = spotLightConf.enable
  scene.addSpotLights(Lights[3])

  // Creacion de un piso.
  let floor = new Cube(floorConf.size)
  floor.t = floorConf.pos
  floor.s = floorConf.scale
  scene.addObjects(floor)

  // Creacion de un cubo.
  cube = new Cube(2)
  cube.meshes[0].material = [1.0, 0.0, 0.0]
  cube.showLocalAxis = true
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
  cone.meshes[0].material = [0.0, 1.0, 0.0]
  cone.rotation = coneConf.rotation

  // Creacion de un cilindro.
  cylinder = new Cylinder(cylinderConf.segments, 1, 2, cylinderConf.shadeSmooth)
  cylinder.meshes[0].material = [0.0, 0.0, 1.0]
  scene.addObjects(cylinder)

  // Linkeando los valores del cilindro
  cylinder.t = cylinderConf.pos
  cylinder.s = cylinderConf.scale
  cylinder.rotation = cylinderConf.rotation

  // Creacion de una esfera.
  sphere = new Sphere(
    sphereConf.vertex,
    sphereConf.rings,
    sphereConf.radius,
    sphereConf.shadeSmooth
  )
  sphere.meshes[0].material = [1.0, 1.0, 1.0]
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
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault()
    canvas.requestPointerLock()
    canvas.onmousemove = function (event) {
      control.onMouseMove(camera, event)
    }
  })

  // Prueba del raycasting de la camara.
  canvas.addEventListener('click', event => {
    let vector = wegGLRender.rayCasting(event.clientX, event.clientY, camera)
    vec3.scale(vector, vector, 20)

    let lookDir = vec3.add([], camera.eye, vector)
    let line = new Line(
      camera.eye,
      lookDir
    )
    scene.addObjects(line)
  })

  angle = 0
  face = 0
  maxAngle = 90
  initGUI()
  requestAnimationFrame(renderLoop)
}

// Funcion para realizar la animacion.
function renderLoop () {
  // Controles para la camara libre
  control.updateCamera(keyPressed, camera)

  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene, camera)

  // Cubo
  cube.showWireframe(cubeConf.showWireframe)
  cube.useQuaternion = cubeConf.useQuaternion

  // Cono
  cone.showWireframe(coneConf.showWireframe)

  if (coneConf.vertex !== cone.baseVertexCount || coneConf.shadeSmooth !== cone.shadeSmooth) {
    cone.baseVertexCount = coneConf.vertex
    cone.shadeSmooth = coneConf.shadeSmooth
    cone.constructCone()
  }

  // Cilindro
  cylinder.showWireframe(cylinderConf.showWireframe)

  if (cylinderConf.segments !== cylinder.segments || cylinderConf.shadeSmooth !== cylinder.shadeSmooth) {
    cylinder.segments = cylinderConf.segments
    cylinder.shadeSmooth = cylinderConf.shadeSmooth
    cylinder.constructCylinder()
  }

  // Esfera
  sphere.showWireframe(sphereConf.showWireframe)

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
    camera.addPitch(control.fpsConf.rpy[1])
  } else if (!cameraConf.useOrthographicCamera && camera instanceof OrthographicCamera) {
    camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

    // Linkeando los valores de la nueva camara.
    camera.eye = cameraConf.eye
    camera.center = cameraConf.center
    camera.addPitch(control.fpsConf.rpy[1])
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
  // Luz ambiental.
  scene.ambientLight = vec3.scale([], sceneConf.ambientLight, 1.0 / 255.0)
  scene.ambientLightIntensity = sceneConf.ambientLightIntensity

  // Luz direccional
  scene.dirLight.color = vec3.scale([], direccionalLightConf.color, 1.0 / 255.0)
  scene.dirLight.intensity = direccionalLightConf.intensity

  // Luces puntuales.
  let conf
  for (let light of Lights) {
    conf = light.conf
    if (conf.enable === false) {
      if (light.intensity > 0) {
        light.intensity -= 10
      }
      light.intensity = Math.max(light.intensity, 0.0)
      if (light.intensity === 0) {
        light.enable = false
      }
    } else {
      light.enable = true
      if (light.intensity < conf.intensity) {
        light.intensity += 10
      }
      light.intensity = Math.min(light.intensity, conf.intensity)
    }

    light.representation.enableRender = conf.showRepresentation
    let color = vec3.scale([], conf.color, 1.0 / 255.0)
    if (light.representation !== null) {
      light.representation.meshes[0].material = color
    }
    light.color = color
    if (conf.hasOwnProperty('maxAngle')) {
      light.angle = conf.maxAngle
    }
  }

  requestAnimationFrame(renderLoop)
}

// Configuracion de la GUI
function initGUI () {
  let gui = new dat.GUI()
  gui.close()
  // Grilla y Ejes
  gui.add(gridConf, 'enable').name('Show grid & axis')

  // Objectos
  let object = gui.addFolder('Objects')

  // Cubo
  let cubeGUI = object.addFolder('Cube')
  cubeGUI.add(cubeConf, 'showWireframe')
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
  coneGUI.add(coneConf, 'showWireframe')
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
  cylinderGUI.add(cylinderConf, 'showWireframe')
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
  sphereGUI.add(sphereConf, 'showWireframe')
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
  let ambientGUI = lucesGUI.addFolder('Ambient Light')
  ambientGUI.addColor(sceneConf, 'ambientLight').name('Ambient Light')
  ambientGUI.add(sceneConf, 'ambientLightIntensity', 0.0, 1.0, 0.01)

  // Luz direccional.
  let dirLight = lucesGUI.addFolder('Directional Light')
  dirLight.addColor(direccionalLightConf, 'color')
  dirLight.add(direccionalLightConf, 'intensity', 0.0, 1.0, 0.01)
  positionGUI = dirLight.addFolder('Direction')
  positionGUI.add(direccionalLightConf.direction, 0, -10, 10).name('X')
  positionGUI.add(direccionalLightConf.direction, 1, -10, 10).name('Y')
  positionGUI.add(direccionalLightConf.direction, 2, -10, 10).name('Z')

  // Luces Puntuales
  let pointGUI = lucesGUI.addFolder('Positional Lights')
  let pointiGUI
  let conf
  let pointLight
  for (let i = 0; i < Lights.length; i++) {
    pointLight = Lights[i]
    conf = pointLight.conf
    pointiGUI = pointGUI.addFolder(conf.name)
    pointiGUI.add(conf, 'intensity', 0, 100, 0.1)
    pointiGUI.add(conf, 'enable').name('Enable')
    pointiGUI.add(conf, 'showRepresentation').name('Show Cube')
    pointiGUI.addColor(conf, 'color')

    if (conf.hasOwnProperty('maxAngle')) {
      pointiGUI.add(conf, 'maxAngle', 0, 0.99, 0.01)
    }

    if (conf.hasOwnProperty('direction')) {
      positionGUI = pointiGUI.addFolder('Direction')
      positionGUI.add(conf.direction, 0, -10, 10, 0.01).name('X')
      positionGUI.add(conf.direction, 1, -10, 10, 0.01).name('Y')
      positionGUI.add(conf.direction, 2, -10, 10, 0.01).name('Z')
    }

    positionGUI = pointiGUI.addFolder('Position')
    positionGUI.add(conf.pos, 0, -10, 10).name('X')
    positionGUI.add(conf.pos, 1, -10, 10).name('Y')
    positionGUI.add(conf.pos, 2, -10, 10).name('Z')
  }
}

init('c')
