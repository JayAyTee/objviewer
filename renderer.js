import { obj_file } from "./objhelper.js";
import { vec2, vec3, cam } from "./structs.js";
import { project } from "./conversions.js";

/** @type {HTMLCanvasElement} */
const VIEWPORT = document.getElementById("viewport");
const CTX = VIEWPORT.getContext("2d");
const WIDTH = VIEWPORT.width;
const HEIGHT = VIEWPORT.height;
const OPTIONS = {
  render_verticies: false,
  render_lines: true,
  render_triangles: false,
  render_origo: true,
};

/**
 * 
 * @param {obj_file} OBJ 
 * @param {cam} camera 
 */
export function renderGeometry(OBJ,camera) {
  // Render origo
  if (OPTIONS.render_origo) {
    CTX.lineWidth = 2;
    let origo = project(vec3.ZERO, camera, vec3.ZERO, vec3.ZERO);
    if (origo != undefined) {
      origo.y *= -1;
      origo.add(new vec2(WIDTH / 2, HEIGHT / 2));
      // X Axis
      CTX.strokeStyle = "#FF0000";
      let x = project(new vec3(10, 0, 0), camera, vec3.ZERO, vec3.ZERO);
      if (x != undefined) {
        x.y *= -1;
        x.add(new vec2(WIDTH / 2, HEIGHT / 2));
        // console.log(x);
        CTX.beginPath();
        CTX.moveTo(origo.x, origo.y);
        CTX.lineTo(x.x, x.y);
        CTX.closePath();
        CTX.stroke();
      }
      // Y Axis
      CTX.strokeStyle = "#00FF00";
      let y = project(new vec3(0, 10, 0), camera, vec3.ZERO, vec3.ZERO);
      if (y != undefined) {
        y.y *= -1;
        y.add(new vec2(WIDTH / 2, HEIGHT / 2));
        CTX.beginPath();
        CTX.moveTo(origo.x, origo.y);
        CTX.lineTo(y.x, y.y);
        CTX.closePath();
        CTX.stroke();
      }
      // Z Axis
      CTX.strokeStyle = "#0000FF";
      let z = project(new vec3(0, 0, 10), camera, vec3.ZERO, vec3.ZERO);
      if (z != undefined) {
        z.y *= -1;
        z.add(new vec2(WIDTH / 2, HEIGHT / 2));
        CTX.beginPath();
        CTX.moveTo(origo.x, origo.y);
        CTX.lineTo(z.x, z.y);
        CTX.closePath();
        CTX.stroke();
      }
    }
  }
  if (!OBJ) return;

  // Draw verticies
  if (OPTIONS.render_verticies) {
    CTX.fillStyle = "#FFF";
    const dot_size = 0.75;
    for (let i = 0; i < Math.floor(OBJ.verticies.length / 3); i++) {
      let vertex = new vec3(OBJ.verticies[3 * i], OBJ.verticies[3 * i + 1], OBJ.verticies[3 * i + 2]);
      let projection = project(vertex, camera, OBJ.pos, OBJ.rot);
      if (projection == undefined) continue;
      CTX.fillRect(WIDTH / 2 + projection.x - dot_size / 2, HEIGHT / 2 - projection.y - dot_size / 2, dot_size, dot_size);
    }
  }

  // Draw wireframe lines 
  if (OPTIONS.render_lines) {
    CTX.strokeStyle = "#FFF";
    CTX.lineWidth = 0.1;
    for (let face of OBJ.faces) {
      let v1 = vec3.fromArray(OBJ.verticies.slice(3 * face[0], 3 * face[0] + 3));
      let v2 = vec3.fromArray(OBJ.verticies.slice(3 * face[1], 3 * face[1] + 3));
      let v3 = vec3.fromArray(OBJ.verticies.slice(3 * face[2], 3 * face[2] + 3));
      let v1p = project(v1, camera, OBJ.pos, OBJ.rot);
      let v2p = project(v2, camera, OBJ.pos, OBJ.rot);
      let v3p = project(v3, camera, OBJ.pos, OBJ.rot);
      if (v1p != undefined && v2p != undefined && v3p != undefined) {
        CTX.beginPath();
        CTX.moveTo(WIDTH / 2 + v1p.x, HEIGHT / 2 - v1p.y);
        CTX.lineTo(WIDTH / 2 + v2p.x, HEIGHT / 2 - v2p.y);
        CTX.lineTo(WIDTH / 2 + v3p.x, HEIGHT / 2 - v3p.y);
        CTX.closePath();
        CTX.stroke();
      }
    }
  }
  // Draw triangles 
  if (OPTIONS.render_triangles) {
    CTX.fillStyle = "#FFFF00";
    for (let face of OBJ.faces) {
      let v1 = vec3.fromArray(OBJ.verticies.slice(3 * face[0], 3 * face[0] + 3));
      let v2 = vec3.fromArray(OBJ.verticies.slice(3 * face[1], 3 * face[1] + 3));
      let v3 = vec3.fromArray(OBJ.verticies.slice(3 * face[2], 3 * face[2] + 3));
      let v1p = project(v1, camera, OBJ.pos, OBJ.rot);
      let v2p = project(v2, camera, OBJ.pos, OBJ.rot);
      let v3p = project(v3, camera, OBJ.pos, OBJ.rot);
      if (v1p != undefined && v2p != undefined && v3p != undefined) {
        let region = new Path2D();
        region.moveTo(WIDTH / 2 + v1p.x, HEIGHT / 2 - v1p.y);
        region.lineTo(WIDTH / 2 + v2p.x, HEIGHT / 2 - v2p.y);
        region.lineTo(WIDTH / 2 + v3p.x, HEIGHT / 2 - v3p.y);
        region.closePath();
        CTX.fill(region, "nonzero")
      }
    }
  }
}