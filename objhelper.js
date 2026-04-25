import { vec3 } from "./structs.js";

export class obj_file {
  /**
   * 
   * @param {string} path 
   */
  constructor(path) {
    this.path = path;
    this.verticies = [];
    this.faces = [];
    this.pos = new vec3(0,0,0);
    this.rot = new vec3(0,0,0);
  }

  async parse() {
    if (this.is_parsed) return;
    const response = await fetch(this.path);
    const text = await response.text();
    for (let line of text.split("\n")) {
      let trimmed = line.trimStart();
      if (trimmed.startsWith("#")) continue; // Comment
      let tokens = multiSplit(trimmed); // Remove even double spaces
      let ri = tokens.indexOf("\r");
      if (ri >= 0) tokens.splice(ri, 1);
      if (tokens.length <= 0) continue;
      switch (tokens[0].toLowerCase()) {
        case "v":
          if (tokens.length < 4) continue;
          this.verticies.push(Number(tokens[1]));
          this.verticies.push(Number(tokens[3]));
          this.verticies.push(Number(tokens[2]));
          break;
        case "vt":
          // texture coordinates
          break;
        case "vn":
          // vertex normals
          break;
        case "vp":
          // parameter space vertices
          break;
        case "f":
          // Polygonal face
          tokens.splice(0, 1);
          if (tokens.length < 3) continue;
          if (tokens.length > 3) {
            // Convert into triangles
            for (let i = 0; i < tokens.length - 2; i++) {
              this.#addTriangle(tokens.slice(i, i + 3));
            }
          } else {
            this.#addTriangle(tokens);
          }
          break;
        case "l":
          // line
          break;
      }
    }
    this.is_parsed = true;
  }
  /** @param {string[3]} formatted  */
  #addTriangle(formatted) {
    let triangle = [];
    triangle.push(Number(formatted[0].split("/")[0]) - 1);
    triangle.push(Number(formatted[1].split("/")[0]) - 1);
    triangle.push(Number(formatted[2].split("/")[0]) - 1);
    this.faces.push(triangle);
  }
  async parseVerticies() {
    await this.parse();
    return this.verticies;
  }
  async parseFaces() {
    await this.parse();
    return this.faces;
  }
  
}

/**
 * 
 * @param {string} str 
 * @param {string} separator 
 * @returns {string[]}
 */
function multiSplit(str, separator = " ") {
  let arr = str.split(separator);
  let i = arr.indexOf("");
  while (i >= 0) {
    arr.splice(i, 1);
    i = arr.indexOf("");
  }
  return arr;
}