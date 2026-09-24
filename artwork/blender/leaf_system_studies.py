"""Create three editorial 3D studies for the portfolio's system-shaping theme.

Run from the repository root with:
  /Applications/Blender.app/Contents/MacOS/Blender -b --python artwork/blender/leaf_system_studies.py

Outputs transparent PNGs under artwork/blender/renders: an intact leaf, a
revealed leaf skeleton, and its branching structure resolving into interface
surfaces. This is a visual metaphor study, not a proposed nature brand.
"""

import bpy
import math
import os
from mathutils import Vector


SIZE = 1400
def resolve_script_path():
    """Locate the saved script when Blender runs it from its Text Editor."""
    expected_name = "leaf_system_studies.py"
    candidates = []

    text = bpy.data.texts.get(expected_name)
    if text and text.filepath:
        candidates.append(bpy.path.abspath(text.filepath))

    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "TEXT_EDITOR":
                active_text = area.spaces.active.text
                if active_text and active_text.filepath:
                    candidates.append(bpy.path.abspath(active_text.filepath))

    # In background mode __file__ is normally valid. Blender's Text Editor can
    # instead report a root-level pseudo-path such as /leaf_system_studies.py.
    script_file = globals().get("__file__")
    if script_file:
        candidates.append(os.path.abspath(script_file))

    for candidate in candidates:
        if os.path.isfile(candidate) and os.path.basename(candidate) == expected_name:
            return candidate

    # Useful fallback for Text Editor runs when the text block lost its path.
    fallback = os.path.expanduser(
        "~/Documents/GitHub/christian-crawford/artwork/blender/leaf_system_studies.py"
    )
    if os.path.isfile(fallback):
        return fallback

    raise RuntimeError(
        "Could not locate leaf_system_studies.py. Open the saved script from "
        "Documents/GitHub/christian-crawford/artwork/blender/ and run it again."
    )


SCRIPT_PATH = resolve_script_path()
ROOT = os.path.abspath(os.path.join(os.path.dirname(SCRIPT_PATH), "..", ".."))
OUT_DIR = os.path.join(ROOT, "artwork", "blender", "renders")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def mat(name, color, metallic=0.0, roughness=0.3, transmission=0.0):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    # Blender versions have used both socket labels on Principled BSDF.
    transmission_socket = bsdf.inputs.get("Transmission Weight")
    if transmission_socket is None:
        transmission_socket = bsdf.inputs.get("Transmission")
    if transmission_socket is not None:
        transmission_socket.default_value = transmission
    return material


def smooth_path(name, points, radius, material, resolution=4):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 24
    curve.bevel_depth = radius
    curve.bevel_resolution = resolution
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def leaf_profile(t, length, half_width):
    """Asymmetric oval leaf outline with a tapered apex and rounded base."""
    profile = math.sin(math.pi * (0.04 + 0.92 * t)) ** 0.72
    shoulder = 0.78 + 0.32 * math.sin(math.pi * t * 0.72)
    width = half_width * profile * shoulder
    center_x = 0.10 * math.sin(math.pi * t) - 0.12 * t + 0.035 * math.sin(3 * math.pi * t)
    return center_x, width


def leaf_mesh(name, length, half_width, material, z_offset=0.0, segments=100, across=32):
    """A finely veined, softly cupped oval leaf blade."""
    vertices, faces = [], []
    for row in range(segments + 1):
        t = row / segments
        # Taper both ends, with a broader shoulder below the midpoint.
        center_x, width = leaf_profile(t, length, half_width)
        for col in range(across + 1):
            u = col / across * 2.0 - 1.0
            x = center_x + u * width
            y = (t - 0.5) * length
            dome = 0.12 * (1.0 - u * u) * math.sin(math.pi * t) + 0.025 * math.sin(t * math.pi)
            vertices.append((x, y, dome + z_offset))
    for row in range(segments):
        for col in range(across):
            a = row * (across + 1) + col
            b = a + across + 1
            faces.append((a, a + 1, b + 1, b))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    solid = obj.modifiers.new("Fine translucent edge", "SOLIDIFY")
    solid.thickness = 0.012
    bevel = obj.modifiers.new("Soft leaf edge", "BEVEL")
    bevel.width = 0.018
    bevel.segments = 3
    return obj


def vein_network(prefix, length, half_width, vein_material, detailed=True, z_offset=0.0):
    """Hierarchical reticulate venation: midrib, arcing secondaries, fine meshes."""
    def z_at(t, x, order=0):
        _, width = leaf_profile(max(0.02, min(0.98, t)), length, half_width)
        u = max(-1.0, min(1.0, x / max(0.02, width)))
        dome = 0.12 * (1 - u*u) * math.sin(math.pi*t) + 0.025 * math.sin(math.pi*t)
        return dome + z_offset + 0.025 + order * 0.008

    # The primary vein follows the slight natural curve of the leaf.
    mid = []
    for i in range(25):
        t = 0.015 + 0.97 * i / 24
        cx, _ = leaf_profile(t, length, half_width)
        y = (t - 0.5) * length
        mid.append((cx, y, z_at(t, cx, 2)))
    smooth_path(prefix + " primary midrib", mid, 0.036 if detailed else 0.045, vein_material)

    # Secondary veins leave the midrib at slightly irregular intervals, arc
    # forward, then join a marginal collecting vein as in many broad leaves.
    count = 10 if detailed else 8
    secondaries = { -1: [], 1: [] }
    for side in (-1, 1):
        for index in range(count):
            t = 0.13 + index * (0.74 / (count - 1)) + 0.008 * math.sin(index * 2.1 + side)
            cx, width = leaf_profile(t, length, half_width)
            x0, y0 = cx, (t - 0.5) * length
            x1 = cx + side * width * 0.94
            y1 = y0 + (0.23 if t < 0.52 else -0.16)
            pts = []
            for step in range(7):
                f = step / 6
                x = x0 + (x1 - x0) * f
                y = y0 + (y1 - y0) * f + side * 0.12 * math.sin(math.pi*f)
                tt = max(0.02, min(0.98, y / length + 0.5))
                pts.append((x, y, z_at(tt, x, 1)))
            smooth_path(f"{prefix} secondary {side} {index+1}", pts,
                        0.018 if detailed else 0.022, vein_material, 3)
            secondaries[side].append((t, pts))

    # Tertiary veins link neighboring secondaries into irregular areoles.
    # Their loops are intentionally unequal rather than a repeated grid.
    if detailed:
        for side in (-1, 1):
            branches = secondaries[side]
            for index in range(len(branches) - 1):
                t0, path0 = branches[index]
                t1, path1 = branches[index + 1]
                for fraction in (0.42, 0.72):
                    p0 = path0[int(fraction * 6)]
                    p1 = path1[int((fraction + 0.06) * 6)]
                    dx = p1[0] - p0[0]
                    dy = p1[1] - p0[1]
                    bend = side * (0.035 + 0.025 * math.sin(index * 1.7 + fraction))
                    pts = [p0,
                           (p0[0] + dx*0.33 + bend, p0[1] + dy*0.30, max(p0[2], p1[2]) + 0.006),
                           (p0[0] + dx*0.68 - bend*0.5, p0[1] + dy*0.72, max(p0[2], p1[2]) + 0.006),
                           p1]
                    smooth_path(f"{prefix} tertiary mesh {side}-{index}-{fraction}", pts, 0.0075, vein_material, 2)


def rounded_box(name, location, dims, material, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    edge = obj.modifiers.new("Soft machined corners", "BEVEL")
    edge.width = bevel
    edge.segments = 6
    obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def sphere(name, location, scale, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def rod_between(name, a, b, radius, material):
    start, end = Vector(a), Vector(b)
    delta = end - start
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=delta.length,
                                       location=(start + end) / 2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    obj.data.materials.append(material)
    return obj


def browser_card(name, x, y, z, width, height, shell, screen, accent, layout):
    """Small oblique browser cards with enough UI cues to read as software."""
    rounded_box(name + " porcelain bezel", (x, y, z), (width, 0.12, height), shell, 0.07)
    rounded_box(name + " warm screen", (x, y - 0.067, z), (width - 0.09, 0.018, height - 0.09), screen, 0.035)
    top = z + height * 0.34
    rounded_box(name + " browser chrome", (x, y - 0.084, top), (width * 0.86, 0.015, 0.075), shell, 0.018)
    for i in range(3):
        sphere(name + f" browser dot {i+1}", (x - width*0.32 + i*0.05, y - 0.098, top),
               (0.014, 0.009, 0.014), accent)
    # Title strip and deliberately varied content blocks suggest real product UI.
    rounded_box(name + " title", (x - width*0.22, y - 0.083, z + height*0.17),
                (width*0.34, 0.014, 0.035), accent, 0.012)
    if layout == "catalog":
        for i in range(3):
            tile_x = x + (i - 1) * width * 0.25
            rounded_box(name + f" product tile {i+1}", (tile_x, y - 0.084, z - height*0.04),
                        (width*0.20, 0.016, height*0.30), shell, 0.025)
            sphere(name + f" product image {i+1}", (tile_x, y - 0.102, z + height*0.015),
                   (width*0.055, 0.012, width*0.07), accent if i == 1 else screen)
            rounded_box(name + f" product line {i+1}", (tile_x, y - 0.102, z - height*0.14),
                        (width*0.12, 0.01, 0.016), accent, 0.007)
    else:
        for i in range(3):
            yy = z + height*0.07 - i*height*0.13
            rounded_box(name + f" workflow row {i+1}", (x, y - 0.084, yy),
                        (width*0.66, 0.014, height*0.075), shell, 0.016)
            rounded_box(name + f" workflow detail {i+1}", (x - width*0.19, y - 0.101, yy),
                        (width*0.20, 0.009, 0.014), accent, 0.006)


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def lighting(camera_location, target, scale, filename):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True
    scene.render.resolution_x = SIZE
    scene.render.resolution_y = SIZE
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "AgX"
    scene.world.color = (0.12, 0.15, 0.18)

    cam_data = bpy.data.cameras.new("Editorial orthographic camera")
    cam = bpy.data.objects.new("Editorial orthographic camera", cam_data)
    scene.collection.objects.link(cam)
    cam.location = camera_location
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = scale
    aim(cam, target)
    scene.camera = cam

    def light(name, location, power, size, color):
        data = bpy.data.lights.new(name, "AREA")
        data.energy, data.shape, data.size, data.color = power, "DISK", size, color
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
        obj.location = location
        aim(obj, target)

    light("Large cool silk", (1, -4, 8), 1250, 6.0, (0.77, 0.88, 1.0))
    light("Warm leaf edge", (-5, 1, 4), 1000, 4.0, (1.0, 0.78, 0.50))
    light("Soft overhead", (3, 5, 7), 1500, 5.0, (0.94, 0.98, 1.0))
    scene.render.filepath = os.path.join(OUT_DIR, filename + ".png")


def whole_leaf_study():
    clear_scene()
    blade = mat("Translucent blue green blade", (0.25, 0.48, 0.48), 0.08, 0.32, 0.18)
    veins = mat("Natural warm midrib", (0.36, 0.34, 0.25), 0.08, 0.4)
    fine = mat("Fine natural venation", (0.52, 0.52, 0.40), 0.10, 0.38)
    leaf_mesh("Intact translucent specimen", 5.8, 1.46, blade)
    vein_network("Intact leaf venation", 5.8, 1.46, fine, detailed=True)
    # A stronger center rib remains visible through the translucent tissue.
    cx0, _ = leaf_profile(0.0, 5.8, 1.46)
    cx1, _ = leaf_profile(1.0, 5.8, 1.46)
    smooth_path("Petiole and primary rib", [(cx0, -3.12, 0.05), (-0.03, -2.1, 0.16),
                                              (0.02, 0.1, 0.18), (cx1, 2.94, 0.05)],
                0.047, veins)
    lighting((6.9, -8.1, 8.2), (0, 0, 0), 7.0, "leaf-whole")
    bpy.ops.render.render(write_still=True)


def leaf_network_study():
    clear_scene()
    tissue = mat("Lifted pale blue tissue", (0.35, 0.59, 0.63), 0.04, 0.34, 0.21)
    midrib = mat("Warm organic midrib", (0.39, 0.34, 0.24), 0.08, 0.42)
    network = mat("Natural vascular network", (0.62, 0.59, 0.46), 0.12, 0.38)
    length, width = 5.8, 1.46
    # The membrane lifts as a thin translucent sheet; a real reticulate
    # skeleton remains below it, so the separated layers read at a glance.
    leaf_mesh("Raised translucent membrane", length, width, tissue, z_offset=0.52)
    vein_network("Exposed leaf skeleton", length, width, network, detailed=True)
    cx0, _ = leaf_profile(0.0, length, width)
    cx1, _ = leaf_profile(1.0, length, width)
    smooth_path("Exposed primary rib", [(cx0, -3.18, 0.08), (-0.03, -2.0, 0.17),
                                          (0.02, 0.1, 0.18), (cx1, 2.95, 0.08)], 0.05, midrib)
    lighting((7.1, -8.4, 8.6), (0, 0, 0.22), 7.25, "leaf-network")
    bpy.ops.render.render(write_still=True)


def leaf_interface_study():
    clear_scene()
    vein = mat("Digitalized warm structure", (0.53, 0.55, 0.48), 0.14, 0.34)
    shell = mat("Porcelain interface frames", (0.78, 0.86, 0.88), 0.18, 0.22)
    screen = mat("Warm interface glass", (0.95, 0.95, 0.91), 0.04, 0.25)
    accent = mat("Mineral blue interaction", (0.31, 0.61, 0.69), 0.22, 0.23)

    # The midrib becomes a shared service spine. Branches resolve into three
    # actual interface surfaces instead of putting UI inside a literal leaf.
    rounded_box("Shared digital foundation", (0, -0.55, 0.14), (5.25, 0.50, 0.22), vein, 0.12)
    browser_card("Shared product core", 0, 0.14, 1.16, 1.62, 1.46, shell, screen, accent, "workflow")
    browser_card("Configurable experience one", -2.08, 0.00, 0.91, 1.44, 1.26, shell, screen, accent, "catalog")
    browser_card("Configurable experience two", 2.08, 0.00, 0.91, 1.44, 1.26, shell, screen, accent, "catalog")

    for side in (-1, 1):
        smooth_path(f"Organic branch resolving to product {side}",
                    [(0.0, -0.48, 0.28), (side*0.54, -0.18, 0.43),
                     (side*1.12, 0.34, 0.60), (side*1.72, 0.48, 0.70)],
                    0.025, vein, 3)
        smooth_path(f"Fine branch resolving to product {side}",
                    [(side*0.54, -0.18, 0.43), (side*0.95, -0.47, 0.42),
                     (side*1.66, -0.40, 0.50)], 0.012, vein, 3)
        rod_between(f"Shared foundation connection {side}", (side*1.72, 0.48, 0.70),
                    (side*2.08, 0.30, 0.70), 0.023, accent)

    lighting((7.4, -9.8, 9.0), (0, 0, 0.7), 7.2, "leaf-interface")
    bpy.ops.render.render(write_still=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    whole_leaf_study()
    leaf_network_study()
    leaf_interface_study()
    print("Rendered three leaf-to-system studies to", OUT_DIR)


if __name__ == "__main__":
    main()
