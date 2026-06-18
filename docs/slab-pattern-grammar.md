# Carved slab pattern grammar (algorithmic generation)

Reference study from archaeological slab illustrations (C3 radial + D4 rectilinear families). Use for stele faces, relief textures, and Movement I iconography.

## Shared principles

| Principle | Radial (C3) family | Rectilinear (D4) family |
|-----------|-------------------|------------------------|
| Frame | Circle in rectangle | Nested rectangles |
| Symmetry | 3-fold center, optional 4-fold corners | 4-fold star / compass |
| Nesting | Concentric rings | Inset borders |
| Texture | Hatching defines material | Same |
| Focal motif | Triskelion / triple crescent | Star + checkered disk |
| Edge logic | Corner semicircle loops | Stepped crenellations |

## Layer stack (z-order)

```
1. SLAB      — rectangle + optional side tab (interlock notch)
2. FRAME     — outer border (tile repeat or plain band)
3. FIELD     — composition area
4. MOTIF     — symbolic center (C3, C4, D4, C6)
5. RING(S)   — annuli between motif and frame
6. ORNAMENT  — corner loops, crenellations, spike rings
7. FILL      — hatching per region (not global)
```

## Primitive operators

### Symmetry

- `C3` — 120° rotation (triple crescent / triskelion)
- `C4` / `D4` — 90° rotation ± mirrors (compass star, square frame)
- `Cn` spikes — `n` rays on a ring

```text
for i in 0..n-1:
  rotate(i * 360/n) → stamp(primitive)
```

### Containers

- **Radial:** `disk(r0) → ring(r0,r1) → ring(r1,r2)`
- **Rectilinear:** `rect(margin) → inset(δ) → inset(δ)`
- **Hybrid:** rect field + circular motif

### Motif library

| Motif | Construction |
|-------|----------------|
| Triskelion | 3 arcs at 120°, shared hub |
| Star / compass | `n` long triangles from center disk |
| Spike ring | `n` isosceles triangles on circle |
| Crenellation | Edge minus periodic rectangular notches |
| Corner loop | Thick semicircle aimed at corner |
| Repeat border | Tile cell (X-in-square, diamond) along perimeter |

### Fill grammar

| Fill ID | Rule |
|---------|------|
| `parallel(θ, spacing)` | Lines at angle θ |
| `cross(θ, spacing)` | Two parallel layers → diamond mesh |
| `radial(center, n)` | Lines from center |
| `grid(s)` | Checker in cell |
| `tile(unit)` | Repeat micro-motif in bbox |
| `follow_curve(path)` | Parallel lines along arc |

Adjacent regions should use contrasting fill families.

## Radial recipe (left slab lineage)

```
symmetry_center = C3
symmetry_corners = C4

MOTIF: 3 crescents, 120°, parallel hatch ⊥ to arc
RINGS: spikes → crosshatch annulus → radiating ticks
ORNAMENT: 4 corner semicircles, follow_curve hatch
```

Knobs: `n_spikes`, ring radius ratios, crescent width, loop radius, hatch density.

## Rectilinear recipe (right slab lineage)

```
symmetry = D4

FRAME_OUT: band with tiled "X in square" along perimeter
FRAME_IN: crenellation(step_w, step_h)
MOTIF: center disk (grid) + 4-point star, parallel hatch on arms
```

Knobs: `cell_w`, crenel steps, star point count, grid pitch, inset depth.

## Genotype schema (for procedural gen)

```json
{
  "symmetry": "C3 | C4 | D4 | C6",
  "layout": "radial | rectilinear | hybrid",
  "layers": [
    { "type": "motif", "name": "triskelion", "params": {} },
    { "type": "ring", "style": "spikes", "count": 32 },
    { "type": "ring", "style": "crosshatch" },
    { "type": "border", "style": "tile", "unit": "x_square" },
    { "type": "ornament", "style": "corner_loops", "count": 4 }
  ],
  "fills": { "default": "parallel", "contrast": "cross" },
  "slab": { "aspect": 1.15, "tab": true }
}
```

## Validity rules

1. One dominant center symmetry; ornaments may use compatible supergroup only when visually separate.
2. Children fully inside parents.
3. Adjacent regions alternate fill families.
4. Border width ≈ 8–15% of min(w, h).
5. Motif occupies ~25–40% of field.
6. Perimeter tiles must seam (period divides perimeter length).

## Mutation operators

| Operator | Effect |
|----------|--------|
| `swap_motif` | triskelion ↔ star ↔ rosette |
| `add_ring` / `drop_ring` | more/less nesting |
| `symmetry_shift` | C3→C6 (if motif supports n) |
| `retile_border` | X-square ↔ meander ↔ dentil |
| `edge_profile` | smooth ↔ crenel ↔ scallop |
| `hatch_swap` | parallel ↔ cross on one ring |
| `corner_ornament` | loops ↔ lugs ↔ none |

## Integration targets (The Chain)

- **Web:** `slabGen.js` → SVG on stele faces (`P1`–`P6` boxes in relief viewer)
- **Blender:** displacement / bump on `stele*` / `SCREEN*` / `P*` meshes (see `blender/control_rooms.py`)
- **Depth maps:** hatch → height field for photo-relief holograms

## Reference images

Saved in workspace assets:
- `image-cb48e449-863c-4517-840f-ca4858cfac6d.png` (C3 radial + D4 rectilinear pair)
