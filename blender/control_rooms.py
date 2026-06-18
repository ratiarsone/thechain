"""
The Chain — Movement I control room blockouts (Blender)

Run inside Blender (Scripting → Open → Run Script) to watch LIVE_BUILD steps.
CLI: Blender --background --python control_rooms.py  (instant, no animation)

See docs/slab-pattern-grammar.md for future stele face textures.
"""

import bpy
import math
from mathutils import Vector

# ---------- CONFIG ----------
SOLO = "D"  # "A" Seance | "B" Broadcast | "C" Pit | "D" Tomb | None = all four
N = 6
ORIGINS = {
    "A": Vector((-60, 0, 0)),
    "B": Vector((-20, 0, 0)),
    "C": Vector((20, 0, 0)),
    "D": Vector((60, 0, 0)),
}
CENTER = Vector((0, 0, 0))
BLEND_OUT = "/Users/macintosh/TheChain/blender/chain_control_room.blend"

# Animate when run from Blender UI; instant when --background
LIVE_BUILD = not bpy.app.background
STEP_DELAY = 0.28  # seconds between pieces (UI only)
SAVE_WHEN_DONE = not LIVE_BUILD

GREEN = (0.1, 0.9, 0.5)
RED = (0.95, 0.15, 0.12)
DARK = (0.02, 0.03, 0.025)

build_queue = []
cams = {}
m_dark = m_seat = m_g = m_r = m_shroud = None


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
        if nm.startswith("CTRL_"):
            bpy.data.collections.remove(bpy.data.collections[nm])
    for nm in ("m_dark", "m_seat", "m_g", "m_r", "m_shroud"):
        if nm in bpy.data.materials:
            bpy.data.materials.remove(bpy.data.materials[nm])
    bpy.context.scene.cursor.location = (0, 0, 0)


def coll(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def put(obj, c):
    for u in obj.users_collection:
        u.objects.unlink(obj)
    c.objects.link(obj)


def setup_materials():
    global m_dark, m_seat, m_g, m_r, m_shroud

    def _emis(name, rgb, s):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        nt.nodes.clear()
        o = nt.nodes.new("ShaderNodeOutputMaterial")
        e = nt.nodes.new("ShaderNodeEmission")
        e.inputs["Color"].default_value = (*rgb, 1)
        e.inputs["Strength"].default_value = s
        nt.links.new(e.outputs["Emission"], o.inputs["Surface"])
        return m

    def _matte(name, rgb):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes.get("Principled BSDF")
        b.inputs["Base Color"].default_value = (*rgb, 1)
        b.inputs["Roughness"].default_value = 0.9
        return m

    m_dark = _matte("m_dark", DARK)
    m_seat = _emis("m_seat", GREEN, 4)
    m_g = _emis("m_g", GREEN, 3)
    m_r = _emis("m_r", RED, 5)
    m_shroud = _emis("m_shroud", (0.6, 0.05, 0.05), 2)


def cyl(loc, r, d, c, m, name="cyl"):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(m)
    put(o, c)
    return o


def box(loc, scale, c, m, name="box"):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.scale = scale
    o.name = name
    o.data.materials.append(m)
    put(o, c)
    return o


def add_light(loc, energy, rgb, c, kind="POINT"):
    bpy.ops.object.light_add(type=kind, location=loc)
    o = bpy.context.active_object
    o.data.energy = energy
    o.data.color = rgb
    put(o, c)
    return o


def add_cam(loc, target, c, lens=35):
    bpy.ops.object.empty_add(location=target)
    t = bpy.context.active_object
    put(t, c)
    bpy.ops.object.camera_add(location=loc)
    o = bpy.context.active_object
    o.data.lens = lens
    con = o.constraints.new("TRACK_TO")
    con.target = t
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"
    put(o, c)
    return o


def ring(o, c, radius, h, seat_z=0.2, floor=True):
    if floor:
        enqueue("floor", lambda: cyl((o.x, o.y, 0), radius + 2, 0.2, c, m_dark, "floor"))
    enqueue("son seat", lambda: cyl((o.x, o.y, seat_z), 1.2, 0.4, c, m_seat, "SEAT_son"))
    for i in range(N):
        a = 2 * math.pi * i / N
        x = o.x + radius * math.cos(a)
        y = o.y + radius * math.sin(a)
        mat = m_r if i == 2 else m_g
        idx = i

        def _stele(ii=idx, xx=x, yy=y, aa=a, mm=mat):
            s = box((xx, yy, h / 2), (0.15, 1.1, h / 2), c, mm, f"P{ii + 1}")
            s.rotation_euler = (0, 0, aa + math.pi / 2)

        enqueue(f"stele P{idx + 1}", _stele)
    enqueue("key light", lambda: add_light((o.x, o.y, 8), 300, GREEN, c))
    enqueue("fill light", lambda: add_light((o.x + 6, o.y - 6, 5), 120, (1, 1, 1), c))


def buildA(o, c):
    ring(o, c, radius=6, h=2.2, seat_z=0.15)
    enqueue("camera", lambda: add_cam(o + Vector((0, -13, 2.2)), o + Vector((0, 0, 1.3)), c, lens=40))


def buildB(o, c):
    enqueue("floor", lambda: cyl((o.x, o.y, 0), 12, 0.2, c, m_dark, "floor"))
    enqueue("console", lambda: box((o.x, o.y + 3, 1.2), (3, 0.6, 0.5), c, m_dark, "console"))
    enqueue("son seat", lambda: cyl((o.x, o.y + 4.5, 1.4), 1.0, 0.3, c, m_seat, "SEAT_son"))
    for i in range(N):
        a = math.radians(-60 + 120 * i / (N - 1))
        R = 7
        x = o.x + R * math.sin(a)
        y = o.y - 2 + R * math.cos(a)
        mat = m_r if i == 2 else m_g
        idx = i

        def _screen(ii=idx, xx=x, yy=y, aa=a, mm=mat):
            s = box((xx, yy, 2.2), (1.1, 0.12, 1.3), c, mm, f"SCREEN{ii + 1}")
            s.rotation_euler = (0, 0, -aa)

        enqueue(f"screen {idx + 1}", _screen)
    enqueue("key light", lambda: add_light((o.x, o.y + 2, 7), 350, GREEN, c))
    enqueue("fill light", lambda: add_light((o.x, o.y + 6, 3), 100, (1, 1, 1), c))
    enqueue("camera", lambda: add_cam(o + Vector((0, 9, 3.2)), o + Vector((0, -1, 2)), c, lens=35))


def buildC(o, c):
    enqueue("rim", lambda: cyl((o.x, o.y, 0), 12, 0.2, c, m_dark, "rim"))
    enqueue("pit floor", lambda: cyl((o.x, o.y, -1.6), 3, 0.3, c, m_dark, "pit_floor"))
    enqueue("son seat", lambda: cyl((o.x, o.y, -1.45), 1.0, 0.3, c, m_seat, "SEAT_son"))
    for i in range(N):
        a = 2 * math.pi * i / N
        x = o.x + 6 * math.cos(a)
        y = o.y + 6 * math.sin(a)
        mat = m_r if i == 2 else m_g
        idx = i

        def _ped(ii=idx, xx=x, yy=y, mm=mat):
            cyl((xx, yy, 1.2), 0.7, 2.4, c, m_dark, f"ped{ii + 1}")
            box((xx, yy, 3.0), (0.6, 0.6, 0.6), c, mm, f"P{ii + 1}")

        enqueue(f"pedestal {idx + 1}", _ped)
    enqueue("key light", lambda: add_light((o.x, o.y, 9), 250, GREEN, c))
    enqueue("camera", lambda: add_cam(o + Vector((0, -11, -0.4)), o + Vector((0, 0, 2.5)), c, lens=30))


def buildD(o, c):
    enqueue("floor", lambda: cyl((o.x, o.y, 0), 9, 0.2, c, m_dark, "floor"))
    for wi, s in enumerate([(-8, 0), (8, 0), (0, -8), (0, 8)]):
        sx, sy = s

        def _wall(ox=o.x, oy=o.y, sx=sx, sy=sy):
            box(
                (ox + sx, oy + sy, 2.5),
                (0.3 if sx else 8, 8 if sx else 0.3, 2.5),
                c,
                m_dark,
                f"wall_{sx}_{sy}",
            )

        enqueue(f"wall {wi + 1}", _wall)
    enqueue("lamba mena", lambda: box((o.x, o.y, 0.3), (2, 2, 0.25), c, m_shroud, "lamba_mena"))
    enqueue("son seat", lambda: cyl((o.x, o.y, 0.7), 0.9, 0.4, c, m_seat, "SEAT_son"))
    for i in range(N):
        a = 2 * math.pi * i / N
        x = o.x + 6.2 * math.cos(a)
        y = o.y + 6.2 * math.sin(a)
        mat = m_r if i == 2 else m_g
        idx = i

        def _stele(ii=idx, xx=x, yy=y, mm=mat):
            box((xx, yy, 1.8), (0.5, 0.5, 1.8), c, mm, f"stele{ii + 1}")

        enqueue(f"stele {idx + 1}", _stele)
    enqueue("green light", lambda: add_light((o.x, o.y, 7), 220, GREEN, c))
    enqueue("red light", lambda: add_light((o.x, o.y, 2), 80, RED, c))
    enqueue("camera", lambda: add_cam(o + Vector((0, -13, 3)), o + Vector((0, 0, 1.5)), c, lens=35))


BUILDERS = {"A": buildA, "B": buildB, "C": buildC, "D": buildD}
NAMES = {"A": "SeanceCircle", "B": "Broadcast", "C": "Pit", "D": "Tomb"}


def setup_world(active_cam_key):
    w = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0.01, 0.02, 0.015, 1)
    bg.inputs["Strength"].default_value = 0.15
    sc = bpy.context.scene
    try:
        sc.render.engine = "BLENDER_EEVEE_NEXT"
    except Exception:
        sc.render.engine = "BLENDER_EEVEE"
    try:
        sc.eevee.use_bloom = True
    except Exception:
        pass
    if active_cam_key in cams:
        sc.camera = cams[active_cam_key]


def finish_build(active_cam_key):
    collect_cameras()
    setup_world(active_cam_key)
    label = NAMES.get(SOLO, "all layouts") if SOLO else "all 4 layouts"
    print(f">>> Done: {label}. Viewport → Rendered. Camera: Camera_{active_cam_key}")
    if SAVE_WHEN_DONE:
        try:
            bpy.ops.wm.save_as_mainfile(filepath=BLEND_OUT)
            print(f">>> Saved {BLEND_OUT}")
        except Exception as e:
            print(f">>> Could not save: {e}")


def collect_cameras():
    global cams
    cams = {}
    keys = [SOLO] if SOLO else list(BUILDERS.keys())
    for k in keys:
        col = bpy.data.collections.get(f"CTRL_{k}_{NAMES[k]}")
        if not col:
            continue
        for ob in col.objects:
            if ob.type == "CAMERA":
                ob.name = f"Camera_{k}"
                cams[k] = ob
                break


def queue_build():
    keys = [SOLO] if SOLO else list(BUILDERS.keys())
    for k in keys:
        collection = coll(f"CTRL_{k}_{NAMES[k]}")
        origin = CENTER if SOLO else ORIGINS[k]

        def _layout(kk=k, col=collection, org=origin):
            BUILDERS[kk](org, col)

        enqueue(f"plan {NAMES[k]}", _layout)


def build_tick():
    if not build_queue:
        active = SOLO or "A"
        finish_build(active)
        return None
    label, fn = build_queue.pop(0)
    print(f"  + {label}")
    fn()
    redraw()
    return STEP_DELAY


def start():
    reset()
    setup_materials()
    queue_build()
    if LIVE_BUILD:
        print(">>> Live build — watch the 3D viewport (switch to Rendered for lights)")
        print(f">>> ~{len(build_queue)} steps, {STEP_DELAY}s each")
        bpy.app.timers.register(build_tick, first_interval=0.05)
    else:
        while build_queue:
            label, fn = build_queue.pop(0)
            fn()
        finish_build(SOLO or "A")


start()
