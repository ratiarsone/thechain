"""
Zafimaniry 2D → 3D lift demos (The Chain)

Shows how flat grammar primitives become volumes:
  Z1  disk  → sphere + C3 lobes
  Z2  ring  → torus + spike cones
  Z3  frame → hollow rounded box (D4 star on top)
  Z4  slab  → relief plate (2.5D baseline)
  Z5  rings → revolved stack (profile lathe)
  Z6  border→ torus girdle only

Run in Blender: Scripting → Open → Run Script (LIVE_BUILD animates in viewport)
CLI: Blender --background --python zafimaniry_lift.py
"""

import bpy
import bmesh
import math
from mathutils import Vector, Euler

# ---------- CONFIG ----------
OPTIONS = ("Z1", "Z2", "Z3", "Z4", "Z5", "Z6")  # subset e.g. ("Z1","Z2")
SPACING = 5.0
LIVE_BUILD = not bpy.app.background
STEP_DELAY = 0.22
OUT_BLEND = "/Users/macintosh/TheChain/blender/zafimaniry_lift.blend"
SAVE_WHEN_DONE = not LIVE_BUILD

CARVE = (0.55, 0.38, 0.22, 1.0)
WOOD = (0.12, 0.07, 0.04, 1.0)
GROOVE = (0.06, 0.035, 0.02, 1.0)
EMIT_G = (0.1, 0.9, 0.5, 1.0)

build_queue = []
m_wood = m_carve = m_groove = m_emit = None


def redraw():
    for window in bpy.context.window_manager.windows:
        for area in window.screen.areas:
            if area.type == "VIEW_3D":
                area.tag_redraw()
    try:
        bpy.ops.wm.redraw_timer(type="DRAW_WIN_SWAP", iterations=1)
    except Exception:
        pass


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
    for prefix in ("zaf_wood", "zaf_carve", "zaf_groove", "zaf_emit"):
        for m in list(bpy.data.materials):
            if m.name.startswith(prefix):
                bpy.data.materials.remove(m)


def coll(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def put(obj, c):
    for u in obj.users_collection:
        u.objects.unlink(obj)
    c.objects.link(obj)


def setup_materials():
    global m_wood, m_carve, m_groove, m_emit

    def matte(name, rgba, rough=0.85):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = rgba
        bsdf.inputs["Roughness"].default_value = rough
        return m

    m_wood = matte("zaf_wood", WOOD)
    m_carve = matte("zaf_carve", CARVE, 0.7)
    m_groove = matte("zaf_groove", GROOVE, 0.95)
    m_emit = matte("zaf_emit", EMIT_G, 0.4)


def assign_mat(obj, m):
    if obj.data.materials:
        obj.data.materials[0] = m
    else:
        obj.data.materials.append(m)


def add_label(text, loc, c):
    bpy.ops.object.text_add(location=loc)
    o = bpy.context.active_object
    o.data.body = text
    o.data.size = 0.35
    o.rotation_euler = (math.radians(90), 0, 0)
    assign_mat(o, m_emit)
    put(o, c)


def add_uv_sphere(loc, r, c, name, mat=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=48, ring_count=24)
    o = bpy.context.active_object
    o.name = name
    assign_mat(o, mat or m_wood)
    put(o, c)
    return o


def add_torus(loc, major, minor, c, name, rot=None, mat=None):
    bpy.ops.mesh.primitive_torus_add(
        location=loc, major_radius=major, minor_radius=minor,
        major_segments=48, minor_segments=16,
    )
    o = bpy.context.active_object
    o.name = name
    if rot:
        o.rotation_euler = rot
    assign_mat(o, mat or m_wood)
    put(o, c)
    return o


def add_box(loc, scale, c, name, mat=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.scale = scale
    o.name = name
    assign_mat(o, mat or m_wood)
    put(o, c)
    return o


def add_cone(loc, r1, depth, c, name, rot=None, mat=None):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, depth=depth, location=loc)
    o = bpy.context.active_object
    o.name = name
    if rot:
        o.rotation_euler = rot
    assign_mat(o, mat or m_carve)
    put(o, c)
    return o


def c3_lobes_on_sphere(center, r, c, prefix):
    """2D triskelion lift: three meridional bulges on sphere (C3)."""
    for i in range(3):
        ang = math.radians(120 * i)
        lx = center.x + r * 0.55 * math.cos(ang)
        ly = center.y + r * 0.55 * math.sin(ang)
        lz = center.z + r * 0.15
        add_uv_sphere((lx, ly, lz), r * 0.28, c, f"{prefix}_lobe{i+1}", m_carve)


def spike_ring_on_torus(center, major, minor, n, c, prefix):
    for i in range(n):
        t = 2 * math.pi * i / n
        x = center.x + major * math.cos(t)
        y = center.y + major * math.sin(t)
        z = center.z + minor * 1.2
        rot = (math.pi / 2, 0, t)
        add_cone((x, y, z), minor * 0.35, minor * 1.1, c, f"{prefix}_spike{i+1}", rot, m_carve)


def star_cones_on_plane(center, r, c, prefix, z=0.6):
    """D4 compass star → four cones from disk."""
    for i in range(4):
        ang = math.radians(45 + 90 * i)
        x = center.x + r * 0.65 * math.cos(ang)
        y = center.y + r * 0.65 * math.sin(ang)
        rot = (math.pi / 2, 0, ang - math.pi / 2)
        add_cone((x, y, center.z + z), r * 0.12, r * 0.5, c, f"{prefix}_arm{i+1}", rot, m_carve)


def carve_grooves_box(obj, spacing=0.08, depth=0.02):
    """Parallel groove impression via displacement."""
    tex = bpy.data.textures.new(f"{obj.name}_groove", type="CLOUDS")
    tex.noise_scale = 2.5
    disp = obj.modifiers.new("GrooveDisp", "DISPLACE")
    disp.texture = tex
    disp.strength = depth
    disp.mid_level = 0.5


# ---------- OPTIONS ----------
def build_Z1(origin, c):
    """disk → sphere + C3 lobes + equatorial torus (ring lift)."""
    o = Vector(origin)
    enqueue("label", lambda: add_label("Z1 disk→sphere", (o.x, o.y - 2.2, o.z + 1.8), c))
    enqueue("sphere", lambda: add_uv_sphere(tuple(o), 1.0, c, "Z1_sphere", m_wood))
    enqueue("C3 lobes", lambda: c3_lobes_on_sphere(o, 1.0, c, "Z1"))
    enqueue("ring→torus", lambda: add_torus(
        tuple(o), 1.05, 0.08, c, "Z1_belt", (math.pi / 2, 0, 0), m_groove))


def build_Z2(origin, c):
    """annulus → torus + spike ring."""
    o = Vector(origin)
    r0, r1 = 0.55, 0.95
    Rm, Rt = (r0 + r1) / 2, (r1 - r0) / 2
    enqueue("label", lambda: add_label("Z2 ring→torus", (o.x, o.y - 2.2, o.z + 1.2), c))
    enqueue("torus", lambda: add_torus(tuple(o), Rm, Rt, c, "Z2_torus", mat=m_wood))
    enqueue("spikes", lambda: spike_ring_on_torus(o, Rm, Rt, 24, c, "Z2"))


def build_Z3(origin, c):
    """rect frame → shell box + D4 star on top."""
    o = Vector(origin)
    enqueue("label", lambda: add_label("Z3 frame→cage", (o.x, o.y - 2.5, o.z + 2.2), c))
    enqueue("outer", lambda: add_box(tuple(o), (1.2, 1.2, 1.2), c, "Z3_outer", m_wood))
    enqueue("inner void", lambda: add_box(tuple(o), (0.95, 0.95, 0.95), c, "Z3_inner", m_groove))
    enqueue("D4 star", lambda: star_cones_on_plane(o, 1.0, c, "Z3", z=1.35))


def build_Z4(origin, c):
    """slab baseline — 2.5D relief plate (not full lift)."""
    o = Vector(origin)
    enqueue("label", lambda: add_label("Z4 slab 2.5D", (o.x, o.y - 2.0, o.z + 0.5), c))
    enqueue("plate", lambda: add_box((o.x, o.y, o.z + 0.08), (1.4, 0.12, 1.8), c, "Z4_slab", m_wood))
    enqueue("boss", lambda: add_uv_sphere((o.x, o.y - 0.15, o.z + 0.55), 0.45, c, "Z4_boss", m_carve))
    enqueue("tab", lambda: add_box((o.x - 1.55, o.y - 0.15, o.z + 0.2), (0.2, 0.08, 0.35), c, "Z4_tab", m_groove))


def build_Z5(origin, c):
    """revolve: stacked rings in profile → lathe-like urn."""
    o = Vector(origin)
    enqueue("label", lambda: add_label("Z5 revolve urn", (o.x, o.y - 2.2, o.z + 2.5), c))
    radii = [0.35, 0.75, 1.0, 0.85, 0.5]
    heights = [0.0, 0.35, 0.75, 1.15, 1.5]

    def _stack():
        for i, (r, h) in enumerate(zip(radii, heights)):
            add_uv_sphere((o.x, o.y, o.z + h), r, c, f"Z5_band{i}", m_carve if i % 2 else m_wood)

    enqueue("lathe stack", _stack)
    enqueue("cap", lambda: add_uv_sphere((o.x, o.y, o.z + 1.75), 0.3, c, "Z5_cap", m_groove))


def build_Z6(origin, c):
    """border tile → torus girdle (equator band only)."""
    o = Vector(origin)
    enqueue("label", lambda: add_label("Z6 border girdle", (o.x, o.y - 2.0, o.z + 1.0), c))
    enqueue("core", lambda: add_uv_sphere(tuple(o), 0.9, c, "Z6_core", m_wood))
    enqueue("girdle", lambda: add_torus(tuple(o), 0.92, 0.14, c, "Z6_girdle", (math.pi / 2, 0, 0), m_carve))
    for i in range(12):
        t = 2 * math.pi * i / 12

        def _bead(ii=i, tt=t):
            x = o.x + 0.92 * math.cos(tt)
            y = o.y + 0.92 * math.sin(tt)
            add_uv_sphere((x, y, o.z), 0.1, c, f"Z6_tile{ii}", m_groove)

        enqueue(f"tile {i+1}", _bead)


BUILDERS = {
    "Z1": build_Z1,
    "Z2": build_Z2,
    "Z3": build_Z3,
    "Z4": build_Z4,
    "Z5": build_Z5,
    "Z6": build_Z6,
}
LABELS = {
    "Z1": "Sphere + C3 (disk lift)",
    "Z2": "Torus + spikes (ring lift)",
    "Z3": "Cage + D4 star (frame lift)",
    "Z4": "Relief slab (2.5D ref)",
    "Z5": "Revolved urn (profile lift)",
    "Z6": "Equator girdle (border lift)",
}


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
    bg.inputs["Color"].default_value = (0.015, 0.02, 0.018, 1)
    bg.inputs["Strength"].default_value = 0.2
    bpy.ops.object.light_add(type="SUN", location=(6, -4, 8))
    sun = bpy.context.active_object
    sun.data.energy = 2.5


def queue_all():
    n = len(OPTIONS)
    for i, key in enumerate(OPTIONS):
        x = (i - (n - 1) / 2) * SPACING
        collection = coll(f"ZAF_{key}")
        origin = (x, 0, 0)

        def _opt(k=key, col=collection, org=origin):
            BUILDERS[k](org, col)

        enqueue(f"=== {key} {LABELS[key]} ===", _opt)


def finish():
    setup_scene()
    print(">>> Zafimaniry 2D→3D lift options built:")
    for k in OPTIONS:
        print(f"    {k}: {LABELS[k]}")
    if SAVE_WHEN_DONE:
        try:
            bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
            print(f">>> Saved {OUT_BLEND}")
        except Exception as e:
            print(f">>> Save failed: {e}")


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
    setup_materials()
    queue_all()
    if LIVE_BUILD:
        print(">>> Live build — 6 lift demos. Viewport: Solid or Material Preview")
        bpy.app.timers.register(tick, first_interval=0.05)
    else:
        while build_queue:
            _, fn = build_queue.pop(0)
            fn()
        finish()


start()
