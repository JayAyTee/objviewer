export class vec3 {
  /** 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * @returns {vec3}
   * @param {Number[]} arr 
   */
  static fromArray(arr) {
    if (arr.length < 3) return undefined;
    return new vec3(arr[0], arr[1], arr[2]);
  }
  /**
   * @returns {vec3}
   * @param {Number} yaw 
   * @param {Number} pitch 
   */
  static getNormalizedVectorFromRotation(yaw, pitch) {
    let q = Math.cos(pitch * Math.PI / 180);
    return new vec3(
      Math.sin(yaw * (Math.PI / 180)) * q,
      Math.sin(pitch * Math.PI / 180),
      Math.cos(yaw * Math.PI / 180) * q,
    );
  }
  /**
   * @return {vec3}
   * @param {vec3} v 
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  multiply(s) {
    this.x = this.x * s;
    this.y = this.y * s;
    this.z = this.z * s;
    return this;
  }
  static ZERO = new vec3(0, 0, 0);
}

export class vec2 {
  /** 
   * @param {Number} x 
   * @param {Number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  static ZERO = new vec2(0, 0);
}

export class cam {
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   * @param {Number} pitch
   * @param {Number} yaw 
   * @param {Number} fov 
   * @param {Number} screen_width 
   * @param {Number} screen_height 
   */
  constructor(x, y, z, pitch, yaw, fov, screen_width, screen_height) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.pitch = pitch;
    this.yaw = yaw;
    this.fov = fov;
    this.screen_width = screen_width;
    this.screen_height = screen_height;
    this.screen_distance = screen_width / Math.tan(fov * Math.PI / 360) / 2;
  }

  updateFov(fov) {
    this.fov = fov;
    this.screen_distance = this.screen_width / Math.tan(fov * Math.PI / 360) / 2;
  }
  getRotation() {
    return new vec3(this.yaw, this.pitch, 0);
  }
  getPosition() {
    return new vec3(this.x, this.y, this.z);
  }
  /** @param {vec3} v */
  setPosition(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }
  /** @param {vec3} v */
  addPosition(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }
  /** @param {vec3} v */
  subPosition(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }
}