#ifdef GL_ES
precision highp float;
precision mediump int;
#endif

#define MAX_POINT_LIGHTS 32

struct DirLight {
  vec3 dir;
  vec3 color;
};

struct PointLight {
  vec3 pos;
  float intensity;
  vec3 color;
};

uniform DirLight u_dirLight;
uniform PointLight u_pointLights[MAX_POINT_LIGHTS];
uniform vec3 u_ambientLight;
uniform vec3 u_Color;
uniform int u_UseNormal;
uniform int u_numPointLights;

varying vec3 f_normals;
varying vec3 f_vertex_position;


vec3 fixedNormal;
vec3 pointLightDir;
vec3 dirColor;
vec3 pointColor;

float angleDir;
float distanceLight;
PointLight pointLight;

void main(void) {
  if (u_UseNormal == 1) {
    fixedNormal = normalize(f_normals);
    angleDir = dot(fixedNormal,-u_dirLight.dir);
    angleDir = max(angleDir, 0.0);

    // Luz direccional.
    dirColor = u_Color * angleDir;
    dirColor *= u_dirLight.color;

    // Luces puntuales.
    for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
      if (i >= u_numPointLights) {
        break;
      }
      pointLight = u_pointLights[i];
      pointLightDir = pointLight.pos - f_vertex_position;
      distanceLight = length(pointLightDir);
      pointLightDir = normalize(pointLightDir);
      angleDir = max(dot(pointLightDir, fixedNormal), 0.0);
      
      pointColor += (u_Color * pointLight.color * angleDir) * (pointLight.intensity / pow(distanceLight, 2.0));
    }

    // Luz Ambiente.
    gl_FragColor.rgb = u_ambientLight + dirColor + pointColor;
    gl_FragColor.a = 1.0;
  } else {
    gl_FragColor = vec4(u_Color, 1.0);
  }
}
