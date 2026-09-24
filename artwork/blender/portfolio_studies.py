"""Render lightweight, transparent 3D artwork studies for the portfolio.

Usage:
  /Applications/Blender.app/Contents/MacOS/Blender -b --python artwork/blender/portfolio_studies.py
  node artwork/blender/optimize_renders.mjs

Scenes prioritize what portfolio visitors need to recognize: a product being
built, distinct storefronts on one shared platform, reviewable AI changes, and
specific interface and quality evidence. The final site assets are static WebP
images; no Blender, WebGL, or 3D runtime is required in the browser. Materials
stay close to neutral so the site's configurable background hue remains in control.
"""

import bpy
import math
import os
from mathutils import Vector


SIZE = 1200


def resolve_script_path():
    """Find the on-disk script when run from Blender's Text Editor."""
    expected_name = "portfolio_studies.py"
    candidates = []

    script_text = bpy.data.texts.get(expected_name)
    if script_text and script_text.filepath:
        candidates.append(bpy.path.abspath(script_text.filepath))

    # Blender may rename a loaded text datablock, so also inspect open text
    # editor areas for the file that was actually run.
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "TEXT_EDITOR":
                text = area.spaces.active.text
                if text and text.filepath:
                    candidates.append(bpy.path.abspath(text.filepath))

    # Keep the command-line invocation usable too, where __file__ is real.
    candidate = globals().get("__file__")
    if candidate:
        candidates.append(os.path.abspath(candidate))

    for candidate in candidates:
        if os.path.isfile(candidate) and os.path.basename(candidate) == expected_name:
            return candidate

    raise RuntimeError(
        "Could not locate portfolio_studies.py on disk. In Blender's Text Editor, "
        "open the file from Documents/GitHub/christian-crawford/artwork/blender/ "
        "and run it again."
    )


SCRIPT_PATH = resolve_script_path()
ROOT = os.path.abspath(os.path.join(os.path.dirname(SCRIPT_PATH), "..", ".."))
OUT_DIR = os.path.join(ROOT, "artwork", "blender", "renders")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.materials, bpy.data.curves, bpy.data.meshes, bpy.data.cameras, bpy.data.lights):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)


def material(name, color, metallic=0.0, roughness=0.3):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def rounded_box(name, location, dimensions, mat, bevel=0.12, segments=5):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    mod = obj.modifiers.new("Soft machined edges", "BEVEL")
    mod.width = bevel
    mod.segments = segments
    mod.profile = 0.5
    obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    return obj


def cylinder(name, location, radius, depth, mat, vertices=64, bevel=0.06):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Soft machined edges", "BEVEL")
        mod.width = bevel
        mod.segments = 4
        obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    return obj


def sphere(name, location, scale, mat, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def bezier_tube(name, points, radius, mat):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 24
    curve.bevel_depth = radius
    curve.bevel_resolution = 5
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, co in zip(spline.bezier_points, points):
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def rod(name, start, end, radius, mat, vertices=24):
    a, b = Vector(start), Vector(end)
    delta = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=delta.length, location=(a + b) / 2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    obj.data.materials.append(mat)
    return obj


def screen_label(name, body, location, size, mat):
    """Place a short, readable label on a vertical screen facing the camera."""
    bpy.ops.object.text_add(location=location, rotation=(math.radians(90), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = body
    obj.data.size = size
    obj.data.align_x = "LEFT"
    obj.data.extrude = 0.0005
    obj.data.materials.append(mat)
    return obj


def browser_panel(name, center, width, height, frame, screen, accent, layout="store"):
    """A small physical browser view with recognizable UI, not a blank slab."""
    x, y, z = center
    rounded_box(f"{name} bezel", (x, y, z), (width, 0.13, height), frame, 0.075, 7)
    face_y = y - 0.073
    face_w, face_h = width - 0.13, height - 0.13
    rounded_box(f"{name} screen", (x, face_y, z), (face_w, 0.022, face_h), screen, 0.035, 4)
    # Browser chrome and controls make the object read immediately as a site.
    top = z + face_h * 0.5 - 0.10
    rounded_box(f"{name} browser bar", (x, face_y - 0.018, top), (face_w * 0.92, 0.018, 0.10), frame, 0.018, 4)
    for dot in range(3):
        sphere(f"{name} browser control {dot + 1}",
               (x - face_w * 0.36 + dot * 0.075, face_y - 0.032, top),
               (0.022, 0.012, 0.022), accent, 20, 10)

    content_top = top - 0.15
    if layout == "dashboard":
        screen_label(f"{name} heading", "PRODUCT OVERVIEW", (x - face_w * 0.40, face_y - 0.035, content_top),
                     min(0.080, width * 0.052), frame)
        # Summary card, activity panel, and product modules resemble a real
        # application dashboard at a glance.
        rounded_box(f"{name} summary card", (x - face_w * 0.20, face_y - 0.028, content_top - face_h * 0.23),
                    (face_w * 0.35, 0.02, face_h * 0.22), accent, 0.025, 4)
        rounded_box(f"{name} activity panel", (x + face_w * 0.18, face_y - 0.028, content_top - face_h * 0.23),
                    (face_w * 0.29, 0.02, face_h * 0.22), frame, 0.025, 4)
        for index, bar_w in enumerate([0.52, 0.66, 0.43, 0.58]):
            bar_x = x - face_w * 0.30 + index * face_w * 0.18
            rounded_box(f"{name} dashboard bar {index + 1}",
                        (bar_x, face_y - 0.045, z - face_h * 0.27 + (index % 2) * 0.06),
                        (face_w * 0.12, 0.018, 0.09 + (index % 2) * 0.05), accent if index == 2 else frame, 0.015, 3)
    elif layout == "store":
        screen_label(f"{name} heading", "PRODUCTS", (x - face_w * 0.40, face_y - 0.035, content_top),
                     min(0.085, width * 0.055), frame)
        # Three product tiles with bottle silhouettes and compact purchase rows.
        for index in range(3):
            tile_x = x + face_w * (index - 1) * 0.29
            tile_z = content_top - face_h * 0.25
            rounded_box(f"{name} product card {index + 1}",
                        (tile_x, face_y - 0.025, tile_z), (face_w * 0.24, 0.022, face_h * 0.34),
                        frame, 0.025, 4)
            bottle = cylinder(f"{name} product bottle {index + 1}",
                              (tile_x, face_y - 0.075, tile_z), 0.062, 0.24,
                              accent if index != 1 else screen, vertices=32, bevel=0.018)
            rounded_box(f"{name} bottle label {index + 1}",
                        (tile_x, face_y - 0.105, tile_z), (0.10, 0.014, 0.08), screen, 0.01, 3)
            rounded_box(f"{name} price line {index + 1}",
                        (tile_x, face_y - 0.035, tile_z - face_h * 0.25),
                        (face_w * 0.14, 0.018, 0.025), accent, 0.01, 3)
        rounded_box(f"{name} purchase action", (x, face_y - 0.035, z - face_h * 0.36),
                    (face_w * 0.28, 0.025, 0.075), accent, 0.018, 4)
        screen_label(f"{name} action label", "ADD TO CART",
                     (x - face_w * 0.105, face_y - 0.052, z - face_h * 0.37),
                     min(0.045, width * 0.03), screen)
    elif layout == "checkout":
        screen_label(f"{name} heading", "CHECKOUT", (x - face_w * 0.40, face_y - 0.035, content_top),
                     min(0.085, width * 0.055), frame)
        for index in range(3):
            row_z = content_top - 0.20 - index * face_h * 0.16
            rounded_box(f"{name} checkout field {index + 1}",
                        (x, face_y - 0.028, row_z), (face_w * 0.74, 0.02, 0.09), frame, 0.018, 3)
            rounded_box(f"{name} field detail {index + 1}",
                        (x - face_w * 0.20, face_y - 0.044, row_z), (face_w * 0.22, 0.015, 0.018), accent, 0.008, 3)
        rounded_box(f"{name} checkout button", (x + face_w * 0.21, face_y - 0.034, z - face_h * 0.34),
                    (face_w * 0.30, 0.025, 0.09), accent, 0.018, 4)
        screen_label(f"{name} checkout label", "PLACE ORDER",
                     (x + face_w * 0.09, face_y - 0.052, z - face_h * 0.35),
                     min(0.042, width * 0.028), screen)
    elif layout == "editor":
        # A recognizable code-review view: file tabs, diff columns, and a
        # small review note, without fabricating a complete application UI.
        dark = frame
        screen_label(f"{name} heading", "GOVERNANCE / HOOKS", (x - face_w * 0.40, face_y - 0.035, content_top),
                     min(0.070, width * 0.045), accent)
        for index, label in enumerate(["AGENTS.md", "preToolUse.sh"]):
            tab_x = x - face_w * 0.22 + index * face_w * 0.28
            rounded_box(f"{name} file tab {index + 1}", (tab_x, face_y - 0.035, content_top - 0.16),
                        (face_w * 0.27, 0.02, 0.09), dark, 0.014, 3)
            screen_label(f"{name} file label {index + 1}", label,
                         (tab_x - face_w * 0.115, face_y - 0.051, content_top - 0.18),
                         min(0.042, width * 0.027), screen)
        for index in range(5):
            line_x = x - face_w * 0.25 + (index % 2) * face_w * 0.13
            line_z = content_top - 0.34 - index * 0.105
            rounded_box(f"{name} diff line {index + 1}", (line_x, face_y - 0.036, line_z),
                        (face_w * (0.27 + (index % 3) * 0.04), 0.016, 0.025),
                        accent if index in (1, 3) else screen, 0.007, 3)
        rounded_box(f"{name} review note", (x + face_w * 0.22, face_y - 0.036, z - face_h * 0.31),
                    (face_w * 0.25, 0.02, 0.20), accent, 0.018, 3)
    elif layout == "audit":
        screen_label(f"{name} heading", "ACCESSIBILITY AUDIT", (x - face_w * 0.40, face_y - 0.035, content_top),
                     min(0.075, width * 0.05), frame)
        for index, label in enumerate(["FOCUS", "LABELS", "CONTRAST"]):
            row_z = content_top - 0.22 - index * 0.18
            rounded_box(f"{name} audit row {index + 1}", (x, face_y - 0.028, row_z),
                        (face_w * 0.78, 0.02, 0.10), screen if index != 1 else frame, 0.018, 3)
            screen_label(f"{name} audit label {index + 1}", label,
                         (x - face_w * 0.34, face_y - 0.047, row_z - 0.018),
                         min(0.045, width * 0.03), accent)
            sphere(f"{name} audit status {index + 1}", (x + face_w * 0.31, face_y - 0.05, row_z),
                   (0.035, 0.012, 0.035), accent, 20, 10)


def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def area_light(name, location, power, size, color):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    aim(obj, (0, 0, 0.5))
    return obj


def setup_scene(camera_location, target, ortho_scale, output_name):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = SIZE
    scene.render.resolution_y = SIZE
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "AgX"
    scene.render.image_settings.color_depth = "8"
    scene.world.color = (0.16, 0.18, 0.22)

    camera_data = bpy.data.cameras.new("Camera")
    camera = bpy.data.objects.new("Camera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = camera_location
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = ortho_scale
    aim(camera, target)
    scene.camera = camera

    area_light("Large softbox", (1, -5, 8), 950, 6, (0.84, 0.91, 1.0))
    area_light("Edge light", (-5, 1, 5), 750, 5, (0.75, 0.88, 1.0))
    area_light("Warm fill", (4, 5, 4), 600, 4, (1.0, 0.92, 0.82))
    scene.render.filepath = os.path.join(OUT_DIR, output_name + ".png")


def hero_study():
    """A recognizable software product, with its reusable parts nearby."""
    clear_scene()
    porcelain = material("Monitor porcelain", (0.87, 0.91, 0.94), 0.12, 0.24)
    screen = material("Dashboard surface", (0.97, 0.96, 0.92), 0.01, 0.31)
    slate = material("Monitor frame", (0.28, 0.37, 0.45), 0.42, 0.26)
    accent = material("Dashboard accent", (0.40, 0.68, 0.81), 0.2, 0.22)
    steel = material("Keyboard alloy", (0.66, 0.74, 0.80), 0.5, 0.23)

    # A compact workstation is there to identify the subject; the screen is
    # the hero and contains a recognizable product dashboard, not decoration.
    rounded_box("Monitor stand", (0, 0.31, 0.47), (0.22, 0.18, 0.64), steel, 0.07, 6)
    rounded_box("Monitor foot", (0, 0.12, 0.16), (1.12, 0.56, 0.12), slate, 0.06, 6)
    browser_panel("Product dashboard", (0, 0.34, 1.54), 3.48, 2.08,
                  slate, screen, accent, layout="dashboard")
    rounded_box("Keyboard deck", (0, -0.62, 0.18), (3.22, 1.10, 0.14), porcelain, 0.09, 7)
    for row in range(3):
        for col in range(13):
            x = (col - 6) * 0.205
            y = -0.94 + row * 0.22
            rounded_box(f"Keyboard key {row + 1}-{col + 1}", (x, y, 0.27), (0.14, 0.12, 0.035), steel, 0.018, 3)
    # Three reusable component tiles are visibly being assembled at the side.
    for index, x in enumerate([2.12, 2.45, 2.78], 1):
        rounded_box(f"Component sample {index}", (x, 0.03, 0.50 + index * 0.12),
                    (0.36, 0.30, 0.08), porcelain if index != 2 else accent, 0.035, 5)

    setup_scene((7.6, -9.5, 8.3), (0, -0.05, 0.94), 6.4, "hero-system")
    bpy.ops.render.render(write_still=True)


def platform_study():
    """Three distinct pharmacy product interfaces on one shared platform."""
    clear_scene()
    base = material("Platform porcelain", (0.78, 0.83, 0.88), 0.15, 0.24)
    brand_a = material("Module pearl", (0.94, 0.96, 0.98), 0.12, 0.2)
    brand_b = material("Module silver", (0.62, 0.71, 0.79), 0.3, 0.23)
    brand_c = material("Module mist", (0.72, 0.84, 0.90), 0.2, 0.23)
    core = material("Shared core graphite", (0.31, 0.39, 0.47), 0.48, 0.26)
    rail = material("Connection satin metal", (0.55, 0.64, 0.71), 0.62, 0.22)

    # Three storefront views show what a visitor recognizes; a shared
    # structural base and common connections show what the engineer built.
    rounded_box("Shared platform chassis", (0, 0.18, 0.12), (5.65, 2.60, 0.24), core, 0.18, 8)
    rounded_box("Shared platform cap", (0, 0.18, 0.28), (5.38, 2.34, 0.12), base, 0.12, 7)
    xs = [-1.72, 0, 1.72]
    frames = [brand_a, brand_b, brand_c]
    screens = [material("Storefront screen 1", (0.97, 0.96, 0.92), 0.01, 0.3),
               material("Storefront screen 2", (0.93, 0.96, 0.97), 0.01, 0.3),
               material("Storefront screen 3", (0.96, 0.95, 0.92), 0.01, 0.3)]
    accents = [rail, core, material("Storefront accent", (0.51, 0.72, 0.81), 0.18, 0.24)]
    for idx, (x, frame, screen, accent) in enumerate(zip(xs, frames, screens, accents), 1):
        # Matching browser proportions and distinct visual accents imply
        # product variation while retaining one interface system.
        rounded_box(f"Storefront display stand {idx}", (x, 0.42, 0.61), (0.18, 0.16, 0.48), rail, 0.045, 5)
        browser_panel(f"Pharmacy storefront {idx}", (x, 0.38, 1.55), 1.50, 1.72,
                      frame, screen, accent, layout="store")
        rod(f"Shared service connection {idx}", (x, 0.26, 0.38), (x, -0.62, 0.38), 0.042, rail)
        cylinder(f"Platform socket {idx}", (x, -0.65, 0.38), 0.10, 0.09, brand_a, bevel=0.025)
    rounded_box("Shared service line", (0, -0.79, 0.37), (4.45, 0.18, 0.10), core, 0.05, 5)
    # A neutral medication carton and bottle ground the UI in the pharmacy
    # context, without borrowing a real brand mark or product label.
    rounded_box("Unbranded medicine carton", (2.36, -0.82, 0.66), (0.42, 0.34, 0.55), brand_a, 0.045, 5)
    rounded_box("Carton label panel", (2.36, -1.00, 0.70), (0.27, 0.018, 0.24), brand_c, 0.025, 4)
    cylinder("Unbranded medicine bottle", (2.82, -0.82, 0.69), 0.14, 0.46, brand_b, vertices=40, bevel=0.025)
    cylinder("Bottle cap", (2.82, -0.82, 0.94), 0.105, 0.08, rail, vertices=32, bevel=0.018)

    setup_scene((7.8, -10.5, 8.2), (0, -0.05, 0.95), 7.5, "healthwarehouse-platform")
    bpy.ops.render.render(write_still=True)


def featured_work_study():
    """Homepage case-study teaser: pharmacy product discovery to checkout."""
    clear_scene()
    porcelain = material("Work frame", (0.88, 0.92, 0.95), 0.1, 0.24)
    paper = material("Store screen", (0.97, 0.96, 0.93), 0.01, 0.3)
    slate = material("Shared platform", (0.30, 0.39, 0.47), 0.42, 0.27)
    blue = material("Purchase accent", (0.43, 0.70, 0.82), 0.2, 0.22)
    steel = material("Device trim", (0.68, 0.76, 0.82), 0.5, 0.23)

    rounded_box("Shared service foundation", (0, 0.10, 0.12), (4.2, 2.65, 0.24), slate, 0.16, 8)
    rounded_box("Product page stand", (-0.56, 0.40, 0.59), (0.18, 0.16, 0.62), steel, 0.045, 5)
    browser_panel("Pharmacy product page", (-0.56, 0.35, 1.68), 2.78, 1.94,
                  porcelain, paper, blue, layout="store")
    rounded_box("Mobile checkout stand", (1.47, 0.06, 0.72), (0.15, 0.15, 0.88), steel, 0.04, 5)
    browser_panel("Mobile checkout", (1.47, 0.02, 1.57), 0.92, 1.54,
                  porcelain, paper, blue, layout="checkout")
    # A small unbranded parcel anchors the interface to a real pharmacy order.
    rounded_box("Order carton", (2.10, -0.72, 0.48), (0.52, 0.42, 0.58), paper, 0.045, 5)
    rounded_box("Order label", (2.10, -0.95, 0.52), (0.30, 0.018, 0.24), steel, 0.018, 4)

    setup_scene((7.6, -9.5, 8.3), (0, -0.1, 1.0), 6.7, "featured-work")
    bpy.ops.render.render(write_still=True)


def capability_study(kind):
    """A matched visual family for the four capability cards."""
    clear_scene()
    pearl = material("Capability pearl", (0.88, 0.93, 0.97), 0.14, 0.22)
    mist = material("Capability mist", (0.58, 0.75, 0.85), 0.28, 0.2)
    slate = material("Capability slate", (0.36, 0.47, 0.56), 0.5, 0.25)
    steel = material("Capability steel", (0.69, 0.78, 0.85), 0.58, 0.22)

    if kind == "architecture":
        # A cutaway architectural section with a shared service spine and
        # separate upper modules. The silhouette reads as built structure.
        rounded_box("Architecture section base", (0, 0, 0.10), (3.8, 2.45, 0.20), slate, 0.15, 8)
        rounded_box("Shared structural floor", (0, 0, 0.26), (3.52, 2.18, 0.12), pearl, 0.10, 7)
        rounded_box("Central service spine", (0, -0.16, 0.50), (3.08, 0.30, 0.34), mist, 0.08, 6)
        for i, x in enumerate([-1.12, 0, 1.12], 1):
            width = [0.78, 0.92, 0.74][i - 1]
            rounded_box(f"Configurable volume {i}", (x, 0.48, 0.67), (width, 0.96, 0.58), pearl if i != 2 else steel, 0.09, 6)
            rounded_box(f"Volume inset {i}", (x, 0.48, 0.98), (width * 0.66, 0.055, 0.035), mist, 0.025, 4)
            rod(f"Load path {i}", (x, 0.16, 0.48), (x, -0.12, 0.48), 0.028, steel)
        output = "capability-architecture"
    elif kind == "product":
        # The product is a real purchase journey: browse, select, complete.
        rounded_box("Product journey plinth", (0, 0.28, 0.10), (4.0, 2.45, 0.20), slate, 0.15, 8)
        xs = [-1.18, 0, 1.18]
        layouts = ["store", "store", "checkout"]
        for i, (x, layout) in enumerate(zip(xs, layouts), 1):
            browser_panel(f"Purchase journey screen {i}", (x, 0.22, 1.12), 1.04, 1.32,
                          pearl, mist if i == 2 else steel, slate if i == 1 else mist, layout=layout)
        for i in range(2):
            rod(f"Journey step connector {i + 1}", (xs[i] + 0.55, -0.12, 0.62),
                (xs[i + 1] - 0.55, -0.12, 0.62), 0.025, steel)
        output = "capability-product"
    elif kind == "frontend":
        # The same page is shown at desktop and phone widths, making
        # responsive frontend work immediately recognizable.
        rounded_box("Frontend display plinth", (0, 0.24, 0.10), (3.9, 2.45, 0.20), slate, 0.15, 8)
        browser_panel("Responsive desktop page", (-0.55, 0.30, 1.13), 2.25, 1.62,
                      pearl, steel, mist, layout="dashboard")
        browser_panel("Responsive mobile page", (1.28, -0.10, 1.03), 0.76, 1.48,
                      pearl, mist, slate, layout="dashboard")
        output = "capability-frontend"
    else:  # quality
        # The view is an accessibility audit in progress, with a visible
        # keyboard-focus frame and magnifier over a real interface panel.
        rounded_box("Quality inspection base", (0, 0.25, 0.10), (3.8, 2.35, 0.20), slate, 0.15, 8)
        browser_panel("Accessibility audit view", (0, 0.24, 1.13), 2.82, 1.76,
                      pearl, steel, mist, layout="audit")
        for x, z, dims in [(-0.78, 0.92, (0.035, 0.025, 0.28)), (-0.20, 0.92, (0.035, 0.025, 0.28)),
                           (-0.49, 0.77, (0.62, 0.025, 0.035)), (-0.49, 1.07, (0.62, 0.025, 0.035))]:
            rounded_box("Keyboard focus boundary", (x, -0.01, z), dims, mist, 0.012, 3)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.04, major_segments=48,
                                         minor_segments=12, location=(1.12, -0.02, 0.86))
        lens = bpy.context.object
        lens.name = "Inspection lens"
        lens.data.materials.append(steel)
        lens.rotation_euler = (math.radians(90), 0, math.radians(10))
        rod("Lens handle", (1.28, -0.02, 0.72), (1.53, -0.10, 0.46), 0.045, steel)
        output = "capability-quality"

    setup_scene((6.9, -8.6, 7.0), (0, 0, 0.57), 5.1, output)
    bpy.ops.render.render(write_still=True)


def contact_study():
    """A quiet, literal contact still life for the contact CTA."""
    clear_scene()
    paper = material("Contact paper", (0.96, 0.95, 0.91), 0.02, 0.34)
    envelope = material("Envelope blue", (0.52, 0.70, 0.80), 0.08, 0.28)
    ink = material("Contact ink", (0.28, 0.37, 0.45), 0.12, 0.32)
    trim = material("Envelope edge", (0.73, 0.81, 0.85), 0.26, 0.24)

    rounded_box("Correspondence table", (0, 0, 0.10), (3.5, 2.45, 0.20), trim, 0.16, 8)
    # A partially opened envelope and a note make the CTA's purpose
    # immediately recognizable while retaining the site's calm materials.
    rounded_box("Open note", (-0.28, 0.30, 0.27), (2.15, 1.55, 0.08), paper, 0.055, 6)
    for index, width in enumerate([1.18, 1.45, 0.96], 1):
        rounded_box(f"Note line {index}", (-0.40, 0.45 - index * 0.21, 0.315),
                    (width, 0.025, 0.018), ink, 0.01, 3)
    rounded_box("Email envelope", (0.67, -0.48, 0.42), (1.30, 0.86, 0.12), envelope, 0.05, 6)

    def flap(name, verts, mat, z):
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, y, z) for x, y in verts], [], [(0, 1, 2)])
        mesh.materials.append(mat)
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(obj)
        solid = obj.modifiers.new("Paper thickness", "SOLIDIFY")
        solid.thickness = 0.025
        bevel = obj.modifiers.new("Soft paper edge", "BEVEL")
        bevel.width = 0.018
        bevel.segments = 3
        return obj

    flap("Envelope front fold", [(-0.65, -0.90), (1.99, -0.90), (0.67, -0.14)], paper, 0.50)
    flap("Envelope rear flap", [(-0.65, -0.06), (0.67, 0.72), (1.99, -0.06)], trim, 0.51)
    bpy.ops.object.text_add(location=(0.43, -0.25, 0.58))
    label = bpy.context.object
    label.name = "Email mark"
    label.data.body = "@"
    label.data.size = 0.42
    label.data.align_x = "CENTER"
    label.data.materials.append(ink)

    setup_scene((7.2, -9.0, 7.3), (0, 0, 0.45), 5.4, "contact-resolution")
    bpy.ops.render.render(write_still=True)


def quality_evidence_study():
    """Show the case-study's real testing scale as a readable report view."""
    clear_scene()
    porcelain = material("Evidence porcelain", (0.94, 0.95, 0.93), 0.06, 0.28)
    paper = material("Report screen", (0.98, 0.97, 0.93), 0.01, 0.31)
    slate = material("Report frame", (0.31, 0.40, 0.48), 0.4, 0.26)
    accent = material("Report accent", (0.43, 0.70, 0.82), 0.18, 0.22)

    rounded_box("Evidence monitor stand", (0, 0.38, 0.48), (0.22, 0.18, 0.56), porcelain, 0.06, 5)
    rounded_box("Evidence monitor foot", (0, 0.18, 0.16), (1.25, 0.54, 0.12), slate, 0.06, 6)
    browser_panel("Automated quality report", (0, 0.40, 1.55), 3.42, 2.08,
                  slate, paper, accent, layout="audit")
    # These numbers come from the case-study copy: automated coverage and
    # issues addressed, rather than a fabricated percentage or pass score.
    metrics = [(-1.06, "~50", "A11Y ROUTES"), (0.0, "~80", "SEO ROUTES"), (1.06, "200+", "ISSUES ADDRESSED")]
    for index, (x, value, label) in enumerate(metrics, 1):
        rounded_box(f"Evidence metric card {index}", (x, -0.30, 0.48), (0.92, 0.12, 0.50), porcelain, 0.045, 5)
        screen_label(f"Evidence metric {index}", value, (x - 0.30, -0.38, 0.62), 0.18, accent)
        screen_label(f"Evidence label {index}", label, (x - 0.36, -0.38, 0.45), 0.052, slate)

    setup_scene((7.2, -9.1, 7.5), (0, 0.0, 1.0), 5.5, "quality-evidence")
    bpy.ops.render.render(write_still=True)


def ai_governance_study():
    """Show AI work passing through two visible governance checks."""
    clear_scene()
    porcelain = material("Governance porcelain", (0.9, 0.94, 0.97), 0.12, 0.22)
    mist = material("Governance mist", (0.57, 0.76, 0.86), 0.26, 0.2)
    slate = material("Governance slate", (0.34, 0.44, 0.53), 0.48, 0.25)
    steel = material("Governance steel", (0.71, 0.8, 0.86), 0.58, 0.21)

    # One grounded assembly ties together the agent workspace, two separate
    # review gates, and a small persistent decision record.
    rounded_box("Governance foundation", (0, 0, 0.1), (5.7, 3.55, 0.2), slate, 0.2, 8)
    rounded_box("Workspace surface", (0, 0, 0.25), (5.3, 3.2, 0.12), porcelain, 0.13, 8)

    # The two left-side input streams stay distinct until each passes a gate:
    # the upper path represents direct edits; the lower path represents shell.
    lane_y = [0.88, -0.88]
    gate_x = -0.68
    for index, y in enumerate(lane_y, 1):
        start_x = -2.3
        bezier_tube(
            f"Incoming change path {index}",
            [(start_x, y, 0.48), (-1.65, y, 0.5), (-1.17, y, 0.5), (gate_x - 0.2, y, 0.5)],
            0.045,
            steel if index == 1 else mist,
        )
        rounded_box(f"Incoming change file {index}", (start_x, y, 0.55), (0.34, 0.27, 0.09),
                    mist if index == 1 else porcelain, 0.035, 5)
        for line in range(2):
            rounded_box(f"Incoming file detail {index}-{line + 1}",
                        (start_x, y - 0.035 + line * 0.07, 0.60), (0.19 + line * 0.04, 0.018, 0.012),
                        steel, 0.008, 3)

        # Open architectural frames read as checkpoints without using labels.
        for side, offset in enumerate([-0.26, 0.26], 1):
            rounded_box(
                f"Review gate {index} post {side}",
                (gate_x, y + offset, 0.68),
                (0.16, 0.15, 0.68),
                steel,
                0.055,
                6,
            )
        rounded_box(
            f"Review gate {index} lintel",
            (gate_x, y, 1.04),
            (0.18, 0.66, 0.14),
            mist if index == 1 else porcelain,
            0.06,
            6,
        )
        cylinder(f"Review point {index}", (gate_x, y, 0.48), 0.17, 0.08, slate, bevel=0.025)
        screen_label(f"Change path label {index}", "EDIT / WRITE" if index == 1 else "BASH",
                     (-2.68, -1.35, 1.36 if index == 1 else 0.94), 0.075, slate)

    # Cleared paths converge only after the two controls and enter the agent's
    # bounded work area, the central focal form of the composition.
    for index, y in enumerate(lane_y, 1):
        bezier_tube(
            f"Reviewed path {index}",
            [(gate_x + 0.12, y, 0.5), (-0.1, y * 0.8, 0.55), (0.38, y * 0.38, 0.58), (0.74, 0, 0.62)],
            0.04,
            mist if index == 1 else steel,
        )

    # The destination is an actual code-review view with named governance
    # files and visible diff/review details. Incoming paths remain distinct
    # until they reach this repository after review.
    rounded_box("Repository monitor stand", (1.12, 0.16, 0.48), (0.18, 0.15, 0.48), steel, 0.05, 5)
    browser_panel("Governed repository", (1.12, 0.10, 1.30), 1.85, 1.72,
                  slate, porcelain, mist, layout="editor")

    # The small layered ledger makes the rationale auditable, not just the
    # control points. Its unmarked pages avoid implying a fabricated report.
    ledger_x, ledger_y = 1.92, -1.12
    for page in range(3):
        rounded_box(
            f"Decision log page {page + 1}",
            (ledger_x - page * 0.07, ledger_y + page * 0.07, 0.42 + page * 0.08),
            (0.82, 0.62, 0.1),
            porcelain if page == 2 else steel,
            0.055,
            6,
        )
    for index, width in enumerate([0.48, 0.36, 0.43], 1):
        rounded_box(
            f"Decision log entry {index}",
            (ledger_x - 0.01, ledger_y - 0.13 + index * 0.12, 0.77),
            (width, 0.035, 0.02),
            mist,
            0.016,
            4,
        )

    bezier_tube(
        "Audited workspace connection",
        [(1.48, -0.55, 0.57), (1.74, -0.82, 0.55), (1.83, -1.0, 0.53)],
        0.035,
        steel,
    )

    setup_scene((7.3, -10.0, 8.0), (0, 0, 0.67), 7.5, "ai-governance")
    bpy.ops.render.render(write_still=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # Regenerate the entire static artwork set from this script. The site
    # continues to use optimized WebP files; no 3D runtime is added.
    hero_study()
    platform_study()
    featured_work_study()
    for kind in ("architecture", "product", "frontend", "quality"):
        capability_study(kind)
    contact_study()
    quality_evidence_study()
    ai_governance_study()
    print("Rendered transparent artwork to", OUT_DIR)


if __name__ == "__main__":
    main()
