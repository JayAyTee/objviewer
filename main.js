"use strict"
import { vec2, vec3, cam } from "./structs.js"
import { project } from "./conversions.js";
import { initInputs, isPressed, initMouse, getMouseMovement } from "./inputhandler.js";
import { obj_file } from "./objhelper.js";

/** @type {HTMLParagraphElement} */
const fps_counter = document.getElementById("fps_counter");
/** @type {HTMLCanvasElement} */
const viewport = document.getElementById("viewport");
const ctx = viewport.getContext("2d");
const WIDTH = viewport.width;
const HEIGHT = viewport.height;
const TICK_RATE = 20;
const options = {
  render_verticies: false,
  render_lines: true,
  render_origo: true,
};

let time = new Date().getMilliseconds();
let SKULL_OBJ = new obj_file("./assets/obj/object.obj");

/** @type {Number[]} */
let verticies;
/** @type {Number[][]} */
let faces;

/** @type {cam} */
let camera = new cam(20, 20, -30, -10, 30, 90, WIDTH, HEIGHT);

function render() {

  let now = new Date().getMilliseconds();
  let deltaTime = now - time;
  time = now;
  fps_counter.innerHTML = `FPS: ${Math.round(Math.max(0,1 / (deltaTime / 1000))*100)/100}`;
  
  // Clear and draw background
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#A4D6Fe"
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Render origo
  if (options.render_origo) {
    ctx.lineWidth = 2;
    let origo = project(vec3.ZERO, camera, vec3.ZERO, vec3.ZERO);
    if (origo != undefined) {
      origo.y *= -1;
      origo.add(new vec2(WIDTH / 2, HEIGHT / 2));
      // X Axis
      ctx.strokeStyle = "#FF0000";
      let x = project(new vec3(10, 0, 0), camera, vec3.ZERO, vec3.ZERO);
      if (x != undefined) {
        x.y *= -1;
        x.add(new vec2(WIDTH / 2, HEIGHT / 2));
        // console.log(x);
        ctx.beginPath();
        ctx.moveTo(origo.x, origo.y);
        ctx.lineTo(x.x, x.y);
        ctx.closePath();
        ctx.stroke();
      }
      // Y Axis
      ctx.strokeStyle = "#00FF00";
      let y = project(new vec3(0, 10, 0), camera, vec3.ZERO, vec3.ZERO);
      if (y != undefined) {
        y.y *= -1;
        y.add(new vec2(WIDTH / 2, HEIGHT / 2));
        ctx.beginPath();
        ctx.moveTo(origo.x, origo.y);
        ctx.lineTo(y.x, y.y);
        ctx.closePath();
        ctx.stroke();
      }
      // Z Axis
      ctx.strokeStyle = "#0000FF";
      let z = project(new vec3(0, 0, 10), camera, vec3.ZERO, vec3.ZERO);
      if (z != undefined) {
        z.y *= -1;
        z.add(new vec2(WIDTH / 2, HEIGHT / 2));
        ctx.beginPath();
        ctx.moveTo(origo.x, origo.y);
        ctx.lineTo(z.x, z.y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // Draw verticies
  if (options.render_verticies) {
    ctx.fillStyle = "#FFF";
    const dot_size = 0.75;
    for (let i = 0; i < Math.floor(verticies.length / 3); i++) {
      let vertex = new vec3(verticies[3 * i], verticies[3 * i + 1], verticies[3 * i + 2]);
      let projection = project(vertex, camera, SKULL_OBJ.pos, SKULL_OBJ.rot);
      if (projection == undefined) continue;
      ctx.fillRect(WIDTH / 2 + projection.x - dot_size / 2, HEIGHT / 2 - projection.y - dot_size / 2, dot_size, dot_size);
    }
  }

  // Draw wireframe lines 
  if (options.render_lines) {
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 0.1;
    for (let face of faces) {
      let v1 = vec3.fromArray(verticies.slice(3 * face[0], 3 * face[0] + 3));
      let v2 = vec3.fromArray(verticies.slice(3 * face[1], 3 * face[1] + 3));
      let v3 = vec3.fromArray(verticies.slice(3 * face[2], 3 * face[2] + 3));
      let v1p = project(v1, camera, SKULL_OBJ.pos, SKULL_OBJ.rot);
      let v2p = project(v2, camera, SKULL_OBJ.pos, SKULL_OBJ.rot);
      let v3p = project(v3, camera, SKULL_OBJ.pos, SKULL_OBJ.rot);
      if (v1p != undefined && v2p != undefined && v3p != undefined) {
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2 + v1p.x, HEIGHT / 2 - v1p.y);
        ctx.lineTo(WIDTH / 2 + v2p.x, HEIGHT / 2 - v2p.y);
        ctx.lineTo(WIDTH / 2 + v3p.x, HEIGHT / 2 - v3p.y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(render);
}

onload = async function () {
  verticies = await SKULL_OBJ.parseVerticies();
  faces = await SKULL_OBJ.parseFaces();
  initInputs(debugPrint);
  initMouse(viewport);
  this.setInterval(tick, 1000 / TICK_RATE);
  requestAnimationFrame(render);
}

function debugPrint() {
  console.log(camera);
}

function tick() {
  const moveSpeed = 0.2;
  const mouse_sensitivity = 0.1;
  if (isPressed("a") || isPressed("arrowleft")) {
    camera.x -= moveSpeed;
  }
  if (isPressed("d") || isPressed("arrowright")) {
    camera.x += moveSpeed;
  }
  if (isPressed("w") || isPressed("arrowup")) {
    camera.z += moveSpeed;
  }
  if (isPressed("s") || isPressed("arrowdown")) {
    camera.z -= moveSpeed;
  }
  if (isPressed("e")) {
    camera.y += moveSpeed;
  }
  if (isPressed("q")) {
    camera.y -= moveSpeed;
  }
  let movement = getMouseMovement();
  camera.yaw -= mouse_sensitivity * movement.x;
  camera.pitch -= mouse_sensitivity * movement.y;
  SKULL_OBJ.rot.add(new vec3(5, 0, 0));
}