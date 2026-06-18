"""
Zafimaniry carved slabs — subtractive relief (boolean grooves)

Blender: Scripting → Open → Run Script
Press . (period) to zoom selected panel.  Numpad 0 = camera view.

Output: blender/zafimaniry_carved.blend
"""

import bpy
import math
from mathutils import Vector

LIVE_BUILD = not bpy.app.background
STEP_DELAY = 0.25
OUT_BLEND = "/Users/macintosh/TheChain/blender/zafimaniry_carved.blend"
SAVE_WHEN_DONE = not LIVE_BUILD

CARVE_DEPTH = 0.024
FINE_DEPTH = 0.014
SLAB_W, SLAB_H, SLAB_T = 1.35, 1.0, 0.09
TOP_Z = SLAB_T - 0.004
PANEL_X = (-0.78, 0.78)

build_queue = []
m_wood = None
cutter_coll = None


def redraw():
    for window in bpy.context.window_manager.windows:
        for area in window.screen.areas:
            if area.type == "VIEW_3D":
                area.tag_redraw()


def enqueue(label, fn):
    if LIVE_BUILD:
        build_queue.append((label, fn))
    else:
        fn()


def reset():
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for nm in list(bpy.data.collections.keys()):
        if nm.startswith("ZAF_"):
            bpy.data.collections.remove(bpy.data.collections[nm])
    for m in list(bpy.data.materials):
        if m.name.startswith("zaf_"):
            bpy.data.materials.remove(m)


def coll(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def put(obj, c):
    for u in obj.users_collection:
        u.objects.unlink(obj)
    c.objects.link(obj)


def setup_material():
    global m_wood
    m = bpy.data.materials.new("zaf_wood")
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.45, 0.28, 0.15, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.7
    m_wood = m


def drop_cutters():
    global cutter_coll
    if cutter_coll and cutter_coll.name in bpy.data.collections:
        for obj in list(cutter_coll.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        bpy.data.collections.remove(cutter_coll)
    cutter_coll = None


def new_cutter():
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    o = bpy.context.active_object
    put(o, cutter_coll)
    return o


def top_box(o, cx, cy, sx, sy, depth, rot_z=0.0):
    depth = min(depth, CARVE_DEPTH * 1.05)
    cz = TOP_Z - depth * 0.5
    o.location = (cx, cy, cz)
    o.rotation_euler = (0, 0, rot_z)
    o.scale = (max(sx, 0.002), max(sy, 0.002), depth * 0.5)


def in_annulus(x, y, cx, cy, r0, r1):
    return r0 <= math.hypot(x - cx, y - cy) <= r1


def in_disk(x, y, cx, cy, r):
    return math.hypot(x - cx, y - cy) <= r


def ring_segments(cx, cy, r, seg_len, seg_w, depth, n, tangent=False):
    cutters = []
    for i in range(n):
        a = 2 * math.pi * i / n
        px = cx + r * math.cos(a)
        py = cy + r * math.sin(a)
        c = new_cutter()
        rot = a + (math.pi / 2 if tangent else 0)
        top_box(c, px, py, seg_len * 0.5, seg_w * 0.5, depth, rot)
        cutters.append(c)
    return cutters


def lattice_ring(cx, cy, r0, r1, depth):
    cutters = []
    r_mid = (r0 + r1) * 0.5
    seg = (r1 - r0) * 0.9
    for ang in (0, math.pi / 3, 2 * math.pi / 3):
        for i in range(24):
            t = 2 * math.pi * i / 24
            px = cx + r_mid * math.cos(t)
            py = cy + r_mid * math.sin(t)
            if not in_annulus(px, py, cx, cy, r0, r1):
                continue
            c = new_cutter()
            top_box(c, px, py, seg * 0.35, 0.007, depth, ang)
            cutters.append(c)
    return cutters


def hatch_disk(cx, cy, r, spacing, depth, angle, max_lines=12):
    cutters = []
    ca, sa = math.cos(angle), math.sin(angle)
    for i in range(-max_lines, max_lines + 1):
        ox = cx + (-sa * i * spacing)
        oy = cy + (ca * i * spacing)
        if not in_disk(ox, oy, cx, cy, r):
            continue
        c = new_cutter()
        top_box(c, ox, oy, r * 0.5, spacing * 0.2, depth, angle)
        cutters.append(c)
    return cutters


def crescent_carve(cx, cy, r, arc_w, rot, depth, hatch_spacing):
    cutters = []
    for s in range(14):
        t = -0.45 + 0.9 * s / 13
        a = rot + t
        px = cx + r * math.cos(a)
        py = cy + r * math.sin(a)
        c = new_cutter()
        top_box(c, px, py, arc_w * 0.45, 0.013, depth, a + math.pi / 2)
        cutters.append(c)
    cutters += hatch_disk(
        cx + math.cos(rot) * r * 0.5,
        cy + math.sin(rot) * r * 0.5,
        arc_w * 0.65,
        hatch_spacing,
        depth * 0.85,
        rot,
        6,
    )
    return cutters


def corner_ear(cx, cy, corner_x, corner_y, ear_r, depth):
    cutters = []
    ang = math.atan2(corner_y - cy, corner_x - cx)
    for s in range(8):
        t = -math.pi / 2 + math.pi * s / 7
        a = ang + t
        px = cx + ear_r * 0.6 * math.cos(a)
        py = cy + ear_r * 0.6 * math.sin(a)
        c = new_cutter()
        top_box(c, px, py, ear_r * 0.26, 0.011, depth, a)
        cutters.append(c)
    return cutters


def grid_pockets(cx, cy, r, cell, depth):
    cutters = []
    n = int(r / cell)
    for ix in range(-n, n + 1):
        for iy in range(-n, n + 1):
            px = cx + ix * cell
            py = cy + iy * cell
            if not in_disk(px, py, cx, cy, r - cell * 0.2):
                continue
            c = new_cutter()
            top_box(c, px, py, cell * 0.32, cell * 0.32, depth)
            cutters.append(c)
    return cutters


def border_tiles(x0, y0, x1, y1, band, cell, depth):
    cutters = []

    def tile(px, py):
        c = new_cutter()
        top_box(c, px, py, cell * 0.36, cell * 0.36, depth)
        cutters.append(c)
        for rot in (math.pi / 4, -math.pi / 4):
            c2 = new_cutter()
            top_box(c2, px, py, cell * 0.48, 0.005, depth * 0.9, rot)
            cutters.append(c2)

    x = x0 + cell * 0.55
    while x < x1 - cell * 0.5:
        tile(x, y0 + band * 0.5)
        tile(x, y1 - band * 0.5)
        x += cell
    y = y0 + cell * 0.55
    while y < y1 - cell * 0.5:
        tile(x0 + band * 0.5, y)
        tile(x1 - band * 0.5, y)
        y += cell
    return cutters


def crenellate(x0, y0, x1, y1, inset, step_w, step_h, depth):
    cutters = []
    ix0, iy0 = x0 + inset, y0 + inset
    ix1, iy1 = x1 - inset, y1 - inset
    for edge in ("bottom", "top", "left", "right"):
        x, y = ix0, iy0
        flip = False
        limit = ix1 if edge in ("bottom", "top") else iy1
        while (x if edge in ("bottom", "top") else y) < limit - step_w * 0.5:
            if edge == "bottom":
                sx, sy = x + step_w * 0.5, iy0 - (step_h * 0.45 if flip else 0)
                x += step_w
            elif edge == "top":
                sx, sy = x + step_w * 0.5, iy1 + (step_h * 0.45 if flip else 0)
                x += step_w
            elif edge == "left":
                sx, sy = ix0 - (step_h * 0.45 if flip else 0), y + step_w * 0.5
                y += step_w
            else:
                sx, sy = ix1 + (step_h * 0.45 if flip else 0), y + step_w * 0.5
                y += step_w
            c = new_cutter()
            if edge in ("bottom", "top"):
                top_box(c, sx, sy, step_w * 0.42, step_h * 0.42, depth)
            else:
                top_box(c, sx, sy, step_h * 0.42, step_w * 0.42, depth)
            cutters.append(c)
            flip = not flip
    return cutters


def frame_border(x0, y0, x1, y1, band, depth):
    cutters = []
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    for cx, cy, sx, sy in (
        (mx, y0 + band / 2, (x1 - x0) / 2, band / 2),
        (mx, y1 - band / 2, (x1 - x0) / 2, band / 2),
        (x0 + band / 2, my, band / 2, (y1 - y0) / 2),
        (x1 - band / 2, my, band / 2, (y1 - y0) / 2),
    ):
        c = new_cutter()
        top_box(c, cx, cy, sx, sy, depth)
        cutters.append(c)
    return cutters


def side_tab(cx, cy):
    c = new_cutter()
    top_box(c, cx - SLAB_W / 2 - 0.05, cy + 0.04, 0.06, 0.1, CARVE_DEPTH * 1.2)
    return [c]


def make_slab(cx, cy, name, collection):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(cx, cy, SLAB_T / 2))
    slab = bpy.context.active_object
    slab.name = name
    slab.scale = (SLAB_W, SLAB_H, SLAB_T)
    bpy.ops.object.transform_apply(scale=True)
    slab.location = (cx, cy, SLAB_T / 2)
    slab.data.materials.append(m_wood)
    put(slab, collection)
    return slab


def polish_slab(slab):
    if not mesh_ok(slab):
        return
    bpy.context.view_layer.objects.active = slab
    slab.select_set(True)
    bpy.ops.object.shade_smooth()
    if hasattr(slab.data, "use_auto_smooth"):
        slab.data.use_auto_smooth = True
        slab.data.auto_smooth_angle = math.radians(42)


def mesh_ok(obj):
    return obj and obj.type == "MESH" and len(obj.data.vertices) >= 8


def slab_intact(slab):
    if not mesh_ok(slab):
        return False
    d = slab.dimensions
    return d.x > SLAB_W * 0.55 and d.y > SLAB_H * 0.55 and d.z > SLAB_T * 0.35


def join_cutters(cutters):
    valid = [c for c in cutters if c and c.name in bpy.data.objects]
    if not valid:
        return None
    bpy.ops.object.select_all(action="DESELECT")
    for c in valid:
        c.select_set(True)
    bpy.context.view_layer.objects.active = valid[0]
    if len(valid) > 1:
        bpy.ops.object.join()
    return bpy.context.active_object


def mesh_backup(slab):
    return slab.data.copy()


def mesh_restore(slab, backup):
    bad = slab.data
    slab.data = backup
    if bad and bad.users == 0:
        bpy.data.meshes.remove(bad)


def boolean_carve(slab, cutter):
    if not cutter or not mesh_ok(slab):
        return False
    backup = mesh_backup(slab)
    mod = slab.modifiers.new("Carve", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    try:
        mod.solver = "EXACT"
    except Exception:
        pass
    bpy.context.view_layer.objects.active = slab
    slab.select_set(True)
    try:
        bpy.ops.object.modifier_apply(modifier=mod.name)
    except RuntimeError as e:
        print(f"    boolean failed: {e}")
        if mod.name in slab.modifiers:
            slab.modifiers.remove(mod)
        mesh_restore(slab, backup)
        bpy.data.objects.remove(cutter, do_unlink=True)
        return False
    bpy.data.objects.remove(cutter, do_unlink=True)
    if mesh_ok(slab) and slab_intact(slab):
        bpy.data.meshes.remove(backup)
        return True
    mesh_restore(slab, backup)
    return False


def boolean_carve_batch(slab, cutters, batch=6):
    if not cutters or not mesh_ok(slab):
        return False
    applied = 0
    i = 0
    while i < len(cutters) and mesh_ok(slab):
        chunk = [c for c in cutters[i : i + batch] if c and c.name in bpy.data.objects]
        i += batch
        if not chunk:
            continue
        joined = join_cutters(chunk) if len(chunk) > 1 else chunk[0]
        if joined and boolean_carve(slab, joined):
            applied += len(chunk)
    print(f"    carved {applied}/{len(cutters)} grooves")
    return applied > 0 and mesh_ok(slab)


def stand_up(slab):
    """Rotate in place — no translation, so no debris offset."""
    cx, cy = slab.location.x, slab.location.y
    slab.rotation_euler = (math.radians(90), 0, 0)
    slab.location = (cx, cy, SLAB_H / 2)


def build_radial(cx, collection):
    global cutter_coll

    def run():
        global cutter_coll
        cutter_coll = coll("ZAF_cutters_tmp")
        slab = make_slab(cx, 0, "Slab_Radial_C3", collection)
        hw, hh = SLAB_W / 2, SLAB_H / 2
        cutters = []
        cutters += side_tab(cx, 0)
        cutters += lattice_ring(cx, 0, 0.36, 0.47, FINE_DEPTH)
        cutters += ring_segments(cx, 0, 0.345, 0.06, 0.008, FINE_DEPTH, 36, tangent=True)
        cutters += hatch_disk(cx, 0, 0.28, 0.05, CARVE_DEPTH, 0, 9)
        cutters += hatch_disk(cx, 0, 0.28, 0.05, CARVE_DEPTH, math.pi / 2, 9)
        for i in range(3):
            rot = math.pi / 2 + i * 2 * math.pi / 3
            cutters += crescent_carve(cx, 0, 0.12, 0.085, rot, CARVE_DEPTH, 0.024)
        for corner in ((cx - hw, -hh), (cx + hw, -hh), (cx - hw, hh), (cx + hw, hh)):
            cutters += corner_ear(cx, 0, corner[0], corner[1], 0.16, CARVE_DEPTH)
        ok = boolean_carve_batch(slab, cutters, batch=4)
        polish_slab(slab)
        stand_up(slab)
        print(f"    radial verts: {len(slab.data.vertices)}")
        if not ok:
            print("    WARN: radial carve incomplete")
        drop_cutters()

    return run


def build_rect(cx, collection):
    global cutter_coll

    def run():
        global cutter_coll
        cutter_coll = coll("ZAF_cutters_tmp")
        slab = make_slab(cx, 0, "Slab_Rect_D4", collection)
        hw, hh = SLAB_W / 2, SLAB_H / 2
        x0, y0 = cx - hw, -hh
        x1, y1 = cx + hw, hh
        band = 0.13
        cutters = []
        cutters += side_tab(cx, 0)
        cutters += frame_border(x0, y0, x1, y1, band, CARVE_DEPTH * 0.8)
        cutters += border_tiles(x0, y0, x1, y1, band, 0.085, CARVE_DEPTH)
        cutters += crenellate(x0, y0, x1, y1, band * 1.02, 0.065, 0.04, CARVE_DEPTH)
        cutters += grid_pockets(cx, 0, 0.13, 0.048, FINE_DEPTH)
        for i in range(4):
            a = math.pi / 4 + i * math.pi / 2
            for u in range(5):
                r = 0.14 + 0.2 * (u + 1) / 5
                px = cx + r * math.cos(a)
                py = r * math.sin(a)
                c = new_cutter()
                top_box(c, px, py, 0.05, 0.009, CARVE_DEPTH, a)
                cutters.append(c)
            cutters += hatch_disk(cx, 0, 0.36, 0.028, CARVE_DEPTH * 0.75, a, 5)
        ok = boolean_carve_batch(slab, cutters, batch=4)
        polish_slab(slab)
        stand_up(slab)
        print(f"    rect verts: {len(slab.data.vertices)}")
        if not ok:
            print("    WARN: rect carve incomplete")
        drop_cutters()

    return run


def add_ground():
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
    ground = bpy.context.active_object
    ground.name = "Ground"
    mat = bpy.data.materials.new("zaf_ground")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.4, 0.4, 0.42, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.85
    ground.data.materials.append(mat)


def setup_scene():
    sc = bpy.context.scene
    try:
        sc.render.engine = "BLENDER_EEVEE_NEXT"
    except Exception:
        sc.render.engine = "BLENDER_EEVEE"
    w = sc.world or bpy.data.worlds.new("World")
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0.5, 0.52, 0.55, 1)
    bg.inputs["Strength"].default_value = 1.0
    add_ground()
    bpy.ops.object.light_add(type="AREA", location=(0.4, -2.0, 2.4))
    key = bpy.context.active_object
    key.name = "Key"
    key.data.energy = 400
    key.data.size = 3.5
    bpy.ops.object.light_add(type="AREA", location=(-1.6, -0.8, 1.5))
    fill = bpy.context.active_object
    fill.name = "Fill"
    fill.data.energy = 240
    fill.data.size = 2.5
    bpy.ops.object.camera_add(location=(0, -2.1, 0.95))
    cam = bpy.context.active_object
    cam.name = "Camera"
    target = Vector((0, 0, SLAB_H * 0.48))
    direction = target - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam


def frame_view():
    slabs = [o for o in bpy.data.objects if o.name.startswith("Slab_")]
    bpy.ops.object.select_all(action="DESELECT")
    for o in slabs:
        o.select_set(True)
    if slabs:
        bpy.context.view_layer.objects.active = slabs[0]
    for window in bpy.context.window_manager.windows:
        for area in window.screen.areas:
            if area.type != "VIEW_3D":
                continue
            for region in area.regions:
                if region.type != "WINDOW":
                    continue
                with bpy.context.temp_override(window=window, area=area, region=region):
                    if slabs:
                        bpy.ops.view3d.view_selected()
                    else:
                        bpy.ops.view3d.view_all(center=True)


def queue_build():
    main = coll("ZAF_CARVED")
    enqueue("radial panel", build_radial(PANEL_X[0], main))
    enqueue("rect panel", build_rect(PANEL_X[1], main))


def finish():
    setup_scene()
    frame_view()
    extras = [o.name for o in bpy.data.objects if o.type == "MESH" and not o.name.startswith(("Slab_", "Ground"))]
    if extras:
        print(f"    WARN leftover meshes: {extras}")
    for o in bpy.data.objects:
        if o.type == "MESH" and o.name.startswith("Slab_"):
            print(f"    {o.name}: loc={tuple(round(v, 2) for v in o.location)}, dims={tuple(round(v, 3) for v in o.dimensions)}, verts={len(o.data.vertices)}")
    print(">>> Done — open ZAF_CARVED, press . to zoom, Numpad 0 for camera")
    if SAVE_WHEN_DONE:
        bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
        print(f">>> Saved {OUT_BLEND}")


def tick():
    if not build_queue:
        finish()
        return None
    label, fn = build_queue.pop(0)
    print(f"  + {label}")
    fn()
    redraw()
    return STEP_DELAY


def start():
    reset()
    setup_material()
    queue_build()
    if LIVE_BUILD:
        print(">>> Building carved panels…")
        bpy.app.timers.register(tick, first_interval=0.15)
    else:
        while build_queue:
            _, fn = build_queue.pop(0)
            fn()
        finish()


start()
