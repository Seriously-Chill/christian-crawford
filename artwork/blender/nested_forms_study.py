"""Render the four nested wooden forms for the portfolio site.

The closed composition is a solid sphere. The exploded composition separates
each shell into upper/lower halves and boolean-cuts a close-fitting seat for
the next form. The four individual renders show one form each, by itself.

Run this file from Blender's Text Editor. Set NESTED_PREVIEW=1 for smaller,
faster review renders. Output names are consumed by optimize_renders.mjs.
"""
import bpy
import bmesh
import math
import os
from mathutils import Vector

SCRIPT = "/Users/ccrawford/Documents/GitHub/christian-crawford/artwork/blender/nested_forms_study.py"
HERE = os.path.dirname(SCRIPT)
OUT = os.path.join(HERE, "renders")
WOOD_LIBRARY = os.path.join(HERE, "assets", "procedural-lacquered-wood", "Lacquered_Wood.blend")
PREVIEW = os.environ.get("NESTED_PREVIEW", "0") == "1"
SIZE = 900 if PREVIEW else 1800
SAMPLES = 24 if PREVIEW else 96

# The nesting tolerances are deliberately small so the pieces read as fitted
# joinery rather than loose floating shapes in the exploded composition.
SHAPES = ("sphere", "box", "diamond", "triangle")
CHILD = {"sphere": "box", "box": "diamond", "diamond": "triangle", "triangle": None}
EXPLODE = {"sphere": 1.28, "box": 0.88, "diamond": 0.48, "triangle": 0.18}
WOOD = {
    "sphere": ((0.055, 0.018, 0.009), (0.24, 0.095, 0.036), 9.5),
    "box": ((0.20, 0.075, 0.026), (0.52, 0.30, 0.12), 7.0),
    "diamond": ((0.16, 0.035, 0.018), (0.43, 0.13, 0.055), 8.5),
    "triangle": ((0.37, 0.20, 0.08), (0.72, 0.49, 0.25), 8.0),
}


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in list(bpy.data.materials):
        if block.users == 0:
            bpy.data.materials.remove(block)


def fallback_wood(name, dark, light, grain_scale):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*dark, 1)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    shader = nodes.get("Principled BSDF")
    shader.inputs["Roughness"].default_value = 0.31
    coat = shader.inputs.get("Coat Weight") or shader.inputs.get("Clearcoat")
    if coat:
        coat.default_value = 0.17
    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1.7, 1.7, grain_scale)
    links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
    wave = nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.inputs["Scale"].default_value = 3.2
    wave.inputs["Distortion"].default_value = 4.0
    wave.inputs["Detail"].default_value = 3.0
    links.new(mapping.outputs["Vector"], wave.inputs["Vector"])
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.18
    ramp.color_ramp.elements[0].color = (*dark, 1)
    ramp.color_ramp.elements[1].position = 0.82
    ramp.color_ramp.elements[1].color = (*light, 1)
    links.new(wave.outputs["Color"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], shader.inputs["Base Color"])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.10
    bump.inputs["Distance"].default_value = 0.018
    links.new(wave.outputs["Color"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    return mat


def wood_material(name, dark, light, grain_scale):
    """Use the downloaded procedural lacquer material; fall back if incompatible."""
    try:
        if not os.path.isfile(WOOD_LIBRARY):
            raise FileNotFoundError(WOOD_LIBRARY)
        with bpy.data.libraries.load(WOOD_LIBRARY, link=False) as (source, target):
            target.materials = [n for n in source.materials
                                if n in {"MAMaterial.001", "MAMaterial.002", "Material.001"}]
        candidates = [mat for mat in target.materials if mat and mat.use_nodes]
        base = next((mat for mat in candidates if any(
            node.type == "GROUP" and node.node_tree and
            "lacquered_wood" in node.node_tree.name.lower()
            for node in mat.node_tree.nodes)), None)
        if base is None:
            base = next((mat for mat in candidates if any(
                node.type == "GROUP" and node.node_tree and
                {socket.name for socket in node.inputs}.intersection(
                    {"Color 1", "Color 2", "Glossy Color"})
                for node in mat.node_tree.nodes)), None)
        if base is None:
            raise RuntimeError("No lacquered wood node group found in the downloaded material")
        mat = base.copy()
        mat.name = name
        mat.diffuse_color = (*dark, 1)
        for node in mat.node_tree.nodes:
            if node.type != "GROUP":
                continue
            for socket in node.inputs:
                if socket.name == "Color 1":
                    socket.default_value = (*dark, 1)
                elif socket.name == "Color 2":
                    socket.default_value = (*light, 1)
        return mat
    except Exception as exc:
        print("Using procedural fallback for", name, "because:", exc)
        return fallback_wood(name, dark, light, grain_scale)


def materials():
    return {kind: wood_material("Wood | " + kind, *WOOD[kind]) for kind in SHAPES}


def make_form(kind, material, name=None, scale=1.0):
    """Create one closed, manifold sphere, box, diamond, or triangular solid."""
    name = name or kind.title()
    if kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=96, radius=2.0 * scale)
        obj = bpy.context.object
        for face in obj.data.polygons:
            face.use_smooth = True
    elif kind == "box":
        bpy.ops.mesh.primitive_cube_add(size=2.20 * scale)
        obj = bpy.context.object
        bevel = obj.modifiers.new("Small hand-finished radius", "BEVEL")
        bevel.width = 0.018 * scale
        bevel.segments = 3
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=bevel.name)
        obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    elif kind == "diamond":
        r = 1.04 * scale
        verts = [(r, 0, 0), (-r, 0, 0), (0, r, 0), (0, -r, 0), (0, 0, r), (0, 0, -r)]
        faces = [(0, 2, 4), (2, 1, 4), (1, 3, 4), (3, 0, 4),
                 (2, 0, 5), (1, 2, 5), (3, 1, 5), (0, 3, 5)]
        obj = mesh_object(name, verts, faces)
    else:  # A compact tetrahedron: the 3D triangular core.
        r = 0.50 * scale
        verts = [(0, 0, 4 * r / 3), (2 * r / math.sqrt(3), 0, -r / 3),
                 (-r / math.sqrt(3), r, -r / 3), (-r / math.sqrt(3), -r, -r / 3)]
        faces = [(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)]
        obj = mesh_object(name, verts, faces)
    obj.name = name
    if material is not None:
        obj.data.materials.append(material)
    return obj


def mesh_object(name, verts, faces):
    mesh = bpy.data.meshes.new(name + " | mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def boolean_apply(obj, cutter, operation):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    mod = obj.modifiers.new("Precision carved cavity", "BOOLEAN")
    mod.operation = operation
    mod.object = cutter
    if hasattr(mod, "solver"):
        mod.solver = "EXACT"
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def half_cutter(top):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 2.6 if top else -2.6))
    cutter = bpy.context.object
    cutter.name = "Temporary half-space"
    cutter.dimensions = (8, 8, 5.2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return cutter


def carved_halves(kind, child, material, clearance=1.035):
    """Cut the next form's seat, then split the shell at its equator."""
    halves = []
    for is_top in (True, False):
        shell = make_form(kind, material, "%s | %s half" % (kind.title(), "upper" if is_top else "lower"))
        if child:
            cutter = make_form(child, None, "Temporary fitted-form cutter", clearance)
            boolean_apply(shell, cutter, "DIFFERENCE")
        boolean_apply(shell, half_cutter(is_top), "INTERSECT")
        bevel = shell.modifiers.new("Softened cut edges", "BEVEL")
        bevel.width = 0.012
        bevel.segments = 3
        shell.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
        halves.append(shell)
    return halves


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def setup_render(filename, scale=5.2, camera=(5.6, -8.7, 6.0)):
    scene = bpy.context.scene
    available = {item.identifier for item in scene.render.bl_rna.properties["engine"].enum_items}
    scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in available else "BLENDER_EEVEE"
    if hasattr(scene, "eevee") and hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = SAMPLES
    scene.render.resolution_x = SIZE
    scene.render.resolution_y = SIZE
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = True
    transforms = {item.name for item in scene.view_settings.bl_rna.properties["view_transform"].enum_items}
    scene.view_settings.view_transform = "AgX" if "AgX" in transforms else "Standard"
    scene.world.color = (0.12, 0.12, 0.12)
    scene.camera.location = camera
    look_at(scene.camera, (0, 0, 0))
    scene.camera.data.type = "ORTHO"
    scene.camera.data.ortho_scale = scale
    scene.render.filepath = os.path.join(OUT, filename + ("-preview.png" if PREVIEW else ".png"))
    scene.camera.data.lens = 55
    bpy.ops.render.render(write_still=True)


def add_studio():
    bpy.ops.object.camera_add(location=(5.6, -8.7, 6.0))
    camera = bpy.context.object
    camera.name = "Nested forms | product studio camera"
    look_at(camera, (0, 0, 0))
    bpy.context.scene.camera = camera
    for name, location, energy, size, color in (
        ("Warm key", (-4.5, -5.5, 7.0), 900, 5.0, (1.0, 0.82, 0.64)),
        ("Soft fill", (5.0, -3.0, 2.5), 440, 4.0, (0.78, 0.86, 1.0)),
        ("Amber rim", (2.0, 4.0, 5.0), 1100, 3.0, (1.0, 0.69, 0.42)),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = name
        light.data.energy = energy
        light.data.shape = "DISK"
        light.data.size = size
        light.data.color = color
        look_at(light, (0, 0, 0))


def render_single(kind):
    clear_scene()
    mats = materials()
    isolated_scale = {"sphere": 1.0, "box": 1.0, "diamond": 1.75, "triangle": 2.25}[kind]
    make_form(kind, mats[kind], kind.title() + " | isolated form", isolated_scale)
    add_studio()
    render_scale = {"sphere": 4.85, "box": 2.95, "diamond": 3.05, "triangle": 3.10}[kind]
    setup_render("nested-" + kind, scale=render_scale)


def render_assembled():
    clear_scene()
    mats = materials()
    # In its closed state only the sphere's uninterrupted exterior is visible.
    make_form("sphere", mats["sphere"], "Nested system | assembled solid sphere")
    add_studio()
    setup_render("nested-assembled", scale=4.85)


def render_exploded():
    clear_scene()
    mats = materials()
    for kind in SHAPES:
        halves = carved_halves(kind, CHILD[kind], mats[kind])
        offset = EXPLODE[kind]
        for obj, direction in zip(halves, (1, -1)):
            obj.location.z += direction * offset
    add_studio()
    setup_render("nested-exploded", scale=8.0, camera=(7.0, -11.0, 9.0))
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "nested_forms_study.blend"))


def main():
    os.makedirs(OUT, exist_ok=True)
    # One closed assembly, one exploded cavity view, and the four isolated forms.
    # No props, labels, plinths, or unrelated illustration objects are added.
    render_assembled()
    render_exploded()
    for kind in SHAPES:
        render_single(kind)
    print("Six nested-form renders written to", OUT)


main()
