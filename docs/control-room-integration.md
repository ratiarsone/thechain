# Control room + slab patterns — integration backlog

Held for later work. Do not wire into the live site until chosen.

## What we have

| Asset | Path |
|-------|------|
| Slab pattern grammar | `docs/slab-pattern-grammar.md` |
| Blender blockouts A–D | `blender/control_rooms.py` |
| Reference slab art | workspace `image-cb48e449-863c-4517-840f-ca4858cfac6d.png` |
| Web orbit / relief | `chain.js` (`makeReliefViewer`, orbit ring) |

## Control room layouts (Blender)

| Key | Name | Geometry |
|-----|------|----------|
| **A** | SeanceCircle | Ring of N thin steles + central son seat |
| **B** | Broadcast | Arc wall of screens behind console |
| **C** | Pit | Pedestals + figures looming above sunken son |
| **D** | Tomb | Four walls, lamba mena shroud, standing steles |

Config at top of script: `SOLO`, `N`, `ORIGINS`. Inhabitant index `i==2` is highlighted red (protagonist slot).

## Planned merge

### Phase 1 — Pick layout

- Run `blender/control_rooms.py` in Blender 4.x
- Set `SOLO = "D"` (or A/B/C) to review one room
- Match camera to Movement I memory staging

### Phase 2 — Stele faces from slab grammar

For each `P*`, `SCREEN*`, `stele*`:

1. Assign a **genome** per memory (P1–P6) from `slab-pattern-grammar.md`
2. Generate SVG or PNG (color + depth)
3. In Blender: image texture + displacement on stele **+Y** face (thin box)
4. Export glTF / renders for web fallback

Suggested mapping (draft):

| Memory | Layout slot | Slab family | Motif idea |
|--------|-------------|-------------|------------|
| P1 Noble | stele 1 | Radial C3 | Triskelion + corner loops |
| P2 Grandmother | stele 2 | Rectilinear D4 | Crenel frame + star |
| P3 Son | stele 3 (red) | Hybrid | Spike ring + grid disk |
| P4 Doctor | stele 4 | Rectilinear | X-square border |
| P5 Cage | stele 5 | Radial | Dense rings, no loops |
| P6 Haizina | center / orb | Dark | Minimal solid + pulse |

### Phase 3 — Web

- Option A: Replace orbit badges with slab SVG textures
- Option B: Use Blender renders as `characters/*-depth.jpg` for relief viewer
- Option C: `slabGen.js` live SVG on roster cards (procedural, no bake)

## Open decisions

- [ ] Which control room (A/B/C/D) is canonical for Movement I?
- [ ] Procedural SVG in browser vs baked Blender textures?
- [ ] Same 6 positions as orbit `FRAGS` / `RECEIVED` order?

## Run Blender script

```
Blender → Scripting → Open blender/control_rooms.py → Run Script
Viewport → Rendered (EEVEE) → scene camera = A by default
```
