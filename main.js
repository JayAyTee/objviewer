"use strict"
import { vec3, cam } from "./structs.js"
import { initInputs, initMouse, tickInput } from "./inputhandler.js";
import { obj_file } from "./objhelper.js";
import { renderGeometry } from "./renderer.js";

/** @type {HTMLParagraphElement} */
const FPS_COUNTER = document.getElementById("fps_counter");
/** @type {HTMLInputElement} */
const OBJ_INPUT = document.getElementById("obj-file");
/** @type {HTMLInputElement} */
const FOV_SLIDER = document.getElementById("fov-slider");
/** @type {HTMLCanvasElement} */
const VIEWPORT = document.getElementById("viewport");
/** @type {HTMLButtonElement} */
const USE_EXAMPLE_MONKEY = document.getElementById("use_example_monkey");
const CTX = VIEWPORT.getContext("2d");
const WIDTH = VIEWPORT.width;
const HEIGHT = VIEWPORT.height;
const OPTIONS = {
  render_verticies: false,
  render_lines: true,
  render_origo: true,
};

let time = new Date().getTime();
/** @type {obj_file} */
let obj;
let camera = new cam(20, 20, -30, -10, 30, 90, WIDTH, HEIGHT);

onload = async function () {
  OBJ_INPUT.addEventListener("change", async () => {
    if (OBJ_INPUT.files.length < 1) return;
    /** @type {File} */
    let file = OBJ_INPUT.files[0];
    obj = obj_file.empty();
    obj.parse(await file.text());
  });
  USE_EXAMPLE_MONKEY.addEventListener("click", async () => {
    if (obj) return;
    obj = new obj_file("./assets/obj/monkey.obj");
    obj.rot.y = -90
    obj.scaleModel(20);
  })
  initInputs(debugPrint);
  initMouse(VIEWPORT);
  requestAnimationFrame(render);
  FOV_SLIDER.addEventListener("change", () => {
    camera.updateFov(FOV_SLIDER.value);
  })
}

function render() {
  let now = new Date().getTime();
  let deltaTime = (now - time) / 1000;
  time = now;
  FPS_COUNTER.innerHTML = `FPS: ${Math.round(Math.max(0, 1 / deltaTime)*100)/100}`;

  tickInput(deltaTime, camera);
  if (obj) obj.rot.add(new vec3(5, 0, 0).multiply(deltaTime));
  
  // Clear and draw background
  CTX.clearRect(0, 0, WIDTH, HEIGHT);
  CTX.fillStyle = "#A4D6Fe"
  CTX.fillRect(0, 0, WIDTH, HEIGHT);

  renderGeometry(obj, camera);

  requestAnimationFrame(render);
}

function debugPrint() { console.log(camera); }