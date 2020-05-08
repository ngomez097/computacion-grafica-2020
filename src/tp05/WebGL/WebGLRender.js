const webGLUtil = require('./WebGLUtil')
const PerspectiveCamera = require('../Camera/PerspectiveCamera')
const Geometry = require('../Objects/Geometry')
const Vec3 = require('../Utils/Vec3')
const Mesh = require('../Objects/Mesh')
const Scene = require('./Scene')
const Camera = require('../Camera/Camera')

const mat4 = require('gl-matrix/mat4')

class WebGLRender {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    if (canvas == null) {
      alert('there is no canvas on this page')
      return
    }
    let posibleWebGL = ['webgl',
      'experimental-webgl',
      'webkit-3d',
      'moz-webgl'
    ]
    this._gl = null
    for (let name of posibleWebGL) {
      this._gl = canvas.getContext(name)
      if (this._gl) {
        break
      }
    }
    this.shaderAttributes = []
    this.initWebGL()
  }

  initWebGL () {
    if (this.prg != null) {
      return
    }
    this.prg = this._gl.createProgram()

    this.initShader('./Shaders/vertex-shader.glsl', this._gl.VERTEX_SHADER)
    this.initShader('./Shaders/fragment-shader.glsl', this._gl.FRAGMENT_SHADER)

    this._gl.linkProgram(this.prg)

    if (!this._gl.getProgramParameter(this.prg, this._gl.LINK_STATUS)) {
      console.error(this._gl.getProgramInfoLog(this.prg))
    }

    this._gl.useProgram(this.prg)
    this._gl.enable(this._gl.DEPTH_TEST)
    this._gl.enable(this._gl.CULL_FACE)
    this._gl.cullFace(this._gl.BACK)

    // Obteniendo las ubicaciones de las variables.
    this.shaderAttributes['a_VertexPosition'] = this._gl.getAttribLocation(this.prg, 'a_VertexPosition')
    this.shaderAttributes['a_VertexNormal'] = this._gl.getAttribLocation(this.prg, 'a_VertexNormal')
    this.shaderAttributes['a_TextureCoordinates'] = this._gl.getAttribLocation(this.prg, 'a_TextureCoordinates')
    this.shaderAttributes['a_VertexTangent'] = this._gl.getAttribLocation(this.prg, 'a_VertexTangent')

    webGLUtil.storeUniformsLocation(this._gl, this.prg, this.shaderAttributes, [
      'u_MVMatrix', 'u_MVInverseTransposeMatrix', 'u_VMatrix', 'u_PMatrix', 'u_ambientLight',
      'material.u_Color', 'u_eyes_position', 'u_ambientLightIntensity', 'material.u_UseNormal',
      'u_numPointLights', 'u_numSpotLights', 'u_dirLight.dir', 'u_dirLight.color', 'u_dirLight.intensity',
      'material.u_useTexture', 'material.u_textureDiffuse', 'material.u_textureNormal', 'material.u_normalStrength',
      'material.u_textureAO', 'material.u_textureRoughness'
    ])

    this._gl.uniform1i(this.shaderAttributes['material.u_textureDiffuse'], 0)
    this._gl.uniform1i(this.shaderAttributes['material.u_textureNormal'], 1)
    this._gl.uniform1i(this.shaderAttributes['material.u_textureAO'], 2)
    this._gl.uniform1i(this.shaderAttributes['material.u_textureRoughness'], 3)

    for (let i = 0; i < 32; i++) {
      webGLUtil.storeUniformsLocation(this._gl, this.prg, this.shaderAttributes, [
        `u_pointLights[${i}].pos`, `u_pointLights[${i}].color`, `u_pointLights[${i}].intensity`,
        `u_spotLights[${i}].angle`, `u_spotLights[${i}].pos`, `u_spotLights[${i}].color`,
        `u_spotLights[${i}].intensity`, `u_spotLights[${i}].dir`
      ])
    }
  }

  initShader (pathShader, type) {
    const source = require('' + pathShader)
    let shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)

    let message = this._gl.getShaderInfoLog(shader)

    if (message.length > 0) {
      /* message may be an error or a warning */
      console.error(pathShader, message)
    }

    this._gl.attachShader(this.prg, shader)
  }

  drawElementsTriangle (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.TRIANGLES, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  drawElementsLineLoop (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.LINE_LOOP, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  drawElementsLines (indexArray) {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
    this._gl.drawElements(this._gl.LINES, indexArray.length, this._gl.UNSIGNED_SHORT, 0)
  }

  /**
   * @param {Vec3} color
   */
  clearBackground (color) {
    webGLUtil.resizeCanvas(this._gl)
    webGLUtil.paintBackground(this._gl, color)
  }

  /**
   *  Funcion para calcular la direccion de un rayo desde la camara
   * con respecto a un punto en la pantalla.
   * @param {Number} x Posicion x de la pantalla.
   * @param {Number} y Posicion y de la pantalla.
   * @param {Camera} camera Camara de la cual calcular el rayo.
   */
  rayCasting (x, y, camera) {
    if (!(camera instanceof Camera)) {
      console.error('camera is not Camera')
      return
    }

    let matP = camera.getProjectionMatrix()
    let matV = camera.getViewMatrix()
    let canvas = this._gl.canvas
    let aux = []

    mat4.invert(matP, matP)
    mat4.invert(matV, matV)

    let nx = 2.0 * x / canvas.clientWidth - 1.0
    let ny = 1.0 - 2.0 * y / canvas.clientHeight
    let vector = [nx, ny, -1.0, 0.0]

    mat4.multiply(aux, matP, vector)
    vector = [aux[0], aux[1], -1.0, 0.0]

    mat4.multiply(aux, matV, vector)
    let vec = new Vec3(aux[0], aux[1], aux[2])

    return vec.normalize()
  }

  /**
   * @param {Vec3} position
   * @param {Vec3} direction
   * @param {Scene} scene
   */
  getSelectedObject (position, direction, scene) {
    if (!(scene instanceof Scene)) {
      console.error('scene is not Scene')
      return
    }

    let transformMat
    let aux = []
    let normal
    let geometry
    let vertices
    let edge
    let faces
    let i, j, nextJ
    let vertexToPoint
    let auxDot
    let isOutSide = true
    let vp, wp, t, P
    let rayToPlane
    let v1, v2
    let out = []

    // Iterando sobre los objetos de la escena
    for (let obj of scene.objects) {
      if (!obj.selectable) {
        continue
      }
      transformMat = obj.getModelMatrix()
      // Iterar sobre la maya si eso es lo que se utiliza como bounding.
      if (obj.useMeshAsBounding) {
        // Iterando sobre las mayas.
        for (let mesh of obj.meshes) {
          geometry = mesh.geometry
          faces = geometry.faces
          for (i = 0; i < faces.length; i += 3) {
            vertices = geometry.getVertices(faces[i], faces[i + 1], faces[i + 2])

            // Trasladar los vertices.
            mat4.multiply(aux, transformMat, vertices[0].toArray().concat(1))
            vertices[0] = new Vec3(aux[0], aux[1], aux[2])

            mat4.multiply(aux, transformMat, vertices[1].toArray().concat(1))
            vertices[1] = new Vec3(aux[0], aux[1], aux[2])

            mat4.multiply(aux, transformMat, vertices[2].toArray().concat(1))
            vertices[2] = new Vec3(aux[0], aux[1], aux[2])

            // Obtener la normal del triangulo.
            // Se calcula nuevamente porque se requiere que no sea smooth.
            v1 = vertices[1].sub(vertices[0])
            v2 = vertices[2].sub(vertices[0])
            normal = v1.cross(v2).normalize()

            rayToPlane = vertices[0].sub(position)

            /* const Ray = require('../Objects/Primitives/Ray')
            let ray = new Ray(vertices[0], normal, 0.5, [1.0, 1.0, 1.0])
            scene.addObjects(ray)
            ray = new Ray(vertices[1], normal, 0.5, [1.0, 1.0, 1.0])
            scene.addObjects(ray)
            ray = new Ray(vertices[2], normal, 0.5, [1.0, 1.0, 1.0])
            scene.addObjects(ray) */

            vp = direction.dot(normal)
            if (vp > -1e-16) {
              continue
            }

            wp = rayToPlane.dot(normal)
            t = wp / vp

            if (t > 1e-16) {
              isOutSide = false
              P = position.add(direction.scale(t))
              for (j = 0; j < 3; j++) {
                nextJ = (j + 1) % 3
                edge = vertices[nextJ].sub(vertices[j])
                vertexToPoint = P.sub(vertices[j])
                auxDot = normal.dot(edge.cross(vertexToPoint))

                if (auxDot < 0) {
                  isOutSide = true
                  break
                }
              }
              if (!isOutSide) {
                break
              }
            }
          }
          if (!isOutSide) {
            out.push([obj, t])
            break
          }
        }
      }
    }
    return out
  }

  /**
   * Metodo para dibjur en el canvas la escena.
   * @param {Scene} scene Escena a dibujar.
   * @param {Camera} camera Camara donde se dibujara.
   */
  render (scene, camera) {
    if (!(camera instanceof Camera)) {
      console.error('camera is not Camera')
      return
    }
    if (!(scene instanceof Scene)) {
      console.error('scene is not Scene')
      return
    }

    // Establecer la relacion de aspecto de la camara
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight
    }

    let ModelMatrix
    let InvertseTransposeModelMatrix
    let vertices
    let faces
    let normals
    let buffer
    let geometry

    // Se establece la matriz de proyeccion
    if (camera.PMNeedRenderUpdate) {
      let PMatrix = camera.getProjectionMatrix()
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_PMatrix'], PMatrix)
      camera.PMNeedRenderUpdate = false
    }

    // Se establece las propiedades de la camara
    if (camera.VMNeedRenderUpdate) {
      let VMatrix = camera.getViewMatrix()
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_VMatrix'], VMatrix)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_eyes_position'], camera.eye)
      camera.VMNeedRenderUpdate = false
    }

    /* Se establece las luces. */
    // Luz de ambiente.
    if (scene.ambientLight !== null && scene.ambientLight.needRenderUpdate) {
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_ambientLight'], scene.ambientLight.color)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_ambientLightIntensity'], scene.ambientLight.intensity)
    }

    // Luz directa.
    if (scene.dirLight !== null && scene.dirLight.needRenderUpdate) {
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_dirLight.dir'], scene.dirLight.direction)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_dirLight.color'], scene.dirLight.color)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_dirLight.intensity'], scene.dirLight.intensity)
      scene.dirLight.needRenderUpdate = false
    }

    // Luces puntuales
    let numLights = 0
    for (let pointLight of scene.pointLights) {
      if (pointLight.needRenderUpdate === false) {
        numLights++
        continue
      }
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_pointLights[${numLights}].pos`], pointLight.position)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_pointLights[${numLights}].color`], pointLight.color)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_pointLights[${numLights}].intensity`], pointLight.intensity * pointLight.enable)
      pointLight.needRenderUpdate = false
      numLights++
    }
    webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_numPointLights'], numLights, true)

    // Luces Spot
    numLights = 0
    for (let spotLight of scene.spotLights) {
      if (spotLight.needRenderUpdate === false) {
        numLights++
        continue
      }
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_spotLights[${numLights}].angle`], spotLight.angle)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_spotLights[${numLights}].pos`], spotLight.position)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_spotLights[${numLights}].color`], spotLight.color)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_spotLights[${numLights}].intensity`], spotLight.intensity * spotLight.enable)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes[`u_spotLights[${numLights}].dir`], spotLight.direction)
      spotLight.needRenderUpdate = false
      numLights++
    }
    webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_numSpotLights'], numLights, true)

    // Dibujar los objetos
    for (let object of scene.objects) {
      if (object.enableRender === false) {
        continue
      }
      ModelMatrix = object.getModelMatrix()
      InvertseTransposeModelMatrix = object.getInverseTransposeMatrix(ModelMatrix)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_MVMatrix'], ModelMatrix)
      webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['u_MVInverseTransposeMatrix'], InvertseTransposeModelMatrix)

      // Dibujando cada malla del objeto.
      let meshes = [...object.meshes]
      if (object.showLocalAxis) {
        meshes = meshes.concat(object.localAxisRepresentation.meshes)
      }

      for (let mesh of meshes) {
        geometry = mesh.geometry
        if (mesh.renderType === Mesh.RENDER_TYPE.LINES) {
          faces = geometry.wireframeFaces
        } else {
          faces = geometry.faces
        }

        // Texturas
        if (mesh.material.useTexure) {
          let texture = mesh.material.texture
          if (texture.textureHasChanged) {
            buffer = webGLUtil.bindNewFloatArrayBuffer(this._gl, geometry.coordinates, this.shaderAttributes['a_TextureCoordinates'], 2)
            geometry.coordinatesBuffer = buffer

            buffer = webGLUtil.createTexture(this._gl, texture.diffuseTextureSrc)
            texture.diffuseTexture = buffer

            if (texture.normalTextureSrc) {
              buffer = webGLUtil.bindNewFloatArrayBuffer(this._gl, geometry.tangents, this.shaderAttributes['a_VertexTangent'])
              geometry.tangentsBuffer = buffer

              texture.normalTexture = webGLUtil.createTexture(this._gl, texture.normalTextureSrc)
            }

            if (texture.AOTextureSrc) {
              texture.AOTexture = webGLUtil.createTexture(this._gl, texture.AOTextureSrc)
            }

            if (texture.roughnessTextureSrc) {
              texture.roughnessTexture = webGLUtil.createTexture(this._gl, texture.roughnessTextureSrc)
            }

            texture.textureHasChanged = false
          } else {
            webGLUtil.bindFloatArrayBuffer(this._gl, geometry.coordinatesBuffer, this.shaderAttributes['a_TextureCoordinates'], 2)
            if (texture.tangentsBuffer) {
              webGLUtil.bindFloatArrayBuffer(this._gl, geometry.tangentsBuffer, this.shaderAttributes['a_VertexTangent'], 2)
            }
          }

          webGLUtil.bindTexture(this._gl, texture.diffuseTexture, this._gl.TEXTURE0)
          if (texture.normalTexture) {
            webGLUtil.bindTexture(this._gl, texture.normalTexture, this._gl.TEXTURE1)
            webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['material.u_normalStrength'], texture.normalStrength)
          }

          if (texture.AOTexture) {
            webGLUtil.bindTexture(this._gl, texture.AOTexture, this._gl.TEXTURE2)
          }

          if (texture.roughnessTexture) {
            webGLUtil.bindTexture(this._gl, texture.roughnessTexture, this._gl.TEXTURE3)
          }

          webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['material.u_useTexture'], true)
        } else {
          webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['material.u_useTexture'], false)
        }

        if (mesh.geometry.hasChanged) {
          vertices = mesh.geometry.vertices
          normals = mesh.geometry.normals
          if (mesh.geometry.type === Geometry.TYPE['2D']) {
            buffer = webGLUtil.bindNewFloatArrayBuffer(this._gl, vertices, this.shaderAttributes['a_VertexPosition'], 2)
            mesh.geometry.verticesBuffer = buffer
          } else {
            buffer = webGLUtil.bindNewFloatArrayBuffer(this._gl, vertices, this.shaderAttributes['a_VertexPosition'])
            mesh.geometry.verticesBuffer = buffer

            buffer = webGLUtil.bindNewFloatArrayBuffer(this._gl, normals, this.shaderAttributes['a_VertexNormal'])
            mesh.geometry.normalsBuffer = buffer
          }
          this.index_buffer = webGLUtil.setNewIndexBuffer(this._gl, faces)
          mesh.geometry.indexBuffer = this.index_buffer

          mesh.geometry.hasChanged = false
        } else {
          buffer = mesh.geometry.verticesBuffer
          webGLUtil.bindFloatArrayBuffer(this._gl, buffer, this.shaderAttributes['a_VertexPosition'])

          buffer = mesh.geometry.normalsBuffer
          webGLUtil.bindFloatArrayBuffer(this._gl, buffer, this.shaderAttributes['a_VertexNormal'])

          this.index_buffer = mesh.geometry.indexBuffer
        }

        webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['material.u_Color'], mesh.material.color)
        webGLUtil.setUniformLocation(this._gl, this.shaderAttributes['material.u_UseNormal'], mesh.useNormal)

        if (mesh.clearDepth) {
          this._gl.disable(this._gl.DEPTH_TEST)
        }

        if (mesh.renderType === Mesh.RENDER_TYPE.TRIANGLES) {
          this.drawElementsTriangle(faces)
        } else if (mesh.renderType === Mesh.RENDER_TYPE.LINE_LOOP) {
          this.drawElementsLineLoop(faces)
        } else {
          this.drawElementsLines(faces)
        }

        if (mesh.clearDepth) {
          this._gl.enable(this._gl.DEPTH_TEST)
        }
      }
    }
  }
}

module.exports = WebGLRender
