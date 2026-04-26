# Objviewer

This is an object viewer written in javascript using HTML canvas. It is capable of reading .obj files and rendering them either as single verticies or as a wireframe, this is configured in *OPTIONS* in *renderer.js* as for now. Most model data is ignored (basically only verticies and faces are read)

There is a simple camera which is controlled by wasd/arrow keys and by the mouse by clicking into the canvas.

As you might notice it is written entirely for the CPU and is thus, very inperformant. I will not be rewriting this for WebGL as performance is not the aim of the project.

## Todos:
- Normalizing projection coordinates to -1 to 1
- Multiple objects
- Culling, clipping and proper testing