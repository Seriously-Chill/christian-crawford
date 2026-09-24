"""High-fidelity, product-CGI studies for every portfolio visual slot.

Run from the repository root:
  /Applications/Blender.app/Contents/MacOS/Blender -b --python artwork/blender/portfolio_product_cgi.py
  node artwork/blender/optimize_renders.mjs

The renders use a common designed-product language: accurate screen surfaces,
machined support structures, controlled material contrast, and exploded detail
where it helps explain the system. They are static transparent WebP assets in
the site; no real-time 3D runtime is added.
"""

import bpy
import math
import os
from mathutils import Vector

SIZE = 1600


def locate_script():
    expected = "portfolio_product_cgi.py"
    candidates = []
    text = bpy.data.texts.get(expected)
    if text and text.filepath:
        candidates.append(bpy.path.abspath(text.filepath))
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "TEXT_EDITOR":
                active = area.spaces.active.text
                if active and active.filepath:
                    candidates.append(bpy.path.abspath(active.filepath))
    pseudo = globals().get("__file__")
    if pseudo:
        candidates.append(os.path.abspath(pseudo))
    for path in candidates:
        if os.path.isfile(path) and os.path.basename(path) == expected:
            return path
    fallback = os.path.expanduser("~/Documents/GitHub/christian-crawford/artwork/blender/" + expected)
    if os.path.isfile(fallback):
        return fallback
    raise RuntimeError("Save/open portfolio_product_cgi.py from the project's artwork/blender folder, then run it.")


SCRIPT = locate_script()
ROOT = os.path.abspath(os.path.join(os.path.dirname(SCRIPT), "..", ".."))
OUTPUT = os.path.join(ROOT, "artwork", "blender", "renders")


def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for blocks in (bpy.data.materials, bpy.data.curves, bpy.data.meshes, bpy.data.cameras, bpy.data.lights):
        for block in list(blocks):
            if block.users == 0:
                blocks.remove(block)


def material(name, color, metallic=0.0, roughness=0.3, transmission=0.0, coat=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    for socket, value in (("Base Color", (*color, 1)), ("Metallic", metallic),
                          ("Roughness", roughness), ("Coat Weight", coat),
                          ("Clearcoat", coat)):
        target = shader.inputs.get(socket)
        if target is not None:
            target.default_value = value
    trans = shader.inputs.get("Transmission Weight")
    if trans is None:
        trans = shader.inputs.get("Transmission")
    if trans is not None:
        trans.default_value = transmission
    return mat


def box(name, loc, dims, mat, bevel=0.06, segments=5):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("CNC edge radius", "BEVEL")
        mod.width = min(bevel, min(dims) * 0.45)
        mod.segments = segments
        mod.profile = 0.5
        obj.modifiers.new("Corner normals", "WEIGHTED_NORMAL")
    return obj


def cylinder(name, loc, radius, depth, mat, vertices=48, bevel=0.018):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Turned edge", "BEVEL")
        mod.width = min(bevel, depth * 0.24)
        mod.segments = 3
        obj.modifiers.new("Corner normals", "WEIGHTED_NORMAL")
    return obj


def sphere(name, loc, scale, mat, segments=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=20, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def tube(name, points, radius, mat, resolution=4):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 20
    curve.bevel_depth = radius
    curve.bevel_resolution = resolution
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, point in zip(spline.bezier_points, points):
        bp.co = point
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def rod(name, start, end, radius, mat):
    a, b = Vector(start), Vector(end)
    delta = b - a
    obj = cylinder(name, (a + b) / 2, radius, delta.length, mat, vertices=32, bevel=0.008)
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    return obj


def text(name, body, loc, size, mat):
    bpy.ops.object.text_add(location=loc, rotation=(math.radians(90), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = body
    obj.data.size = size
    obj.data.extrude = 0.0008
    obj.data.align_x = "LEFT"
    obj.data.materials.append(mat)
    return obj


def screen(name, center, width, height, shell, glass, accent, kind="dashboard", labels=True):
    """Physical browser/display assembly with deliberate, recognizable UI."""
    x, y, z = center
    depth = max(0.09, width * 0.035)
    box(name + " precision bezel", (x, y, z), (width, depth, height), shell, 0.065)
    face_y = y - depth / 2 - 0.012
    fw, fh = width - 0.11, height - 0.11
    box(name + " glass", (x, face_y, z), (fw, 0.018, fh), glass, 0.028)
    top = z + fh * 0.39
    box(name + " browser rail", (x, face_y - 0.018, top), (fw * 0.92, 0.014, min(0.09, height * 0.055)), shell, 0.018)
    for i in range(3):
        sphere(name + " status light " + str(i + 1), (x - fw * 0.38 + i * 0.055, face_y - 0.03, top),
               (0.016, 0.009, 0.016), accent, 20)
    if labels:
        text(name + " heading", {"dashboard": "OVERVIEW", "store": "PRODUCTS", "checkout": "CHECKOUT",
                                  "audit": "ACCESSIBILITY", "code": "CHANGE REVIEW", "flow": "YOUR JOURNEY"}.get(kind, "OVERVIEW"),
             (x - fw * 0.40, face_y - 0.032, top - 0.17), min(0.078, width * 0.045), shell)

    content_top = top - 0.22
    if kind in ("store", "dashboard"):
        count = 3
        for i in range(count):
            col_x = x + (i - 1) * fw * 0.29
            card_z = content_top - fh * 0.20
            box(name + " content tile " + str(i + 1), (col_x, face_y - 0.022, card_z),
                (fw * 0.23, 0.016, fh * 0.32), shell, 0.024)
            if kind == "store":
                cylinder(name + " product form " + str(i + 1), (col_x, face_y - 0.047, card_z + 0.005),
                         min(0.055, width * 0.04), min(0.19, height * 0.12), accent if i == 1 else glass,
                         vertices=32, bevel=0.012)
            else:
                box(name + " data bar " + str(i + 1), (col_x, face_y - 0.045, card_z - fh * 0.08),
                    (fw * 0.14, 0.012, fh * (0.11 + 0.04 * i)), accent, 0.012)
            box(name + " caption " + str(i + 1), (col_x, face_y - 0.048, card_z - fh * 0.23),
                (fw * 0.13, 0.01, 0.018), shell, 0.006)
    elif kind == "checkout":
        for i in range(3):
            rz = content_top - i * fh * 0.16
            box(name + " form field " + str(i + 1), (x, face_y - 0.02, rz), (fw * 0.68, 0.014, 0.075), shell, 0.016)
            box(name + " field value " + str(i + 1), (x - fw * 0.18, face_y - 0.039, rz), (fw * 0.2, 0.01, 0.014), accent, 0.006)
        box(name + " order action", (x + fw * 0.22, face_y - 0.03, z - fh * 0.32), (fw * 0.25, 0.02, 0.085), accent, 0.02)
        text(name + " action type", "PLACE ORDER", (x + fw * 0.12, face_y - 0.046, z - fh * 0.34), min(0.034, width * 0.026), glass)
    elif kind in ("audit", "code", "flow"):
        for i in range(4):
            rz = content_top - i * fh * 0.14
            row_width = fw * (0.72 if i % 2 == 0 else 0.62)
            box(name + " review row " + str(i + 1), (x - fw * 0.01, face_y - 0.021, rz),
                (row_width, 0.014, 0.062), shell, 0.014)
            box(name + " review mark " + str(i + 1), (x - row_width * 0.32, face_y - 0.04, rz),
                (row_width * 0.22, 0.01, 0.013), accent if i == 1 else glass, 0.006)
            if kind == "audit":
                sphere(name + " pass state " + str(i + 1), (x + row_width * 0.40, face_y - 0.042, rz),
                       (0.021, 0.01, 0.021), accent, 20)


def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_setup(filename, camera_loc=(7.5, -10.5, 8.2), target=(0, 0, 0.9), scale=6.8, samples=64):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 8
    scene.render.resolution_x = SIZE
    scene.render.resolution_y = SIZE
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "AgX"
    scene.world.color = (0.16, 0.18, 0.2)

    cam_data = bpy.data.cameras.new("Product studio camera")
    cam = bpy.data.objects.new("Product studio camera", cam_data)
    scene.collection.objects.link(cam)
    cam.location = camera_loc
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = scale
    aim(cam, target)
    scene.camera = cam

    def area(name, pos, energy, size, color):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.shape = "DISK"
        data.size = size
        data.color = color
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
        obj.location = pos
        aim(obj, target)

    # One broad key, a cool edge, and a warm reflection card: premium product CGI,
    # with readable silhouettes and soft reflections rather than colored glow.
    area("Large softbox key", (1.4, -5.5, 8.5), 1450, 6.2, (0.82, 0.9, 1.0))
    area("Cool edge strip", (-5.0, 1.0, 5.0), 1150, 4.0, (0.70, 0.84, 1.0))
    area("Warm bounce", (4.5, 3.8, 5.8), 900, 4.5, (1.0, 0.85, 0.68))
    area("Top reflection", (0.0, 2.0, 8.0), 950, 5.0, (1.0, 1.0, 1.0))
    scene.render.filepath = os.path.join(OUTPUT, filename + ".png")


def materials():
    return {
        "graphite": material("Anodized graphite", (0.16, 0.21, 0.25), 0.72, 0.24, coat=0.2),
        "porcelain": material("Warm porcelain", (0.83, 0.86, 0.84), 0.12, 0.24, coat=0.16),
        "glass": material("Soft ivory glass", (0.95, 0.95, 0.90), 0.04, 0.23, transmission=0.06, coat=0.2),
        "blue": material("Mineral blue enamel", (0.31, 0.58, 0.67), 0.32, 0.2, coat=0.2),
        "metal": material("Satin titanium", (0.52, 0.59, 0.62), 0.82, 0.22),
        "warm": material("Muted copper detail", (0.67, 0.43, 0.28), 0.76, 0.24),
        "ink": material("UI ink", (0.19, 0.27, 0.31), 0.08, 0.35),
    }


def hero_system():
    clear(); m = materials()
    # Finished product: a readable interface held by a visible, engineered
    # structure, with one UX path linking the component layers.
    box("Hero instrument base", (0, 0.18, 0.12), (4.5, 2.5, 0.25), m["graphite"], 0.18, 8)
    box("Shared platform core", (0, 0.12, 0.32), (3.9, 2.05, 0.16), m["metal"], 0.12, 7)
    box("Central structural spine", (0, 0.40, 0.55), (2.8, 0.22, 0.28), m["graphite"], 0.09)
    screen("Finished product interface", (0, 0.42, 1.85), 3.55, 2.28, m["graphite"], m["glass"], m["blue"], "dashboard")
    # A shaped user-flow rail wraps around the stable center; small connector
    # pins and two detached component tiles imply extensibility, not decoration.
    tube("User experience rail", [(-2.0, -0.65, 0.64), (-1.35, -1.0, 0.78), (0.0, -1.14, 0.88), (1.32, -0.95, 0.78), (2.0, -0.50, 0.62)], 0.035, m["blue"])
    for i, x in enumerate([-1.32, 1.32], 1):
        cylinder("Rail connector " + str(i), (x, -0.96, 0.78), 0.075, 0.08, m["warm"])
    for i, x in enumerate([-2.22, 2.22], 1):
        box("Reusable interface module " + str(i), (x, 0.02, 0.78), (0.42, 0.36, 0.12), m["porcelain"], 0.055)
        box("Module inset " + str(i), (x, -0.17, 0.79), (0.18, 0.016, 0.035), m["blue"], 0.012)
    render_setup("hero-system", scale=6.55, target=(0, 0.0, 1.2))
    bpy.ops.render.render(write_still=True)


def healthwarehouse_platform():
    clear(); m = materials()
    box("Shared pharmacy platform chassis", (0, 0.16, 0.12), (5.9, 2.55, 0.25), m["graphite"], 0.18, 8)
    box("Shared service backplane", (0, 0.16, 0.31), (5.62, 2.28, 0.13), m["metal"], 0.12, 7)
    xs = [-1.72, 0, 1.72]
    frames = [m["porcelain"], m["graphite"], m["porcelain"]]
    accents = [m["blue"], m["warm"], m["blue"]]
    for i, x in enumerate(xs):
        rod("Platform display riser " + str(i+1), (x, 0.4, 0.42), (x, 0.4, 0.78), 0.075, m["metal"])
        screen("Pharmacy brand storefront " + str(i+1), (x, 0.38, 1.82), 1.48, 1.76,
               frames[i], m["glass"], accents[i], "store", labels=False)
        rod("Shared service connector " + str(i+1), (x, -0.1, 0.42), (x, -0.72, 0.42), 0.04, m["blue"])
        cylinder("Platform socket " + str(i+1), (x, -0.74, 0.42), 0.11, 0.10, m["warm"])
    box("Continuous configurable core", (0, -0.90, 0.39), (4.68, 0.18, 0.13), m["graphite"], 0.06)
    # Pharmacy context is legible from actual package forms, without borrowed branding.
    box("Medicine carton", (2.35, -0.89, 0.72), (0.38, 0.32, 0.55), m["glass"], 0.035)
    box("Carton blue label", (2.35, -1.065, 0.72), (0.25, 0.014, 0.19), m["blue"], 0.012)
    cylinder("Medicine bottle", (2.83, -0.86, 0.68), 0.13, 0.4, m["porcelain"])
    cylinder("Bottle cap", (2.83, -0.86, 0.91), 0.098, 0.08, m["blue"])
    render_setup("healthwarehouse-platform", scale=7.65, target=(0, 0.0, 1.0))
    bpy.ops.render.render(write_still=True)


def featured_work():
    clear(); m = materials()
    box("Case study platform", (0, 0.05, 0.12), (4.8, 2.65, 0.25), m["graphite"], 0.17, 8)
    box("Shared system plate", (0, 0.05, 0.30), (4.48, 2.34, 0.12), m["metal"], 0.12, 7)
    screen("Pharmacy catalog", (-0.56, 0.34, 1.76), 2.75, 1.94, m["porcelain"], m["glass"], m["blue"], "store")
    rod("Desktop support", (-0.56, 0.35, 0.53), (-0.56, 0.35, 0.78), 0.085, m["metal"])
    screen("Mobile checkout", (1.54, -0.04, 1.52), 0.90, 1.55, m["porcelain"], m["glass"], m["blue"], "checkout")
    rod("Phone support", (1.54, -0.05, 0.45), (1.54, -0.05, 0.77), 0.06, m["metal"])
    box("Order parcel", (2.2, -0.65, 0.48), (0.52, 0.43, 0.54), m["glass"], 0.05)
    box("Parcel seal", (2.2, -0.88, 0.49), (0.21, 0.018, 0.12), m["warm"], 0.018)
    render_setup("featured-work", scale=6.9, target=(0, -0.1, 1.0))
    bpy.ops.render.render(write_still=True)


def capability_architecture():
    clear(); m = materials()
    box("Architecture cutaway chassis", (0, 0, 0.13), (4.4, 2.8, 0.26), m["graphite"], 0.17, 8)
    box("Shared load-bearing plate", (0, 0, 0.32), (4.1, 2.5, 0.13), m["metal"], 0.12, 7)
    box("Service rail", (0, -0.28, 0.54), (3.72, 0.22, 0.25), m["blue"], 0.08)
    for i, x in enumerate([-1.24, 0, 1.24]):
        box("Configurable product module " + str(i+1), (x, 0.47, 0.77), (0.88, 0.96, 0.54), m["porcelain"], 0.09, 7)
        box("Module face detail " + str(i+1), (x, -0.02, 0.79), (0.53, 0.018, 0.085), m["glass"], 0.02)
        rod("Vertical support " + str(i+1), (x, 0.17, 0.48), (x, 0.17, 0.65), 0.034, m["warm"])
        for side in (-1, 1):
            cylinder("Fastener " + str(i+1) + "." + str(side), (x + side*0.33, 0.0, 0.83), 0.035, 0.04, m["metal"], vertices=24, bevel=0.006)
    render_setup("capability-architecture", scale=5.55, target=(0, 0, 0.58))
    bpy.ops.render.render(write_still=True)


def capability_product():
    clear(); m = materials()
    box("Journey base", (0, 0.08, 0.12), (4.5, 2.55, 0.24), m["graphite"], 0.16, 8)
    xs = [-1.35, 0, 1.35]
    kinds = ["store", "dashboard", "checkout"]
    for i, (x, kind) in enumerate(zip(xs, kinds)):
        screen("Journey stage " + str(i+1), (x, 0.25, 1.12), 1.18, 1.42, m["porcelain"], m["glass"], m["blue"], kind, labels=False)
        rod("Stage pedestal " + str(i+1), (x, 0.22, 0.38), (x, 0.22, 0.62), 0.055, m["metal"])
    for i in range(2):
        tube("Experience path " + str(i+1), [(xs[i]+0.48, -0.10, 0.56), (xs[i]+0.68, -0.38, 0.59),
                                             (xs[i+1]-0.66, -0.38, 0.59), (xs[i+1]-0.48, -0.10, 0.56)], 0.025, m["warm"], 3)
    render_setup("capability-product", scale=5.45, target=(0, 0.0, 0.72))
    bpy.ops.render.render(write_still=True)


def capability_frontend():
    clear(); m = materials()
    box("Responsive component plinth", (0, 0.12, 0.12), (4.5, 2.5, 0.24), m["graphite"], 0.16, 8)
    screen("Desktop interface", (-0.48, 0.38, 1.34), 2.62, 1.78, m["porcelain"], m["glass"], m["blue"], "dashboard")
    screen("Mobile interface", (1.47, -0.05, 1.10), 0.76, 1.40, m["porcelain"], m["glass"], m["warm"], "dashboard", labels=False)
    # Component samples form an exploded side rail, visibly part of the same UI kit.
    for i in range(3):
        x, y, z = 2.22 + (i % 2)*0.30, 0.20 - (i//2)*0.48, 0.42 + i*0.16
        box("Reusable component sample " + str(i+1), (x, y, z), (0.38, 0.32, 0.12), m["porcelain"], 0.045)
        box("Component sample inset " + str(i+1), (x, y-0.17, z+0.005), (0.22, 0.016, 0.026), m["blue"], 0.008)
    render_setup("capability-frontend", scale=5.65, target=(0, 0.0, 0.8))
    bpy.ops.render.render(write_still=True)


def capability_quality():
    clear(); m = materials()
    box("Quality inspection plinth", (0, 0.14, 0.12), (4.25, 2.55, 0.24), m["graphite"], 0.16, 8)
    screen("Accessibility review", (0, 0.3, 1.25), 2.85, 1.78, m["porcelain"], m["glass"], m["blue"], "audit")
    # Physical inspection frame and magnifier focus the viewer on a real UI state.
    for x in (-0.87, -0.20):
        box("Focus frame upright", (x, 0.05, 1.08), (0.028, 0.035, 0.27), m["warm"], 0.012)
    for z in (0.945, 1.215):
        box("Focus frame crossbar", (-0.535, 0.05, z), (0.70, 0.035, 0.028), m["warm"], 0.012)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.035, major_segments=48,
                                     minor_segments=12, location=(1.26, -0.05, 0.90))
    lens = bpy.context.object; lens.name = "Optical inspection lens"; lens.data.materials.append(m["metal"])
    lens.rotation_euler = (math.radians(90), 0, math.radians(12))
    rod("Lens handle", (1.42, -0.04, 0.75), (1.68, -0.15, 0.48), 0.045, m["warm"])
    render_setup("capability-quality", scale=5.55, target=(0, 0.1, 0.68))
    bpy.ops.render.render(write_still=True)


def contact_resolution():
    clear(); m = materials()
    box("Correspondence base", (0, 0, 0.10), (3.6, 2.55, 0.20), m["metal"], 0.14, 8)
    box("Open note", (-0.30, 0.30, 0.26), (2.2, 1.55, 0.075), m["glass"], 0.05, 6)
    for i, width in enumerate([1.28, 1.52, 0.92]):
        box("Message line " + str(i+1), (-0.42, 0.50-i*0.22, 0.31), (width, 0.026, 0.018), m["ink"], 0.008)
    box("Email envelope", (0.76, -0.50, 0.39), (1.38, 0.86, 0.12), m["blue"], 0.055, 6)
    # Raised folded-paper chevron gives the envelope a crafted edge.
    tube("Envelope fold", [(0.08, -0.48, 0.47), (0.76, -0.88, 0.49), (1.44, -0.48, 0.47)], 0.018, m["glass"], 3)
    cylinder("Message seal", (0.76, -0.51, 0.48), 0.12, 0.04, m["warm"])
    render_setup("contact-resolution", scale=5.5, target=(0, 0, 0.4))
    bpy.ops.render.render(write_still=True)


def quality_evidence():
    clear(); m = materials()
    screen("Quality evidence monitor", (0, 0.36, 1.56), 3.5, 2.1, m["graphite"], m["glass"], m["blue"], "audit")
    rod("Evidence monitor stand", (0, 0.36, 0.49), (0, 0.36, 0.71), 0.10, m["metal"])
    box("Evidence monitor foot", (0, 0.18, 0.17), (1.38, 0.55, 0.13), m["graphite"], 0.06)
    metrics = [(-1.04, "~50", "A11Y ROUTES"), (0.0, "~80", "SEO ROUTES"), (1.04, "200+", "ISSUES ADDRESSED")]
    for i, (x, value, label) in enumerate(metrics):
        box("Evidence metric card " + str(i+1), (x, -0.54, 0.52), (0.92, 0.12, 0.53), m["porcelain"], 0.05)
        text("Evidence figure " + str(i+1), value, (x-0.29, -0.62, 0.61), 0.18, m["blue"])
        text("Evidence descriptor " + str(i+1), label, (x-0.36, -0.62, 0.43), 0.044, m["ink"])
    render_setup("quality-evidence", scale=5.95, target=(0, 0, 1.0))
    bpy.ops.render.render(write_still=True)


def ai_governance():
    clear(); m = materials()
    box("Governed workspace base", (0, 0, 0.11), (5.9, 3.5, 0.22), m["graphite"], 0.18, 8)
    box("Protected repository work surface", (0, 0, 0.27), (5.58, 3.18, 0.12), m["porcelain"], 0.12, 7)
    gate_x = -0.72
    for i, y in enumerate([0.9, -0.86]):
        # Two distinct input channels, each physically passing a review gate.
        box("Incoming change card " + str(i+1), (-2.18, y, 0.54), (0.42, 0.32, 0.10), m["blue"] if i == 0 else m["glass"], 0.035)
        for line in range(2):
            box("Change card detail " + str(i+1) + "." + str(line+1),
                (-2.18, y-0.06+line*0.10, 0.60), (0.24+0.05*line, 0.018, 0.012), m["graphite"], 0.005)
        tube("Incoming channel " + str(i+1), [(-2.0, y, 0.46), (-1.55, y, 0.48), (gate_x-0.18, y, 0.48)], 0.035, m["metal"])
        # Machined portal gate, with two posts and a top bridge.
        for side in (-1, 1):
            box("Review gate post " + str(i+1) + "." + str(side), (gate_x, y+side*0.28, 0.69), (0.13, 0.13, 0.68), m["metal"], 0.04)
        box("Review gate lintel " + str(i+1), (gate_x, y, 1.04), (0.14, 0.68, 0.13), m["blue"] if i == 0 else m["warm"], 0.04)
        cylinder("Review gate bearing " + str(i+1), (gate_x, y, 0.48), 0.15, 0.07, m["graphite"])
        tube("Approved channel " + str(i+1), [(gate_x+0.12, y, 0.48), (-0.2, y*0.75, 0.52), (0.55, 0.08, 0.56)], 0.032, m["blue"] if i == 0 else m["warm"])
    screen("Repository change review", (1.25, 0.10, 1.34), 1.82, 1.72, m["graphite"], m["glass"], m["blue"], "code")
    rod("Repository monitor stand", (1.25, 0.1, 0.44), (1.25, 0.1, 0.60), 0.07, m["metal"])
    # A small decision ledger remains visible beside the reviewed destination.
    for i in range(3):
        box("Governance record page " + str(i+1), (2.13-i*0.08, -1.07+i*0.08, 0.39+i*0.045),
            (0.76, 0.56, 0.08), m["glass"] if i == 2 else m["metal"], 0.04)
    for i, width in enumerate([0.44, 0.35, 0.41]):
        box("Governance record line " + str(i+1), (2.13, -1.17+i*0.13, 0.58), (width, 0.022, 0.014), m["blue"], 0.006)
    render_setup("ai-governance", scale=7.55, target=(0, 0, 0.7))
    bpy.ops.render.render(write_still=True)


def main():
    os.makedirs(OUTPUT, exist_ok=True)
    scenes = [hero_system, healthwarehouse_platform, featured_work,
              capability_architecture, capability_product, capability_frontend,
              capability_quality, contact_resolution, quality_evidence, ai_governance]
    for render in scenes:
        render()
        print("Rendered", bpy.context.scene.render.filepath)
    print("All portfolio product-CGI renders written to", OUTPUT)


if __name__ == "__main__":
    main()
