#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define MAX_POINT_LIGHTS 32
#define MAX_SPOT_LIGHTS 32

struct DirLight {
  vec3 dir;
  vec3 color;
  float intensity;
};

struct PointLight {
  vec3 pos;
  float intensity;
  vec3 color;
};

struct SpotLight {
  vec3 pos;
  vec3 dir;
  float angle;
  float intensity;
  vec3 color;
};

uniform DirLight u_dirLight;
uniform PointLight u_pointLights[MAX_POINT_LIGHTS];
uniform SpotLight u_spotLights[MAX_SPOT_LIGHTS];
uniform vec3 u_ambientLight;
uniform vec3 u_Color;
uniform vec3 u_eyes_position;
uniform float u_ambientLightIntensity;
uniform int u_UseNormal;
uniform int u_numPointLights;
uniform int u_numSpotLights;

varying vec3 f_normals;
varying vec3 f_vertex_position;

vec3 fixedNormal;
vec3 SurfaceLightDir;
vec3 SurfaceEyeDir;
vec3 ambienColor;
vec3 dirColor;
vec3 pointColor;
vec3 spotColor;
vec3 halfVector;

float angleDir;
float distanceLight;
float attenuation;
float attenuation2;
float specular;
PointLight pointLight;
SpotLight spotLight;

float random(vec2 xy);
vec3 calculatePointLights();
vec3 calculateSpotLights();

void main(void) {
  if (u_UseNormal == 1) {
    fixedNormal = normalize(f_normals);
    angleDir = dot(fixedNormal,normalize(-u_dirLight.dir));
    angleDir = max(angleDir, 0.0);
    SurfaceEyeDir = normalize(u_eyes_position - f_vertex_position);

    // Luz direccional.
    dirColor = u_Color * angleDir;
    dirColor *= u_dirLight.color;
    dirColor *= u_dirLight.intensity;

    // Luz ambiente
    ambienColor = u_Color * u_ambientLight;
    ambienColor *= u_ambientLightIntensity;

    // Luces puntuales.
    pointColor = calculatePointLights();

    // Spot Lights.
    spotColor = calculateSpotLights();

    // Se introduce un poco de ruido para tratar de ocultar los bordes cunado cambia el color.
    pointColor.rgb *= mix(0.98, 1.02, random(f_vertex_position.xz));
    spotColor.rgb *= mix(0.98, 1.02, random(f_vertex_position.xz));

    // Luz Total.
    gl_FragColor.rgb = ambienColor + dirColor + pointColor + spotColor;
    gl_FragColor.a = 1.0;
  } else {
    gl_FragColor = vec4(u_Color, 1.0);
  }
}

vec3 calculatePointLights () {
  vec3 color;
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= u_numPointLights) {
      break;
    }
    pointLight = u_pointLights[i];
    if (pointLight.intensity <= 0.0) {
      continue;
    }

    SurfaceLightDir = pointLight.pos - f_vertex_position;
    distanceLight = length(SurfaceLightDir);
    SurfaceLightDir = normalize(SurfaceLightDir);
    angleDir = dot(SurfaceLightDir, fixedNormal);
    halfVector = normalize(SurfaceEyeDir + SurfaceLightDir);
    specular = dot(halfVector, fixedNormal);
    if (angleDir < 0.0) {
      continue;
    }
    attenuation = pointLight.intensity / pow(distanceLight, 2.0);
    attenuation2 = attenuation / 200.0;
    if (attenuation > 1.0) {
      attenuation = pow(attenuation, 0.5);
    }
    
    color += u_Color * pointLight.color * angleDir * attenuation + (pointLight.color + vec3(0.8)) * attenuation2;
    color += clamp(pow(specular, 1000.0) * pointLight.color * pointLight.intensity / 100.0, 0.0, 1.0);
  }
  return color;
}

vec3 calculateSpotLights () {
  vec3 color;
  for (int i = 0; i < MAX_SPOT_LIGHTS; i++) {
    if (i >= u_numSpotLights) {
      break;
    }
    spotLight = u_spotLights[i];
    if (spotLight.intensity <= 0.0) {
      continue;
    }
    
    SurfaceLightDir = spotLight.pos - f_vertex_position;
    distanceLight = length(SurfaceLightDir);
    SurfaceLightDir = normalize(SurfaceLightDir);
    angleDir = dot(SurfaceLightDir, normalize(-spotLight.dir));
    attenuation = (angleDir - spotLight.angle) / (1.0 - spotLight.angle);
    halfVector = normalize(SurfaceEyeDir + SurfaceLightDir);
    specular = dot(halfVector, fixedNormal);
    if (angleDir < spotLight.angle) {
      continue;
    }
    angleDir = dot(SurfaceLightDir, fixedNormal);
    if (angleDir < 0.0) {
      continue;
    }
    attenuation2 = spotLight.intensity / pow(distanceLight, 2.0);
    attenuation *= attenuation2;
    attenuation2 /= 200.0;
    if (attenuation > 1.0) {
      attenuation = pow(attenuation, 0.5);
    }
    
    color += u_Color * spotLight.color * angleDir * attenuation + (spotLight.color + vec3(0.8)) * attenuation2;
    color += clamp(pow(specular, 1000.0) * attenuation * spotLight.color * spotLight.intensity / 100.0, 0.0, 1.0);
  }
  return color;
}

// Funcion para generar un numero random entre 0.0 y 1.0 .
float random (vec2 xy) {
    return fract(sin(dot(xy ,vec2(12.9898,78.233))) * 43758.5453);
}
