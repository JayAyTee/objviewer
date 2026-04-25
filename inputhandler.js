import { vec2 } from "./structs.js";

let pressedKeys = [];
let mouseMovement = new vec2(0, 0);

/** @param {function} callback */
export function initInputs(callback) {
  document.body.addEventListener("keydown", (e) => keyDown(e,callback));
  document.body.addEventListener("keyup", keyUp);
}

/** 
 * @param {KeyboardEvent} e
 * @param {function} callback 
 */
function keyDown(e, callback) {
  if (e.key == "g") callback();
  pressedKeys.push(e.key.toLowerCase());
  // console.log(e.key);
}

/** @param {KeyboardEvent} e  */
function keyUp(e) {
  let i = pressedKeys.indexOf(e.key.toLowerCase());
  while (i >= 0) {
    pressedKeys.splice(i, 1);
    i = pressedKeys.indexOf(e.key.toLowerCase());
  }
}

/**
 * 
 * @param {string} key Case insensitive
 * @returns {boolean}
 */
export function isPressed(key) {
  return pressedKeys.includes(key.toLowerCase());
}

/** @param {HTMLCanvasElement} canvas */
export function initMouse(canvas) {
  canvas.addEventListener("mousedown", (e) => {
    canvas.requestPointerLock();
  })
  canvas.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement != canvas) return;
    mouseMovement.x = e.movementX;
    mouseMovement.y = e.movementY;
  })
}

/** @returns {vec2} */
export function getMouseMovement() {
  let m = structuredClone(mouseMovement);
  mouseMovement.x = 0;
  mouseMovement.y = 0;
  return m;
}