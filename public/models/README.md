# Particle morph models

Draco-compressed `.glb` point-cloud morph targets for the hero particle sphere.
Source models live in the gitignored `/assets` dir; the compressed copies here
are what ship.

## Mapping

| Trigger            | File                  | Subject                 |
| ------------------ | --------------------- | ----------------------- |
| Hero / landing     | `morph-hero.glb`      | living bonsai           |
| Work               | — (sphere)            | no model; ball state    |
| Projects           | `morph-projects.glb`  | retro computer          |
| Now                | `morph-now.glb`       | human brain (the thesis)|
| Connect            | `morph-connect.glb`   | telephone receiver      |
| End of page / footer | `morph-footer.glb`  | brass bonsai (finale)   |
| AFK idle           | `morph-hero.glb`      | living bonsai (rest)    |

Missing/failed models fall back to the sphere, so nothing blocks on assets.

## Hosting

Served from `/models` by default (committed, Vercel static — files are tiny
after compression, < 200 KB each). To serve from a CDN / Vercel Blob instead,
set `NEXT_PUBLIC_MODELS_BASE_URL` (no trailing slash); files are fetched from
`<base>/<filename>`.

## Compression

Compressed with gltf-transform (Draco geometry compression + light mesh
simplification + tiny textures, since only geometry is sampled):

```bash
npx @gltf-transform/cli optimize assets/<model>.glb public/models/morph-<x>.glb \
  --compress draco --simplify-error 0.001 --texture-size 32
```

The loader (`lib/particles/loadTarget.ts`) wires a `DRACOLoader` (decoder from
the gstatic CDN) so these decode at runtime.

## Contract

- `.glb` (binary glTF), Draco-compressed.
- Scale/origin: auto-normalized (recenter on bbox center, scale farthest point
  to the unit sphere). Any scale works.
- Orientation: face +Z, +Y up (not auto-rotated).
- Geometry only — materials/textures are ignored (particles carry the look).
- Prefer models whose silhouette reads clearly as a point cloud.
