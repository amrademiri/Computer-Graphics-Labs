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

## IMPORTANT: Lab 2 levels

The professor's original Lab 2 handout (which defines the exact **Minimum**, **Standard** and **Challenge** requirements) was **not provided**. The levels shown in this project are illustrative groupings, and **not guaranteed** to match that handout. The mandatory ray–plane intersection is included. Verify the precise rubric and change Lab 2 accordingly before submission.

## Git and GitHub submission

The ZIP contains a **local Git repository with five separate commits**, one for each lab. The commits have an explicit starter-project author identity (they do not pretend to be commits authored by the student). The first commit also includes this README and the navigation page.

To inspect the commit history, unzip, open a terminal inside this folder, and run:

```bash
git log --oneline --reverse
```

To publish the history to **your** GitHub account:

1. Create a new **empty repository** on https://github.com/new. Do **not** initialize it with a README.
2. In a terminal inside the extracted project folder, run:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. Copy the repository URL as requested by your professor.

Replace the example repository URL with the URL from your GitHub repository. No GitHub repository has been created or updated on your behalf. If your unzip program discards hidden directories, ensure the `.git` folder is preserved, otherwise the existing five-commit history is lost. The `.git` folder is included in the ZIP.

## Tech stack

HTML, CSS, JavaScript, Three.js `0.187.0`, OrbitControls, WebGLRenderer. Source code stays editable in each lab's `main.js`.

## Submission checklist

- Verify all five labs run on your computer, using the development server.
- Verify Lab 2 levels against the professor's complete instructions.
- Add all five folders into **your** GitHub repository and commit each separately.
- Submit the GitHub repository URL as required by your course.
