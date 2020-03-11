const regl = require('regl')()
const { mat4, quat } = require('gl-matrix')

class MatrixStack {
  constructor () {
    this.stack = []
    this.identity = mat4.create()

    this.reset()
  }

  reset () {
    this.stack.length = 0

    mat4.identity(this.identity)
    this.stack.push(this.identity)
  }

  push (matrix) {
    return this.stack.push(matrix)
  }

  pop () {
    return this.stack.pop()
  }

  getCurrent () {
    return this.stack[this.stack.length - 1]
  }
}

const matrixStack = new MatrixStack()

const sceneHierarchy = {
  body: {
    translate: [0.2, 0, 0],
    rotate: [0, 0, 30],
    leftArm: {
      translate: [0.1, 0, 0],
      rotate: [0, 0, 30]
    },
    rightArm: {
      translate: [-0.1, 0, 0],
      rotate: [0, 0, -30]
    },
    leftLeg: {
      translate: [0.07, -0.3, 0],
      rotate: [0, 0, 20]
    },
    rightLeg: {
      translate: [-0.07, -0.3, 0],
      rotate: [0, 0, -20]
    }

  }
}

const drawLine = regl({
  vert: `
  precision mediump float;

  attribute vec3 position;

  uniform mat4 model;

  void main () {
    gl_Position = model * vec4(position, 1);
  }
  `,

  frag: `
  precision mediump float;

  uniform vec3 color;

  void main () {
    gl_FragColor = vec4(color, 1);
  }
  `,

  uniforms: {
    color: regl.prop('color'),
    model: regl.prop('model')
  },

  attributes: {
    position: [
      [0, -0.2, 0],
      [0, 0.2, 0]
    ],
  },

  elements: [
    [0, 1],
  ],

  primitive: 'lines'
})

const clearOptions = {
  color: [0.2, 0.2, 0.2, 1],
  depth: 1,
}

const color = [1, 1, 0]

let localMatrix = mat4.create()
const trQuat = quat.create()

regl.frame((context) => {
  regl.clear(clearOptions)

  // See https://msdn.microsoft.com/en-us/library/windows/desktop/bb147181(v=vs.85).aspx
  const { body } = sceneHierarchy
  quat.fromEuler(trQuat, body.rotate[0], body.rotate[1], body.rotate[2])
  mat4.fromRotationTranslation(localMatrix, trQuat, body.translate)
  mat4.multiply(localMatrix, matrixStack.getCurrent(), localMatrix)

  matrixStack.push(mat4.clone(localMatrix))
  drawLine({ model: matrixStack.getCurrent(), color })

  // draw body parts relative to body's world position
  {
    const { rightArm, rightLeg, leftArm, leftLeg } = body

    quat.fromEuler(trQuat, leftArm.rotate[0], leftArm.rotate[1], leftArm.rotate[2])
    mat4.fromRotationTranslation(localMatrix, trQuat, leftArm.translate)
    mat4.multiply(localMatrix, matrixStack.getCurrent(), localMatrix)

    matrixStack.push(mat4.clone(localMatrix))
    drawLine({ model: matrixStack.getCurrent(), color: [0, 1, 1] })
    // eslint-disable-next-line
    {
      // draw left hand relative to left arm's world position
    }
    matrixStack.pop()

    quat.fromEuler(trQuat, rightArm.rotate[0], rightArm.rotate[1], rightArm.rotate[2])
    mat4.fromRotationTranslation(localMatrix, trQuat, rightArm.translate)
    mat4.multiply(localMatrix, matrixStack.getCurrent(), localMatrix)

    matrixStack.push(mat4.clone(localMatrix))
    drawLine({ model: matrixStack.getCurrent(), color: [1, 0, 1] })
    matrixStack.pop()

    quat.fromEuler(trQuat, rightLeg.rotate[0], rightLeg.rotate[1], rightLeg.rotate[2])
    mat4.fromRotationTranslation(localMatrix, trQuat, rightLeg.translate)
    mat4.multiply(localMatrix, matrixStack.getCurrent(), localMatrix)

    matrixStack.push(mat4.clone(localMatrix))
    drawLine({ model: matrixStack.getCurrent(), color: [1, 0, 1] })
    matrixStack.pop()

    quat.fromEuler(trQuat, leftLeg.rotate[0], leftLeg.rotate[1], leftLeg.rotate[2])
    mat4.fromRotationTranslation(localMatrix, trQuat, leftLeg.translate)
    mat4.multiply(localMatrix, matrixStack.getCurrent(), localMatrix)

    matrixStack.push(mat4.clone(localMatrix))
    drawLine({ model: matrixStack.getCurrent(), color: [0, 1, 1] })
    matrixStack.pop()
  }

  matrixStack.pop() // pops body matrix
})
