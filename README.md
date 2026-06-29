# Cricket Game

A little 3D cricket scene built in the browser with Three.js. Honestly, I built this one because I wanted to — it's a reminder that the best reason to make something is that you'd like to see it exist. There's a textured ground, a pitch, a circular stadium, players, and a camera you can drag around to look at it all.

**[Live demo →](https://cricket-alpha-sage.vercel.app)**

## What's in it

- A textured grass ground and a cricket pitch
- A stadium built procedurally around the field
- Player figures you can color however you like
- Lighting and shadows
- Drag-to-orbit camera controls

## A reusable piece

The geometry lives in its own module (`creative/figure.js`) so you could drop it into another Three.js project. It exports three builders:

| Function | What it makes |
|----------|---------------|
| `makeCricketPitch(params)` | the pitch |
| `createStadium(radius = 75)` | a circular stadium |
| `createPlayer(jerseyColor = 0xffffff)` | a player in a given jersey color |

Each returns a `THREE.Object3D` you add to your own scene — lighting and camera are left to you, so it stays flexible.

## Running it locally

It uses ES module imports, so serve it over HTTP rather than opening the file directly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Drag with the mouse to look around.

## Built with

Three.js · WebGL · plain JavaScript (no build step)
