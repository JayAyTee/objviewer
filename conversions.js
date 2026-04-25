import { vec2, vec3, cam} from "./structs.js";

/** 
 * @param {vec3} vertex
 * @param {vec3} translation
 * @param {vec3} rotation
 * @param {cam} camera 
 * @returns {vec2}
 */
export function project(vertex, camera, translation, rotation) {
  vertex = rotate3D(vertex, rotation);
  vertex.add(translation);
  vertex = rotate3D(vertex.sub(camera.getPosition()), camera.getRotation());
  let delta_x = vertex.x;
  let delta_y = vertex.y;
  let delta_z = vertex.z;
  if (delta_z < 0) return undefined;
  return new vec2((camera.screen_distance * delta_x) / delta_z, (camera.screen_distance * delta_y) / delta_z);
}

/**
 * @returns {vec3}
 * @param {vec3} point 
 * @param {vec3} rotation 
 */
export function rotate3D(point, rotation) {
  let cosa = Math.cos(Math.PI * rotation.z / 180);
  let sina = Math.sin(Math.PI * rotation.z / 180);
  let cosb = Math.cos(Math.PI * rotation.x / 180);
  let sinb = Math.sin(Math.PI * rotation.x / 180);
  let cosc = Math.cos(Math.PI * rotation.y / 180);
  let sinc = Math.sin(Math.PI * rotation.y / 180);
  let x = point.x;
  let y = point.y;
  let z = point.z;

  // CPU matrix multiplication my beloved
  return new vec3(
    x * cosa * cosb + y * (cosa * sinb * sinc - sina * cosc) + z * (cosa * sinb * cosc + sina * sinc),
    x * sina * cosb + y * (sina * sinb * sinc + cosa * cosc) + z * (sina * sinb * cosc - cosa * sinc),
    x * -sinb + y * cosb * sinc + z * cosb * cosc
  );
}