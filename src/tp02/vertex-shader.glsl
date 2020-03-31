attribute vec3 a_VertexPosition;
uniform vec3 u_Transform;
uniform vec3 u_Scale;
uniform vec3 u_Rotate;
uniform vec3 u_Color;


varying vec3 f_Color;

vec3 pos;

void main(void) {
  f_Color = u_Color;
  pos = a_VertexPosition * u_Scale;
  pos = vec3(
    cos(u_Rotate.z) * pos.x - sin(u_Rotate.z) * pos.y , 
    sin(u_Rotate.z) * pos.x + cos(u_Rotate.z) * pos.y , 
    1.0);
  pos = pos + u_Transform;
  gl_Position = vec4(pos, 1.0);    
}
