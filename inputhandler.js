import { cam, vec2, vec3 } from "./structs.js";

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

/** 
 * @param {cam} camera 
 * @param {Number} deltaTime 
 */
export function tickInput(deltaTime, camera) {
  const moveSpeed = 20 * deltaTime;
  const mouse_sensitivity = 100 * deltaTime;
  if (isPressed("a") || isPressed("arrowleft")) {
    camera.addPosition(vec3.getNormalizedVectorFromRotation(-camera.yaw - 90, 0).multiply(moveSpeed));
  }
  if (isPressed("d") || isPressed("arrowright")) {
    camera.addPosition(vec3.getNormalizedVectorFromRotation(-camera.yaw + 90, 0).multiply(moveSpeed));
  }
  if (isPressed("w") || isPressed("arrowup")) {
    camera.addPosition(vec3.getNormalizedVectorFromRotation(-camera.yaw, camera.pitch).multiply(moveSpeed));
  }
  if (isPressed("s") || isPressed("arrowdown")) {
    camera.subPosition(vec3.getNormalizedVectorFromRotation(-camera.yaw, camera.pitch).multiply(moveSpeed));
  }
  if (isPressed("e")) {
    camera.y += moveSpeed;
  }
  if (isPressed("q")) {
    camera.y -= moveSpeed;
  }
  let movement = getMouseMovement();
  camera.yaw -= mouse_sensitivity * movement.x * deltaTime;
  camera.pitch = Math.max(-90,Math.min(90,camera.pitch - mouse_sensitivity * movement.y * deltaTime));
}