attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uColor;
uniform vec3 uPointLightColor;
uniform vec3 uPointLightPosition;
uniform vec3 uAmbientLightColor;
uniform bool uUseLighting;
uniform bool uUseTexture;

varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;

  // gl.uniform1i(program.uUseLighting, true);
  if (uUseLighting) {
    vec3 normal = normalize(vec3(uNormalMatrix * aNormal));
    vec4 vertexPosition = uModelMatrix * aPosition;
    vec3 lightDirection = normalize(uPointLightPosition - vec3(vertexPosition));
    float nDotL = max(dot(lightDirection, normal), 0.0);
    vec3 diffuse = uPointLightColor * uColor.rgb * nDotL;
    vec3 ambient = uAmbientLightColor * uColor.rgb;
    vColor = vec4(ambient + diffuse, uColor.a);
  } else {
    vColor = uColor;
  }

  // gl.uniform1i(program.uUseTexture, true);
  if(uUseTexture) {
    vTexCoord = aTexCoord;
  }
}
