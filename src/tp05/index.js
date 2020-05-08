const WebGLRender = require('./WebGL/WebGLRender')
const Scene = require('./WebGL/Scene')
const Axis = require('./Axis/Axis')
const PerspectiveCamera = require('./Camera/PerspectiveCamera')
const OrthographicCamera = require('./Camera/OrthographicCamera')
const Grid = require('./Objects/Primitives/GridFloor')
const Cube = require('./Objects/Primitives/Cube')
const Cone = require('./Objects/Primitives/Cone')
const Cylinder = require('./Objects/Primitives/Cylinder')
const Sphere = require('./Objects/Primitives/Sphere')
const DirLight = require('./Light/DirLight')
const AmbientLight = require('./Light/AmbientLight')
const PointLight = require('./Light/PointLight')
const SpotLight = require('./Light/SpotLight')
const FPSControl = require('./Control/FPSControl')
const Vec3 = require('./Utils/Vec3')

// eslint-disable-next-line no-unused-vars
const SceneObject = require('./Objects/ObjectScene')

const dat = require('dat.gui')

console.log('tp04')

// Variables utilizadas para la animacion del cubo.
let angle
let face
let maxAngle

// Objeto con las opciones de la escena.
const sceneConf = {
  colorBackground: new Vec3(0.0),
  selectedObj: null,
  enablePositionalLights: true
}

// Objeto con las opciones de la camara.
const cameraConf = {
  fov: 60,
  eye: new Vec3(0.0, 7.0, 11.0),
  center: new Vec3(),
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
  pos: new Vec3(0.0, 23.0, 0.0),
  size: 50.0,
  scale: new Vec3(1.0, 1.0, 1.0),
}

// Objeto con las opciones del cubo.
const cubeConf = {
  pos: new Vec3(-6.0, 0.0, 0.0),
  scale: new Vec3(1),
  rotation: new Vec3(),
  rotationq: [0, 0, 0, 1],
  showWireframe: false,
  useQuaternion: false,
  anim: false,
  selectable: true
}

// Objeto con las opciones del cono.
const coneConf = {
  pos: new Vec3(-2, 0, 0),
  scale: new Vec3(1),
  rotation: new Vec3(),
  vertex: 8,
  shadeSmooth: false,
  showWireframe: false,
  selectable: true
}

// Objeto con las opciones del cilindro.
const cylinderConf = {
  pos: new Vec3(2, 0, 0),
  scale: new Vec3(1),
  rotation: new Vec3(),
  segments: 16,
  shadeSmooth: true,
  showWireframe: false,
  selectable: true
}

// Objeto con las opciones de la esfera.
const sphereConf = {
  pos: new Vec3(6, 0, 0),
  scale: new Vec3(1),
  rotation: new Vec3(),
  rings: 20,
  vertex: 20,
  radius: 1,
  shadeSmooth: true,
  showWireframe: false,
  selectable: true
}

// Configuracion luz direccional
const ambientLightConf = {
  color: [255.0, 255.0, 255.0],
  intensity: 0.01
}

// Configuracion luz direccional
const direccionalLightConf = {
  direction: new Vec3(1.0, -1.0, 0.0),
  color: [255.0, 255.0, 255.0],
  intensity: 0.01
}

// Configuracion luz puntual 1
const pointLight1Conf = {
  name: 'Point Light 1',
  pos: new Vec3(-10.0, 10.0, 6.0),
  color: [255.0, 0.0, 50.0],
  intensity: 100,
  enable: true,
  showRepresentation: true
}

// Configuracion luz puntual 2
const pointLight2Conf = {
  name: 'Point Light 2',
  pos: new Vec3(10.0, 10.0, 6.0),
  color: [50.0, 0.0, 255.0],
  intensity: 100,
  enable: true,
  showRepresentation: true
}

// Configuracion luz puntual 3
const pointLight3Conf = {
  name: 'Point Light 3',
  pos: new Vec3(0.0, 10.0, -6.0),
  color: [50.0, 255.0, 50.0],
  intensity: 100,
  enable: true,
  showRepresentation: true
}

// Configuracion del Spot Light
const spotLightConf = {
  name: 'Spot Light 1',
  pos: new Vec3(0.0, 10.0, 0.0),
  color: [255.0, 255.0, 255.0],
  direction: new Vec3(0.0, -1.0, 0.0),
  maxAngle: 30,
  intensity: 100,
  enable: true,
  showRepresentation: true
}

/** @type WebGLRender */ let wegGLRender
/** @type Scene */ let scene
/** @type Grid */ let grid
/** @type Axis */ let axis
/** @type PerspectiveCamera */ let camera
/** @type Cube */ let floor
/** @type Cube */ let cube
/** @type Cone */ let cone
/** @type Sphere */ let sphere
/** @type Cylinder */ let cylinder
/** @type HTMLCanvasElement */ let canvas
/** @type FPSControl */ let control
/** @type SpotLight */ let flashlight
let Lights = []
let objects = []

const Ray = require('./Objects/Primitives/Ray')
/** @type Array<Ray> */let rays = []

console.log(
  'Controles\n' +
  '- Right click:  entrar en modo Fly.\n' +
  '- Left click:   se lanza un rayo de prueba.\n' +
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
  window.addEventListener('resize', e => {
    if (camera instanceof PerspectiveCamera) {
      camera.requireProyectionMatrixUpdate()
    }
  })

  // Creando la escena.
  scene = new Scene(sceneConf.colorBackground)

  // Creando el control de la camara.
  control = new FPSControl()

  // Linkeando los valores de la camara.
  camera.setPosition(cameraConf.eye)
  camera.setLookAt(cameraConf.center)
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
  let dirLight = new DirLight(
    direccionalLightConf.intensity,
    direccionalLightConf.direction,
    Vec3.fromArray(direccionalLightConf.color)
  )
  scene.dirLight = dirLight

  // Luz ambiental.
  let ambientLight = new AmbientLight(
    Vec3.fromArray(ambientLightConf.color),
    ambientLightConf.intensity
  )
  scene.ambientLight = ambientLight

  // Luces puntuales.
  // Luz 1
  Lights[0] = new PointLight(
    pointLight1Conf.pos,
    pointLight1Conf.intensity,
    Vec3.fromArray(pointLight1Conf.color),
    new Cube(0.25)
  )
  Lights[0].conf = pointLight1Conf
  Lights[0].enable = pointLight1Conf.enable
  scene.addPointLights(Lights[0])

  // Luz 2
  Lights[1] = new PointLight(
    pointLight2Conf.pos,
    pointLight2Conf.intensity,
    Vec3.fromArray(pointLight2Conf.color),
    new Cube(0.25)
  )
  Lights[1].conf = pointLight2Conf
  Lights[1].enable = pointLight2Conf.enable
  scene.addPointLights(Lights[1])

  // Luz 3
  Lights[2] = new PointLight(
    pointLight3Conf.pos,
    pointLight3Conf.intensity,
    Vec3.fromArray(pointLight3Conf.color),
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
    Vec3.fromArray(spotLightConf.color),
    spotLightConf.direction,
    new Cube(0.25)
  )
  Lights[3].conf = spotLightConf
  Lights[3].enable = spotLightConf.enable
  scene.addSpotLights(Lights[3])

  // Flashlight
  flashlight = new SpotLight(
    25,
    cameraConf.eye,
    100,
    new Vec3(255.0),
    new Vec3(0, -1, 0)
  )
  scene.addSpotLights(flashlight)

  for (let i = 0; i < 6; i++) {
    rays[i] = new Ray(new Vec3(), new Vec3(), 0)
    rays[i].enableRender = false
    scene.addObjects(rays[i])
  }

  // Creacion de un piso.
  floor = new Cube(floorConf.size, true)
  floor.setTraslation(floorConf.pos)
  floor.setScale(floorConf.scale)
  scene.addObjects(floor)
  floor.meshes[0].material.useTexure = true
  floor.meshes[0].material.texture.setDiffuse(require('./Textures/stone/rough_block_wall_diff_1k.jpg'))
  floor.meshes[0].material.texture.setNormal(require('./Textures/stone/rough_block_wall_nor_1k.jpg'))
  floor.meshes[0].material.texture.setRoughness(require('./Textures/stone/rough_block_wall_rough_1k.jpg'))
  floor.meshes[0].material.texture.setAO(require('./Textures/stone/rough_block_wall_ao_1k.jpg'))
  // floor.meshes[0].material.texture.setNormal(require('./Textures/stone/NormalMap.png'))

  // Creacion de un cubo.
  cube = new Cube(2)
  cube.meshes[0].material.setColor(new Vec3(1.0, 0.0, 0.0))
  cube.showLocalAxis = true
  cube.selectable = cubeConf.selectable
  scene.addObjects(cube)

  cube.conf = cubeConf
  objects.push(cube)

  // Seleccionando el cubo como el objeto activo.
  sceneConf.selectedObj = cube

  // Creacion de un cono.
  cone = new Cone(coneConf.vertex, 1, 2, coneConf.shadeSmooth)
  cone.selectable = coneConf.selectable
  cone.meshes[0].material.setColor(new Vec3(0.0, 1.0, 0.0))
  scene.addObjects(cone)

  cone.conf = coneConf
  objects.push(cone)

  // Creacion de un cilindro.
  cylinder = new Cylinder(cylinderConf.segments, 1, 2, cylinderConf.shadeSmooth)
  cylinder.meshes[0].material.setColor(new Vec3(0.0, 0.0, 1.0))
  cylinder.selectable = cylinderConf.selectable
  scene.addObjects(cylinder)

  // Linkeando los valores del cilindro
  cylinder.conf = cylinderConf
  objects.push(cylinder)

  // Creacion de una esfera.
  sphere = new Sphere(
    sphereConf.vertex,
    sphereConf.rings,
    sphereConf.radius,
    sphereConf.shadeSmooth
  )
  sphere.meshes[0].material.setColor(new Vec3(1.0, 1.0, 1.0))
  sphere.selectable = sphereConf.selectable
  scene.addObjects(sphere)

  // Linkeando los valores de la esfera
  sphere.conf = sphereConf
  objects.push(sphere)

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
    // const Ray = require('./Objects/Primitives/Ray')
    let direction = wegGLRender.rayCasting(event.clientX, event.clientY, camera)
    let position = camera.eye
    let objs = wegGLRender.getSelectedObject(position, direction, scene)

    if (objs.length === 0) {
      selectObject(null)
      return
    }

    objs = objs.sort((a, b) => {
      return a[1] - b[1]
    })

    selectObject(objs[0][0])
  })

  angle = 0
  face = 0
  maxAngle = 90
  initGUI()
  requestAnimationFrame(renderLoop)
}

function renderLoop () {
  let conf
  for (let obj of objects) {
    conf = obj.conf
    obj.setTraslation(conf.pos)
    obj.setScale(conf.scale)
    obj.setRotation(conf.rotation)
    if (conf.rotationq) {
      obj.setRotationQuaternion(conf.rotationq)
      obj.useQuaternion = conf.useQuaternion
    }
  }

  // Cubo
  cube.showWireframe(cubeConf.showWireframe)

  // Cono
  cone.showWireframe(coneConf.showWireframe)

  if (coneConf.vertex !== cone.baseVertexCount || coneConf.shadeSmooth !== cone.shadeSmooth) {
    cone.baseVertexCount = coneConf.vertex
    cone.shadeSmooth = coneConf.shadeSmooth
    cone.remesh()
  }

  // Cilindro
  cylinder.showWireframe(cylinderConf.showWireframe)

  if (cylinderConf.segments !== cylinder.segments || cylinderConf.shadeSmooth !== cylinder.shadeSmooth) {
    cylinder.segments = cylinderConf.segments
    cylinder.shadeSmooth = cylinderConf.shadeSmooth
    cylinder.remesh()
  }

  // Esfera
  sphere.showWireframe(sphereConf.showWireframe)

  if (sphereConf.rings !== sphere.rings ||
    sphereConf.shadeSmooth !== sphere.shadeSmooth ||
    sphereConf.vertex !== sphere.vertexRing
  ) {
    sphere.rings = sphereConf.rings
    sphere.shadeSmooth = sphereConf.shadeSmooth
    sphere.vertexRing = sphereConf.vertex
    sphere.remesh()
  }

  // Animacion Rotacion local
  if (cubeConf.anim) {
    if (angle >= maxAngle) {
      angle = 0
      face = Math.round(Math.random() * 2)
      maxAngle = Math.round(Math.random() * 45 + 45)
    }
    let rot = cube.rotateLocal(1, face)
    cubeConf.rotation.copy(rot)
    angle++
  }

  // Camara
  if (cameraConf.useOrthographicCamera && camera instanceof PerspectiveCamera) {
    camera = new OrthographicCamera()

    // Linkeando los valores de la nueva camara.
    camera.addPitch(control.fpsConf.rpy[1])
  } else if (!cameraConf.useOrthographicCamera && camera instanceof OrthographicCamera) {
    camera = new PerspectiveCamera(cameraConf.fov, canvas.clientWidth / canvas.clientHeight)

    // Linkeando los valores de la nueva camara.
    camera.addPitch(control.fpsConf.rpy[1])
  }
  camera.setLookAtEnable(cameraConf.useLookAt)

  // Configuracion de la camara
  if (camera instanceof PerspectiveCamera) {
    camera.setFovFromDegrees(cameraConf.fov)
  }

  camera.setPosition(cameraConf.eye)
  camera.setLookAt(cameraConf.center)

  // Controles para la camara libre
  control.updateCamera(keyPressed, camera)
  cameraConf.eye.copy(camera.eye)

  flashlight.setDirection(camera.getLookDirection())
  flashlight.setPosition(camera.eye)

  // Actualizando la grilla y los ejes.
  grid.enableRender = gridConf.enable
  axis.enableRender = gridConf.enable

  // Actualizando luces.
  // Luz ambiental.
  scene.ambientLight.setColor(Vec3.fromArray(ambientLightConf.color))
  scene.ambientLight.setIntensity(ambientLightConf.intensity)

  // Luz direccional
  scene.dirLight.setColor(Vec3.fromArray(direccionalLightConf.color))
  scene.dirLight.setIntensity(direccionalLightConf.intensity)
  scene.dirLight.setDirection(direccionalLightConf.direction)

  // Luces Posicionales.
  for (let light of Lights) {
    conf = light.conf
    light.setIntensity(conf.intensity)
    light.showRepresentation(conf.showRepresentation)
    if (conf.pos) {
      light.setPosition(conf.pos)
    }
    light.setEnable(conf.enable * sceneConf.enablePositionalLights)

    light.setColor(Vec3.fromArray(conf.color))
    if (conf.maxAngle) {
      light.setAngle(conf.maxAngle)
    }
    if (conf.direction) {
      light.setDirection(conf.direction)
    }
  }

  wegGLRender.clearBackground(scene.clearColor)
  wegGLRender.render(scene, camera)

  requestAnimationFrame(renderLoop)
}

/**
 * @param {SceneObject} obj
 */
function selectObject (obj) {
  if (sceneConf.selectedObj) {
    sceneConf.selectedObj.showLocalAxis = false
  }
  if (obj && obj !== sceneConf.selectedObj) {
    obj.showLocalAxis = true
    sceneConf.selectedObj = obj
    console.log('Now selecting ' + obj.constructor.name)
  } else if (sceneConf.selectedObj) {
    console.log('Deselecting ' + sceneConf.selectedObj.constructor.name)
    sceneConf.selectedObj = null
  }
}

// Configuracion de la GUI
function initGUI () {
  let gui = new dat.GUI()
  gui.close()
  // Grilla y Ejes
  gui.add(gridConf, 'enable').name('Show grid & axis')
  gui.add(floor.meshes[0].material.texture, 'normalStrength', 0, 1, 0.01)

  // Objectos
  let object = gui.addFolder('Objects')

  // Cubo
  let cubeGUI = object.addFolder('Cube')
  cubeGUI.add(cubeConf, 'showWireframe')
  cubeGUI.add(cubeConf, 'useQuaternion')
  cubeGUI.add(cubeConf, 'anim')
  let positionGUI = cubeGUI.addFolder('Position')
  positionGUI.add(cubeConf.pos, 'x', -10, 10).name('X')
  positionGUI.add(cubeConf.pos, 'y', -10, 10).name('Y')
  positionGUI.add(cubeConf.pos, 'z', -10, 10).name('Z')
  let scaleGUI = cubeGUI.addFolder('Scale')
  scaleGUI.add(cubeConf.scale, 'x', 0, 10).name('X')
  scaleGUI.add(cubeConf.scale, 'y', 0, 10).name('Y')
  scaleGUI.add(cubeConf.scale, 'z', 0, 10).name('Z')
  let rotateGUI = cubeGUI.addFolder('Rotate')
  rotateGUI.add(cubeConf.rotation, 'x').name('X').listen()
  rotateGUI.add(cubeConf.rotation, 'y').name('Y').listen()
  rotateGUI.add(cubeConf.rotation, 'z').name('Z').listen()
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
  positionGUI.add(coneConf.pos, 'x', -10, 10).name('X')
  positionGUI.add(coneConf.pos, 'y', -10, 10).name('Y')
  positionGUI.add(coneConf.pos, 'z', -10, 10).name('Z')
  scaleGUI = coneGUI.addFolder('Scale')
  scaleGUI.add(coneConf.scale, 'x', 0, 10).name('X')
  scaleGUI.add(coneConf.scale, 'y', 0, 10).name('Y')
  scaleGUI.add(coneConf.scale, 'z', 0, 10).name('Z')
  rotateGUI = coneGUI.addFolder('Rotate')
  rotateGUI.add(coneConf.rotation, 'x', 0, 360).name('X')
  rotateGUI.add(coneConf.rotation, 'y', 0, 360).name('Y')
  rotateGUI.add(coneConf.rotation, 'z', 0, 360).name('Z')

  // Cilindro
  let cylinderGUI = object.addFolder('Cylinder')
  cylinderGUI.add(cylinderConf, 'showWireframe')
  cylinderGUI.add(cylinderConf, 'shadeSmooth')
  cylinderGUI.add(cylinderConf, 'segments', 3, 64, 1).name('Segments')
  positionGUI = cylinderGUI.addFolder('Position')
  positionGUI.add(cylinderConf.pos, 'x', -10, 10).name('X')
  positionGUI.add(cylinderConf.pos, 'y', -10, 10).name('Y')
  positionGUI.add(cylinderConf.pos, 'z', -10, 10).name('Z')
  scaleGUI = cylinderGUI.addFolder('Scale')
  scaleGUI.add(cylinderConf.scale, 'x', 0, 10).name('X')
  scaleGUI.add(cylinderConf.scale, 'y', 0, 10).name('Y')
  scaleGUI.add(cylinderConf.scale, 'z', 0, 10).name('Z')
  rotateGUI = cylinderGUI.addFolder('Rotate')
  rotateGUI.add(cylinderConf.rotation, 'x', 0, 360).name('X')
  rotateGUI.add(cylinderConf.rotation, 'y', 0, 360).name('Y')
  rotateGUI.add(cylinderConf.rotation, 'z', 0, 360).name('Z')

  // Esfera
  let sphereGUI = object.addFolder('Sphere')
  sphereGUI.add(sphereConf, 'showWireframe')
  sphereGUI.add(sphereConf, 'shadeSmooth')
  sphereGUI.add(sphereConf, 'vertex', 3, 64, 1).name('Ring Vertex')
  sphereGUI.add(sphereConf, 'rings', 1, 64, 1).name('Rings')

  positionGUI = sphereGUI.addFolder('Position')
  positionGUI.add(sphereConf.pos, 'x', -10, 10).name('X')
  positionGUI.add(sphereConf.pos, 'y', -10, 10).name('Y')
  positionGUI.add(sphereConf.pos, 'z', -10, 10).name('Z')
  scaleGUI = sphereGUI.addFolder('Scale')
  scaleGUI.add(sphereConf.scale, 'x', 0, 10).name('X')
  scaleGUI.add(sphereConf.scale, 'y', 0, 10).name('Y')
  scaleGUI.add(sphereConf.scale, 'z', 0, 10).name('Z')
  rotateGUI = sphereGUI.addFolder('Rotate')
  rotateGUI.add(sphereConf.rotation, 'x', 0, 360).name('X')
  rotateGUI.add(sphereConf.rotation, 'y', 0, 360).name('Y')
  rotateGUI.add(sphereConf.rotation, 'z', 0, 360).name('Z')

  // Camara
  let cameraGUI = gui.addFolder('Camera')
  cameraGUI.add(cameraConf, 'fov', 0, 90)
  cameraGUI.add(cameraConf, 'useLookAt').name('Use LookAt?')
  cameraGUI.add(cameraConf, 'useOrthographicCamera')
  let cameraPositionGUI = cameraGUI.addFolder('Position')
  cameraPositionGUI.add(cameraConf.eye, 'x').name('X').listen()
  cameraPositionGUI.add(cameraConf.eye, 'y').name('Y').listen()
  cameraPositionGUI.add(cameraConf.eye, 'z').name('Z').listen()
  let cameraRotationGUI = cameraGUI.addFolder('Look At')
  cameraRotationGUI.add(cameraConf.center, 'x', -10, 10).name('X')
  cameraRotationGUI.add(cameraConf.center, 'y', -10, 10).name('Y')
  cameraRotationGUI.add(cameraConf.center, 'z', -10, 10).name('Z')

  // Luces
  let lucesGUI = gui.addFolder('Lights')

  // Luz de ambiente.
  let ambientGUI = lucesGUI.addFolder('Ambient Light')
  ambientGUI.addColor(ambientLightConf, 'color').name('Color')
  ambientGUI.add(ambientLightConf, 'intensity', 0.0, 1.0, 0.01).name('Intensity')

  // Luz direccional.
  let dirLight = lucesGUI.addFolder('Directional Light')
  dirLight.addColor(direccionalLightConf, 'color').name('Color')
  dirLight.add(direccionalLightConf, 'intensity', 0.0, 1.0, 0.01).name('Intensity')
  positionGUI = dirLight.addFolder('Direction')
  positionGUI.add(direccionalLightConf.direction, 'x', -10, 10).name('X')
  positionGUI.add(direccionalLightConf.direction, 'y', -10, 10).name('Y')
  positionGUI.add(direccionalLightConf.direction, 'z', -10, 10).name('Z')

  // Luces Posicionales
  let pointGUI = lucesGUI.addFolder('Positional Lights')
  pointGUI.add(sceneConf, 'enablePositionalLights').name('Enable All')
  let pointIGUI
  let conf
  for (let i = 0; i < Lights.length; i++) {
    conf = Lights[i].conf
    pointIGUI = pointGUI.addFolder(conf.name)
    pointIGUI.add(conf, 'intensity', 0, 100, 0.1)
    pointIGUI.add(conf, 'enable').name('Enable')
    pointIGUI.add(conf, 'showRepresentation').name('Show Cube')
    pointIGUI.addColor(conf, 'color')

    if (conf.hasOwnProperty('maxAngle')) {
      pointIGUI.add(conf, 'maxAngle', 0, 90, 0.01)
    }

    if (conf.hasOwnProperty('direction')) {
      positionGUI = pointIGUI.addFolder('Direction')
      positionGUI.add(conf.direction, 'x', -10, 10, 0.01).name('X')
      positionGUI.add(conf.direction, 'y', -10, 10, 0.01).name('Y')
      positionGUI.add(conf.direction, 'z', -10, 10, 0.01).name('Z')
    }

    let maxPos = 20

    positionGUI = pointIGUI.addFolder('Position')
    positionGUI.add(conf.pos, 'x', -maxPos, maxPos).name('X')
    positionGUI.add(conf.pos, 'y', -maxPos, maxPos).name('Y').step(0.01)
    positionGUI.add(conf.pos, 'z', -maxPos, maxPos).name('Z')
  }
}

init('c')
