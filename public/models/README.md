# Particle morph models

`.glb` models that the hero particle sphere morphs into, one per section.

## File naming

Place files here using the section id:

| Section  | File                  | Suggested shape                          |
| -------- | --------------------- | ---------------------------------------- |
| Work     | `morph-work.glb`      | structured lattice / orbital system      |
| Projects | `morph-projects.glb`  | a machine / computer (your Sketchfab pick)|
| Now      | `morph-now.glb`       | human form — head / brain / hands        |
| Connect  | `morph-connect.glb`   | constellation / node graph               |

(Hero stays the sphere — no model needed.)

If a file is absent, the system automatically falls back to a procedural
placeholder, so the site never breaks while assets are in progress.

## Contract

The loader normalizes a lot for you, but follow these for best results:

- **Format:** `.glb` (binary glTF). Sketchfab "glTF Binary (.glb)" export is ideal.
- **Scale / origin:** don't worry about real-world units — the pipeline
  recenters on the bounding-box center and scales the model so its farthest
  point lands on the unit sphere. Any scale works.
- **Orientation:** model should face **+Z** (toward the viewer) and be upright
  (**+Y** up). We don't auto-rotate.
- **Geometry:** must contain real mesh geometry (not just points/lines). All
  meshes in the file are merged and surface-sampled, so multi-part models are
  fine.
- **Vertex budget:** keep it reasonable (≈ ≤150k triangles). Sampling cost
  scales with mesh complexity at load time, not with particle count.
- **Materials/textures:** ignored — only geometry is used (the particles carry
  the monochrome etching look). You can export without textures to shrink files.
- **Detail:** prefer models whose *silhouette/surface* reads clearly as a point
  cloud; very thin or sparse meshes sample poorly.

## How sampling works

`MeshSurfaceSampler` distributes points across the surface weighted by triangle
area, so dense and sparse regions get proportional coverage. The number of
points always equals the live particle count, so morphs are 1:1.
