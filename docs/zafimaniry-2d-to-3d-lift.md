# Zafimaniry 2D → 3D lift grammar

How flat carved-slab grammar (see `slab-pattern-grammar.md`) becomes **volumetric** objects for The Chain — without using Blender for full scenes. Blender (or code) builds **objects**; the site / game engine places them.

## Core idea

A 2D pattern is a graph of **primitives + symmetry + nesting on a plane**.  
A 3D lift replaces each primitive with a **3D counterpart** while preserving:

1. **Symmetry group** (C3, C4, D4…) — now acting on a volume or surface  
2. **Nesting** — shells inside shells (Russian doll)  
3. **Contrast** — adjacent regions still use different “fill families” (now: smooth vs carved vs open)

> **Circle → sphere** is one lift rule. Not every 2D circle becomes a full ball — context matters (disk vs ring outline vs decorative dot).

## Primitive lift table

| 2D (slab grammar) | Default 3D lift | Alternate lifts | When to use |
|-------------------|-----------------|-----------------|-------------|
| **Point** | Small sphere (bead) | — | Rivet, seed |
| **Line / band** | Cylinder, rod | Flat ribbon mesh | Border band on sphere |
| **Disk (filled circle)** | **Sphere** | Hemisphere, lens, short cylinder | Medallion → orb |
| **Ring (annulus)** | **Torus** | Spherical shell (hollow ball), thick washer | Orbit path, chain link |
| **Rectangle / slab** | Box | Rounded box, cage frame | Stele, screen |
| **Frame (inset rect)** | Hollow box shell | Four architrave beams | Tomb chamber walls |
| **Crenellation** | Notched box edge loop | Boolean cubes on rim | Fortress crown |
| **Spike ring (Cn)** | Cones on a **torus** or **sphere latitude** | Radial fins on cylinder | Crown of thorns |
| **Triskelion (C3)** | 3 lobes on **sphere** (meridional bulges) | 3 torus arcs 120° apart | Noble / blood motif |
| **Star / compass (D4)** | 4 cones from center or **stellated** cap | 4 tunnels through sphere | Cardinal gates |
| **Grid / crosshatch** | Displaced grooves on surface | Boolean micro-cuts | “Carved wood” read |
| **Corner loop** | **Torus segment** at vertex | Handle on box corner | Interlock tab |
| **Tile border** | Array on **torus path** (equator) | Strip on box perimeter | Border grammar |

## Symmetry on 3D

| 2D symmetry | 3D symmetry (natural lift) |
|-------------|----------------------------|
| C3 (120° in plane) | 3-fold about **vertical axis** (Z) — same as 2D spun upright |
| C3 on disk | **Tri-lobed sphere** or 3 bulges at equator 120° apart |
| C4 / D4 | 4-fold about Z, or **cube** / octahedral alignment |
| Cn spike ring | **Dihedral** on cylinder, or **polyhedral** belt on sphere |
| Mirror (D) | Mirror planes through axis — left/right of stele |

**Sphere note:** C3 in the plane of the slab ≠ full spherical symmetry. A Zafimaniry slab lifted to a **sphere** usually keeps **one distinguished axis** (pole = “up”, equator = old slab edge).

## Layer stack — 2D vs 3D

```
2D SLAB                    3D LIFT (vessel)
─────────────────────────────────────────────
SLAB (rect + tab)    →     HULL (sphere | ovoid | torus | box cage)
FRAME                →     EQUATORIAL GIRDLE or RIM TORUS
FIELD                →     CARVABLE PATCH (sphere cap, box face)
MOTIF                →     BOSS / DEPRESSION on surface
RING(S)              →     TORUS STACK or LATITUDE SHELLS
ORNAMENT             →     HANDLES, LOOPS, CORNER TORI
FILL (hatch)         →     DISPLACEMENT / GROOVE (depth field)
```

## Three lift strategies (pick per object)

### 1. Compose (primitive swap)

Keep the **same recipe tree**; swap catalog:

- Radial recipe: `sphere(r)` + `torus(r_inner, r_outer)` + `cone_ring(n)`  
- Rect recipe: `rounded_box` + `inset_shell` + `star_boss`

**Best for:** Chain orbit nodes, stele tops, ritual objects.  
**The Chain fit:** P1–P6 each get a genotype → one lifted object.

### 2. Revolve (lathe)

Take the **radial cross-section** of the 2D slab (profile through center) and rotate 360° about the vertical axis.

- Circle in profile → **sphere** (or sphere with equatorial ridge if profile has steps)  
- Stepped rings in profile → **stacked toruses** ( Saturn-like )

**Best for:** Urns, domes, sealed vessels.  
**The Chain fit:** “Core” orb in orbit — the recursion seed as a turned object.

### 3. Project and carve (surface grammar)

Build a **sphere (or box face)**; treat 2D pattern as **height map** in UV space:

- Dark = deep carve, light = proud  
- Hatch → parallel grooves in tangent space

**Best for:** Photo-real carved wood on arbitrary 3D.  
**The Chain fit:** Export normal/depth maps for web relief viewer.

## Circle → sphere (step by step)

1. **2D:** disk radius `R` in slab plane, center at origin.  
2. **Lift A (solid):** `Sphere(center, R)` — filled circle becomes ball.  
3. **Lift B (surface only):** `Sphere(center, R)` hollow or shell thickness `t` → **spherical shell** (if 2D was ring, not disk).  
4. **Carve motif:** For each 2D region inside disk, displace along **outward normal** on sphere:  
   `P_3d = center + R * normal(θ, φ) + depth * normal`  
5. **Preserve C3:** Apply motif stamp in **three spherical wedges** (120° azimuth each).

## Ring → torus

1. **2D:** annulus inner `r0`, outer `r1`.  
2. **Major radius** `R_m = (r0 + r1) / 2`, **minor** `R_t = (r1 - r0) / 2`.  
3. **Torus** `(R_m, R_t)` in XY plane; for vertical stele grammar, rotate torus 90° so hole faces pole.  
4. **Spike ring:** place `n` cones on torus surface at equal arc length.

## Object options for The Chain (draft)

| ID | 2D family | 3D lift | Role |
|----|-----------|---------|------|
| Z1 | Radial C3 disk | Sphere + tri-lobe bosses + spike torus belt | Orbit node / noble |
| Z2 | Ring + crosshatch | Torus + groove displacement | Chain link |
| Z3 | Rect D4 star | Rounded box + 4 compass cones on top face | Stele cap |
| Z4 | Slab + tab | Thin box relief (stay 2.5D) | Roster card / screen |
| Z5 | Full radial recipe | Revolved profile → urn | Memory vessel |
| Z6 | Tile border only | Torus girdle (equator band) | Frame on any hull |

## Pipeline (Blender → web)

```
genotype (JSON)
    → Blender: compose | revolve | project-carve
    → export GLB + normal map + depth map
    → site: Three.js mesh OR relief shader on plane
```

Scenes (tomb, pit) stay **code/CSS/Three** — only **artifacts** come from Blender.

## References in repo

- `docs/slab-pattern-grammar.md` — 2D grammar  
- `blender/zafimaniry_carved.py` — **subtractive** carved slabs (boolean grooves)  
- `blender/zafimaniry_lift.py` — primitive 3D lifts (superseded for detail — carve first, then lift via depth bake)
