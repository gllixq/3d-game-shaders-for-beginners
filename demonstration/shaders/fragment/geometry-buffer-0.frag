/*
  (C) 2020 David Lettier
  lettier.com
*/

#version 150

uniform sampler2D p3d_Texture1;

uniform vec2 normalMapsEnabled;

in vec4 vertexPosition;

in vec3 vertexNormal;
in vec3 binormal;
in vec3 tangent;

in vec2 normalCoord;

out vec4 positionOut;
out vec4 normalOut;

mat3 tangentToView() {
  vec3 N = normalize(vertexNormal);
  vec3 T = normalize(tangent);
  vec3 B = normalize(binormal);

  T = normalize(T - N * dot(N, T));

  float handedness = sign(dot(cross(N, T), B));
  if (handedness == 0.0) { handedness = 1.0; }

  B = cross(N, T) * handedness;

  return mat3(T, B, N);
}

void main() {
  vec4 normalTex =
    texture
      ( p3d_Texture1
      , normalCoord
      );

  vec3 normal;
  if (normalMapsEnabled.x == 1) {
    normal =
      normalize
        ( normalTex.rgb
        * 2.0
        - 1.0
        );
    normal = normalize(tangentToView() * normal);
  } else {
    normal = normalize(vertexNormal);
  }

  positionOut = vertexPosition;
  normalOut   = vec4(normal, 1);
}
