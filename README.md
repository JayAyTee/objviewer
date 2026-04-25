# Objviewer

This is an object viewer written in javascript using HTML canvas. It is capable of reading .obj files and rendering them either as single verticies or as a wireframe, this is configured in *options* in *main.js*. Fancy things such as *triangles* and *normals* etc. are ignored for performance and complexity reasons.

There is a simple camera which is controlled by wasd/arrow keys and by the mouse by clicking into the canvas.

As you might notice it is written entirely for the CPU and is thus, very inperformant. I will not be rewriting this for WebGL as performance is not the aim of the project.

It is currently not shipped with any objects, as I do not have the rights to the model I'm using for testing

## Todos:
- [ ] Normalizing projection coordinates to -1 to 1
- [ ] Fov slider
- [ ] Smoothing between ticks (if we ever get above 20fps)
- [ ] Obj file input
- [ ] Multiple objects
- [ ] Culling, clipping and proper testing
- [ ] Triangles and rendering layers
- [ ] Better code organisation