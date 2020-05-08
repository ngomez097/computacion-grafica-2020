const Camera = require('../Camera/Camera')

class FPSControl {
  /**
   * Clase para manejar los controles del teclado de la camara.
   */
  constructor () {
    this.fpsConf = {
      maxVel: 0.3,
      minVel: 0.1,
      vel: 0.1,
      rpy: [0, -30, 0],
    }

    this.mouseConf = {
      sensitivityX: 0.10,
      sensitivityY: 0.10
    }
  }

  /**
   * @param {*} keyPressed
   * @param {Camera} camera
   */
  updateCamera (keyPressed, camera) {
    if (!(camera instanceof Camera)) {
      console.error('camera is not Camera')
      return
    }
    if (keyPressed.shift) {
      this.fpsConf.vel = this.fpsConf.maxVel
    } else {
      this.fpsConf.vel = this.fpsConf.minVel
    }
    if (keyPressed.w) {
      camera.moveForward(this.fpsConf.vel)
    } else if (keyPressed.s) {
      camera.moveBackward(this.fpsConf.vel)
    }
    if (keyPressed.d) {
      camera.moveRight(this.fpsConf.vel)
    } else if (keyPressed.a) {
      camera.moveLeft(this.fpsConf.vel)
    }
    if (keyPressed.q) {
      camera.addRoll(0.5)
    } else if (keyPressed.e) {
      camera.addRoll(-0.5)
    }
    if (keyPressed[' ']) {
      camera.eye.y += this.fpsConf.vel
      camera.requireViewMatrixUpdate()
    } else if (keyPressed.control) {
      camera.eye.y -= this.fpsConf.vel
      camera.requireViewMatrixUpdate()
    }
  }

  /**
   * Funcion para mover el pitch y yaw de la camara con el mouse.
   * @param {Camera} camera La camara a mover.
   * @param {*} event El evento del click del mouse.
   */
  onMouseMove (camera, event) {
    if (!(camera instanceof Camera)) {
      console.error('camera is not Camera')
      return
    }
    let auxX
    let auxY

    auxX = event.movementX * this.mouseConf.sensitivityX
    auxY = event.movementY * this.mouseConf.sensitivityY

    if (this.fpsConf.rpy[1] - auxY > 89.0) {
      this.fpsConf.rpy[1] = 89.0
    } else if (this.fpsConf.rpy[1] - auxY < -89.0) {
      this.fpsConf.rpy[1] = -89.0
    } else {
      if (auxY !== 0) {
        camera.addPitch(-auxY)
        this.fpsConf.rpy[1] -= auxY
      }
    }
    if (auxX !== 0) {
      camera.addYaw(-auxX)
    }
  }
}

module.exports = FPSControl
