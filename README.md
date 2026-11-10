# Computer Graphics — Labs 1–5

Five interactive, standalone Three.js browser labs, each in its own folder.

## How to run

1. Download and unzip the project. Open the unzipped folder in Visual Studio Code.
2. Start a simple local development server **at the root of the project**:

   ```bash
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000/ and click a lab. Alternatively, use VS Code **Live Server**.
4. An internet connection is needed for the Three.js CDN library.

> Opening an `index.html` file directly using `file://` may block ES modules in some browsers, so use a local server.

## Required labs

| Folder | Implementation |
|---|---|
| `lab-1-rotating-cube` | Animated 3D cube with speed sliders, pause, reset, camera controls |
| `lab-2-vector-laboratory` | Vector3 math (add, subtract, dot, cross, normalize, lengths, angle, projection), vectors as arrows, mandatory ray–plane intersection |
| `lab-3-solar-system` | Sun, Earth–Moon hierarchical orbit and Mars–Phobos hierarchical orbit, adjustable speed |
| `lab-4-robotic-hand` | Palm, wrist, all four fingers, thumb on left side of palm, articulated joints |
| `lab-5-buffergeometry-shapes` | Procedural indexed triangle mesh forming a crystal or open-top vase; vertex count, faces, normals and wireframe |



## Tech stack

HTML, CSS, JavaScript, Three.js `0.187.0`, OrbitControls, WebGLRenderer. Source code stays editable in each lab's `main.js`.

