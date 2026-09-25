"""Render the four nested wooden forms for the portfolio site.

The closed composition is a solid sphere. The exploded composition is a
cutaway: every shell has a close-fitting seat boolean-cut for the next form
and an eighth removed, so all four layers show at once. The brands
composition sets three cutaways side by side: an identical nested core inside
three different outer shells, i.e. one shared platform, many brands. The four
layers composition pulls one system apart along an axis: shared core,
configuration, brand shell. The x-ray renders show the closed system
with one layer in wood and the others as clear ghosts, no cutaway. The individual renders show
the sphere and the triangle, each by itself.

Rendering is Cycles with a soft, high-key product rig: very large softboxes
(broad satin sheens instead of hot spots), wide strip rims to separate the
forms from any page colour, a dim studio HDRI seen only in reflections, and a
transparent shadow catcher for a soft contact shadow. Lighting stays neutral
because the site's hue picker can put the art on any colour, grey, white or
black. The wood is procedural but physically structured: 3D growth rings
(end grain where a cut crosses them), stretched pores along the grain, slow
colour drift, and a hand-oiled satin finish.

Run from Blender's Text Editor, or headless:
    blender -b --python nested_forms_study.py
Environment switches:
    NESTED_PREVIEW=1           small, fast review renders (suffix -preview)
    NESTED_JOBS=a,b            subset of: assembled, exploded, brands,
                               brands-compact, layers, xray-core,
                               xray-middle, xray-shell, sphere, triangle
    NESTED_VIEW=az,el          exploded camera azimuth/elevation in degrees
    NESTED_OUT=/path           output folder (default ./renders)
    NESTED_SAVE=1              save the exploded scene to the .blend
Output names are consumed by optimize_renders.mjs.
"""
import bpy
import glob
import math
import os
from mathutils import Vector

# Headless runs (`blender -b --python`) set __file__; the Text Editor doesn't,
# so fall back to the saved .blend's folder when run from inside Blender.
HERE = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else bpy.path.abspath("//")
OUT = os.environ.get("NESTED_OUT") or os.path.join(HERE, "renders")
PREVIEW = os.environ.get("NESTED_PREVIEW", "0") == "1"
JOBS = [j for j in os.environ.get("NESTED_JOBS", "").split(",") if j] or [
    "assembled", "exploded", "brands", "brands-compact", "layers",
    "xray-core", "xray-middle", "xray-shell", "sphere", "triangle"]
SIZE = 700 if PREVIEW else 1800
SAMPLES = 64 if PREVIEW else 384
LENS = 85  # Long product lens: no wide-angle bulge, calm perspective.

SHAPES = ("sphere", "box", "diamond", "triangle")
CHILD = {"sphere": "box", "box": "diamond", "diamond": "triangle", "triangle": None}

# Pale Scandinavian set, per shell (linear colours): earlywood, latewood,
# ring frequency, grain rotation (radians), pith offset (object units), pore
# strength. Tones step light/mid/light/dark from the outside in, so every cut
# face in the cutaway reads as its own layer.
WOOD = {
    # White ash, a shade deeper than raw timber so it separates from a white page.
    "sphere": ((0.52, 0.40, 0.27), (0.34, 0.24, 0.145), 3.0, (1.45, 0.18, 0.35), (0.0, 3.8, 0.0), 0.45),
    # Honey oak: the one mid-tone.
    "box": ((0.40, 0.25, 0.12), (0.27, 0.16, 0.07), 4.2, (1.62, -0.12, 0.8), (0.4, 4.6, 0.0), 0.45),
    # Oiled maple: pale, with enough amber that the facets still read as wood.
    "diamond": ((0.60, 0.40, 0.22), (0.47, 0.30, 0.16), 5.0, (1.3, 0.25, -0.4), (0.0, 3.2, 0.6), 0.15),
    # Walnut: the small dark core revealed at the centre.
    "triangle": ((0.092, 0.042, 0.019), (0.044, 0.019, 0.009), 7.0, (1.5, 0.0, 0.2), (0.3, 2.5, 0.0), 0.4),
}


# --------------------------------------------------------------------------
# Scene / materials

def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def mix_rgb(nodes, blend):
    node = nodes.new("ShaderNodeMix")
    node.data_type = "RGBA"
    node.blend_type = blend
    sockets = {s.identifier: s for s in node.inputs}
    return node, sockets["Factor_Float"], sockets["A_Color"], sockets["B_Color"], node.outputs[2]


def wood_material(kind):
    early, late, ring_scale, rotation, pith, pore_strength = WOOD[kind]
    mat = bpy.data.materials.new("Wood | " + kind)
    mat.diffuse_color = (*early, 1)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    shader = nodes.get("Principled BSDF")

    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    # Rotate the growth axis off the object's axes and push the pith outside
    # the piece, so cuts show cathedral arches rather than a bullseye.
    mapping.inputs["Rotation"].default_value = rotation
    mapping.inputs["Location"].default_value = pith
    links.new(coord.outputs["Object"], mapping.inputs["Vector"])

    rings = nodes.new("ShaderNodeTexWave")
    rings.wave_type = "RINGS"
    rings.rings_direction = "Z"
    rings.wave_profile = "SAW"
    rings.inputs["Scale"].default_value = ring_scale
    rings.inputs["Distortion"].default_value = 2.2
    rings.inputs["Detail"].default_value = 3.0
    rings.inputs["Detail Scale"].default_value = 0.9
    rings.inputs["Detail Roughness"].default_value = 0.55
    # Warp the growth field at low frequency so ring spacing and direction
    # wander like real timber instead of printing even stripes.
    warp_noise = nodes.new("ShaderNodeTexNoise")
    warp_noise.inputs["Scale"].default_value = 0.5
    warp_noise.inputs["Detail"].default_value = 2.0
    links.new(mapping.outputs["Vector"], warp_noise.inputs["Vector"])
    centred = nodes.new("ShaderNodeVectorMath")
    centred.operation = "SUBTRACT"
    centred.inputs[1].default_value = (0.5, 0.5, 0.5)
    links.new(warp_noise.outputs["Color"], centred.inputs[0])
    warp = nodes.new("ShaderNodeVectorMath")
    warp.operation = "MULTIPLY_ADD"
    warp.inputs[1].default_value = (0.32, 0.32, 0.12)
    links.new(centred.outputs["Vector"], warp.inputs[0])
    links.new(mapping.outputs["Vector"], warp.inputs[2])
    links.new(warp.outputs["Vector"], rings.inputs["Vector"])

    # Pores: noise stretched hard along the growth axis (Z in mapped space).
    stretch = nodes.new("ShaderNodeVectorMath")
    stretch.operation = "MULTIPLY"
    stretch.inputs[1].default_value = (55.0, 55.0, 2.2)
    links.new(mapping.outputs["Vector"], stretch.inputs[0])
    pore_noise = nodes.new("ShaderNodeTexNoise")
    pore_noise.inputs["Scale"].default_value = 1.0
    pore_noise.inputs["Detail"].default_value = 2.0
    pore_noise.inputs["Roughness"].default_value = 0.5
    links.new(stretch.outputs["Vector"], pore_noise.inputs["Vector"])
    pores = nodes.new("ShaderNodeMapRange")
    pores.inputs["From Min"].default_value = 0.56
    pores.inputs["From Max"].default_value = 0.74
    links.new(pore_noise.outputs["Fac"], pores.inputs["Value"])

    ramp = nodes.new("ShaderNodeValToRGB")
    elements = ramp.color_ramp.elements
    elements[0].position = 0.0
    elements[0].color = (*early, 1)
    elements[1].position = 0.97
    elements[1].color = (*late, 1)
    mid = elements.new(0.62)
    mid.color = (*[c * 0.86 for c in early], 1)
    links.new(rings.outputs["Fac"], ramp.inputs["Fac"])

    darken, fac, a, b, out = mix_rgb(nodes, "MULTIPLY")
    b.default_value = (0.55, 0.45, 0.38, 1)
    pore_fac = nodes.new("ShaderNodeMath")
    pore_fac.operation = "MULTIPLY"
    pore_fac.inputs[1].default_value = pore_strength
    links.new(pores.outputs["Result"], pore_fac.inputs[0])
    links.new(pore_fac.outputs[0], fac)
    links.new(ramp.outputs["Color"], a)

    # Slow tonal drift across the piece, as real boards never hold one colour.
    drift_noise = nodes.new("ShaderNodeTexNoise")
    drift_noise.inputs["Scale"].default_value = 0.55
    drift_noise.inputs["Detail"].default_value = 1.0
    links.new(mapping.outputs["Vector"], drift_noise.inputs["Vector"])
    drift = nodes.new("ShaderNodeMapRange")
    drift.inputs["From Min"].default_value = 0.35
    drift.inputs["From Max"].default_value = 0.65
    drift.inputs["To Min"].default_value = 0.86
    drift.inputs["To Max"].default_value = 1.12
    links.new(drift_noise.outputs["Fac"], drift.inputs["Value"])
    hsv = nodes.new("ShaderNodeHueSaturation")
    links.new(drift.outputs["Result"], hsv.inputs["Value"])
    links.new(out, hsv.inputs["Color"])
    links.new(hsv.outputs["Color"], shader.inputs["Base Color"])

    # Hand-oiled satin: broad soft sheen, rougher in the open pores, and only
    # a whisper of coat so highlights spread instead of hot-spotting.
    rough = nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.52
    rough.inputs["To Max"].default_value = 0.72
    links.new(pore_fac.outputs[0], rough.inputs["Value"])
    links.new(rough.outputs["Result"], shader.inputs["Roughness"])
    shader.inputs["Coat Weight"].default_value = 0.12
    shader.inputs["Coat Roughness"].default_value = 0.32
    shader.inputs["Specular IOR Level"].default_value = 0.30

    height = nodes.new("ShaderNodeMath")
    height.operation = "MULTIPLY_ADD"
    height.inputs[1].default_value = 0.25
    links.new(rings.outputs["Fac"], height.inputs[0])
    links.new(pore_fac.outputs[0], height.inputs[2])
    bump = nodes.new("ShaderNodeBump")
    bump.invert = True
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.004
    links.new(height.outputs[0], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    links.new(bump.outputs["Normal"], shader.inputs["Coat Normal"]) if "Coat Normal" in shader.inputs else None
    return mat


def shell_material(name, color, roughness):
    """A plain matte finish for a brand's outer shell; neutral tones so the
    trio sits on any page colour."""
    mat = bpy.data.materials.new("Shell | " + name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Specular IOR Level"].default_value = 0.35
    shader.inputs["Coat Weight"].default_value = 0.08
    shader.inputs["Coat Roughness"].default_value = 0.3
    return mat


def materials():
    return {kind: wood_material(kind) for kind in SHAPES}


# --------------------------------------------------------------------------
# Geometry

def mesh_object(name, verts, faces):
    mesh = bpy.data.meshes.new(name + " | mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def make_form(kind, material, name=None, scale=1.0):
    """Create one closed, manifold sphere, box, diamond, or triangular solid."""
    name = name or kind.title()
    if kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=160, ring_count=112, radius=2.0 * scale)
        obj = bpy.context.object
    elif kind == "box":
        bpy.ops.mesh.primitive_cube_add(size=2.20 * scale)
        obj = bpy.context.object
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


def finish(obj, width):
    """Smooth-by-angle shading plus a small hardened bevel: real turned and
    sanded pieces never have knife edges, and the bevel is what catches the
    thin highlight lines that make an object read as physical."""
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
    bevel = obj.modifiers.new("Sanded edges", "BEVEL")
    bevel.width = width
    bevel.segments = 4
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(30)
    bevel.harden_normals = True
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


BEVEL = {"sphere": 0.014, "box": 0.028, "diamond": 0.02, "triangle": 0.012}


def octant_cutter():
    """The front-left upper eighth of space (x<0, y<0, z>0), facing camera."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-2.6, -2.6, 2.6))
    cutter = bpy.context.object
    cutter.dimensions = (5.2, 5.2, 5.2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return cutter


def cutaway_body(kind, child, material, clearance=1.035):
    """The shell with the next form's seat carved and the front eighth removed."""
    shell = make_form(kind, material, kind.title() + " | cutaway")
    if child:
        boolean_apply(shell, make_form(child, None, "Temporary fitted-form cutter", clearance), "DIFFERENCE")
    boolean_apply(shell, octant_cutter(), "DIFFERENCE")
    finish(shell, BEVEL[kind] * 0.8)
    return shell


# --------------------------------------------------------------------------
# Studio

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def camera_position(azimuth, elevation, width, target=(0, 0, 0)):
    """Place the camera on a sphere around target so `width` object units
    fill the frame at the fixed lens. Azimuth 0 = front (-Y)."""
    az, el = math.radians(azimuth), math.radians(elevation)
    direction = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    return Vector(target) + direction * (width * LENS / 36.0)


def configure_render():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for device in prefs.devices:
            device.use = True
        scene.cycles.device = "GPU"
    except Exception as exc:  # CPU still renders correctly, only slower.
        print("GPU unavailable, using CPU:", exc)
    scene.cycles.samples = SAMPLES
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.008
    scene.cycles.use_denoising = True
    scene.cycles.blur_glossy = 0.8
    scene.cycles.sample_clamp_indirect = 4.0
    scene.cycles.max_bounces = 10
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "16"
    scene.render.film_transparent = True
    scene.render.filter_size = 1.2
    scene.view_settings.view_transform = "AgX"
    for look in ("AgX - Base Contrast", "Base Contrast", "None"):
        try:
            scene.view_settings.look = look
            break
        except TypeError:
            pass
    scene.view_settings.exposure = 0.15


def add_world():
    world = bpy.context.scene.world or bpy.data.worlds.new("Studio")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    nodes.clear()
    background = nodes.new("ShaderNodeBackground")
    output = nodes.new("ShaderNodeOutputWorld")
    hdri = sorted(glob.glob("/Applications/Blender.app/Contents/Resources/*/datafiles/studiolights/world/studio.exr"))
    if hdri:
        env = nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(hdri[-1], check_existing=True)
        mapping = nodes.new("ShaderNodeMapping")
        mapping.inputs["Rotation"].default_value = (0, 0, math.radians(140))
        coord = nodes.new("ShaderNodeTexCoord")
        links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
        links.new(mapping.outputs["Vector"], env.inputs["Vector"])
        # The HDRI only appears in reflections. Diffuse and shadow rays see a
        # flat grey dome, so the catcher gets a soft ambient contact shadow
        # instead of long streaks from the HDRI's bright panels.
        path = nodes.new("ShaderNodeLightPath")
        pick = nodes.new("ShaderNodeMix")
        pick.data_type = "RGBA"
        sockets = {sk.identifier: sk for sk in pick.inputs}
        sockets["A_Color"].default_value = (0.46, 0.46, 0.46, 1)
        links.new(path.outputs["Is Glossy Ray"], sockets["Factor_Float"])
        links.new(env.outputs["Color"], sockets["B_Color"])
        links.new(pick.outputs[2], background.inputs["Color"])
    else:
        background.inputs["Color"].default_value = (0.5, 0.5, 0.5, 1)
    # Dim: it supplies reflections and gentle ambient only; the softboxes
    # do the shaping.
    background.inputs["Strength"].default_value = 0.28
    links.new(background.outputs["Background"], output.inputs["Surface"])


def area(name, location, energy, size, color, target=(0, 0, 0), shadow=True):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = "RECTANGLE"
    light.data.size, light.data.size_y = size
    light.data.color = color
    # Only the key and overhead cast shadows; low rims and fills would drag
    # long grey smears across the shadow catcher.
    light.data.use_shadow = shadow
    look_at(light, target)
    return light


def add_studio(camera_location, target=(0, 0, 0), floor_z=None):
    bpy.ops.object.camera_add(location=camera_location)
    camera = bpy.context.object
    camera.name = "Nested forms | product camera"
    camera.data.lens = LENS
    camera.data.clip_end = 400
    look_at(camera, target)
    bpy.context.scene.camera = camera
    add_world()
    t = Vector(target)
    # High-key, wraparound light in the manner of clean packaging renders:
    # very large sources, low contrast between key and fill, soft rims.
    # A big softbox high front-left models the form with a broad sheen.
    area("Key | large softbox", t + Vector((-7.0, -6.5, 7.0)), 1800, (11.0, 8.0), (1.0, 0.95, 0.89), t)
    # Two wide, gentle strips behind the object separate it from the page.
    area("Rim | strip left", t + Vector((-6.5, 6.0, 3.0)), 420, (2.5, 9.0), (1.0, 0.92, 0.82), t, shadow=False)
    area("Rim | strip right", t + Vector((7.0, 5.0, 2.0)), 380, (2.5, 9.0), (0.95, 0.97, 1.0), t, shadow=False)
    # Broad overhead scrim fills the tops and the carved seats.
    area("Top | scrim", t + Vector((0.5, 0.5, 10.0)), 900, (12.0, 12.0), (1.0, 0.97, 0.94), t)
    # Large neutral bounce from camera-right lifts the shadow side.
    area("Fill | bounce card", t + Vector((8.5, -7.0, 0.5)), 480, (10.0, 10.0), (0.97, 0.98, 1.0), t, shadow=False)
    if floor_z is not None:
        bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, floor_z))
        floor = bpy.context.object
        floor.name = "Shadow catcher"
        floor.is_shadow_catcher = True
    return camera


def render(filename, size, aspect=1.0):
    scene = bpy.context.scene
    scene.render.resolution_x = size
    scene.render.resolution_y = round(size / aspect)
    scene.render.filepath = os.path.join(OUT, filename + ("-preview.png" if PREVIEW else ".png"))
    bpy.ops.render.render(write_still=True)


# --------------------------------------------------------------------------
# Compositions

SINGLE = {
    # kind: (azimuth, elevation, frame width, z rotation, hover above floor)
    "sphere": (-32, 16, 5.8, 0, 0.0),
    # The small form is framed tighter so it fills its slot like the sphere.
    "triangle": (-28, 16, 1.9, 38, 0.0),
}


def render_single(kind):
    clear_scene()
    configure_render()
    mats = materials()
    obj = make_form(kind, mats[kind], kind.title() + " | isolated form")
    azimuth, elevation, width, spin, hover = SINGLE[kind]
    obj.rotation_euler.z = math.radians(spin)
    finish(obj, BEVEL[kind])
    bpy.context.view_layer.update()
    low = min((obj.matrix_world @ Vector(c)).z for c in obj.bound_box)
    high = max((obj.matrix_world @ Vector(c)).z for c in obj.bound_box)
    # Aim slightly below centre to leave room for the contact shadow, without
    # pushing the top of the form out of frame.
    target = (0, 0, (low + high) / 2 - 0.06 * width)
    add_studio(camera_position(azimuth, elevation, width, target), target, low - hover)
    render("nested-" + kind, SIZE)


def render_assembled():
    clear_scene()
    configure_render()
    mats = materials()
    # In its closed state only the sphere's uninterrupted exterior is visible.
    obj = make_form("sphere", mats["sphere"], "Nested system | assembled solid sphere")
    finish(obj, BEVEL["sphere"])
    target = (0, 0, -0.35)
    add_studio(camera_position(-32, 16, 5.3, target), target, -2.0)
    render("nested-assembled", SIZE)


EXPLODED_VIEW = tuple(float(v) for v in os.environ.get("NESTED_VIEW", "-16,20").split(","))


GHOST = os.environ.get("NESTED_GHOST", "outline")  # outline | glass | both | soft


def glass_material():
    """Thin-shell glass: see-through, with reflections only toward glancing
    angles (Fresnel). No refraction, so the page colour behind shows through
    correctly on any hue, and the lit layer inside isn't lens-distorted."""
    mat = bpy.data.materials.new("Ghost | thin glass")
    mat.diffuse_color = (0.9, 0.95, 1.0, 0.1)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    clear = nodes.new("ShaderNodeBsdfTransparent")
    gloss = nodes.new("ShaderNodeBsdfGlossy")
    gloss.inputs["Roughness"].default_value = 0.06
    fresnel = nodes.new("ShaderNodeFresnel")
    fresnel.inputs["IOR"].default_value = 1.5
    mix = nodes.new("ShaderNodeMixShader")
    links.new(fresnel.outputs["Fac"], mix.inputs["Fac"])
    links.new(clear.outputs["BSDF"], mix.inputs[1])
    links.new(gloss.outputs["BSDF"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    return mat


def soft_glass_material():
    """A whisper of glass for the outer shell: clear through the middle and a
    fine bright Fresnel rim, like the border of a frosted panel. No dark
    studio reflections, so it stays light on any page colour."""
    mat = bpy.data.materials.new("Ghost | soft glass")
    mat.diffuse_color = (1, 1, 1, 0.1)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    clear = nodes.new("ShaderNodeBsdfTransparent")
    rim = nodes.new("ShaderNodeEmission")
    rim.inputs["Color"].default_value = (1, 1, 1, 1)
    rim.inputs["Strength"].default_value = 0.9
    weight = nodes.new("ShaderNodeLayerWeight")
    weight.inputs["Blend"].default_value = 0.12
    mix = nodes.new("ShaderNodeMixShader")
    links.new(weight.outputs["Fresnel"], mix.inputs["Fac"])
    links.new(clear.outputs["BSDF"], mix.inputs[1])
    links.new(rim.outputs["Emission"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    return mat


def edge_material():
    """Fine bright edges: a soft white that holds on dark and light pages."""
    mat = bpy.data.materials.new("Ghost | edge")
    mat.diffuse_color = (1, 1, 1, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (0.78, 0.78, 0.78, 1)
    shader.inputs["Roughness"].default_value = 0.3
    shader.inputs["Emission Color"].default_value = (1, 1, 1, 1)
    shader.inputs["Emission Strength"].default_value = 0.2
    return mat


def outline(kind, edge_mat, camera_location):
    """Thin geometric edges for a ghost layer. Polyhedra get a tube on every
    edge; the sphere, which has no edges, gets a ring on its silhouette
    as seen from the camera."""
    thickness = 0.022
    if kind == "sphere":
        eye = Vector(camera_location)
        r, d = 2.0, eye.length
        # A sphere's silhouette from a point is a circle on the plane facing
        # the eye, slightly nearer the eye and smaller than the equator.
        centre = eye.normalized() * (r * r / d)
        radius = r * math.sqrt(1 - (r / d) ** 2)
        bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=thickness / 2,
                                         major_segments=256, minor_segments=12, location=centre)
        ring = bpy.context.object
        ring.rotation_euler = eye.normalized().to_track_quat("Z", "Y").to_euler()
        ring.data.materials.append(edge_mat)
        return ring
    obj = make_form(kind, edge_mat, kind.title() + " | edges")
    wire = obj.modifiers.new("Edges", "WIREFRAME")
    wire.thickness = thickness
    wire.use_even_offset = True
    wire.use_replace = True
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    return obj


def translucent(mat, opacity):
    """Blend a material toward clear, keeping its own shading and grain."""
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    output = next(n for n in nodes if n.type == "OUTPUT_MATERIAL")
    source = output.inputs["Surface"].links[0].from_socket
    clear = nodes.new("ShaderNodeBsdfTransparent")
    mix = nodes.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = opacity
    links.new(clear.outputs["BSDF"], mix.inputs[1])
    links.new(source, mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    return mat


# X-ray focus sets: which layers are wood, and how opaque that wood is. The
# shell is translucent even when it's the focus, or it would hide the system.
XRAY = {
    # The maple is slightly translucent so the walnut at the centre shows.
    "core": ({"diamond": 0.6, "triangle": 1.0}),
    "middle": ({"box": 1.0}),
    "shell": ({"sphere": 0.6}),
}


def render_xray(name):
    """The closed system with the focused layer in wood and every other
    layer as a glass ghost and/or a fine outline, so the focus reads
    without a cutaway."""
    clear_scene()
    configure_render()
    scene = bpy.context.scene
    scene.cycles.transparent_max_bounces = 24
    scene.cycles.samples = min(SAMPLES, 256)
    mats = materials()
    glass, edges = glass_material(), edge_material()
    target = (0, 0, -0.25)
    eye = camera_position(*EXPLODED_VIEW, 5.9, target)
    for kind in SHAPES:
        opacity = XRAY[name].get(kind)
        if opacity is not None:
            mat = mats[kind] if opacity >= 1 else translucent(mats[kind], opacity)
            finish(make_form(kind, mat, kind.title() + " | lit"), BEVEL[kind])
            continue
        # Ghosts cast no shadow, so the contact shadow belongs to the lit layer.
        soft = GHOST == "soft" and kind == "sphere"
        if GHOST in ("glass", "both") or soft:
            body = make_form(kind, soft_glass_material() if soft else glass, kind.title() + " | glass")
            finish(body, BEVEL[kind])
            body.visible_shadow = False
        if GHOST in ("outline", "both", "soft"):
            outline(kind, edges, eye).visible_shadow = False
    add_studio(eye, target, -2.0)
    render("nested-xray-" + name + os.environ.get("NESTED_TAG", ""), SIZE)


def render_exploded():
    clear_scene()
    configure_render()
    mats = materials()
    for kind in SHAPES:
        cutaway_body(kind, CHILD[kind], mats[kind])
    target = (0, 0, 0)
    add_studio(camera_position(*EXPLODED_VIEW, 6.6, target), target, -2.0)
    render("nested-exploded", SIZE)
    if os.environ.get("NESTED_SAVE") == "1":
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "nested_forms_study.blend"))


# Brand shells: (name, colour, roughness). Porcelain white, pale ash wood and
# graphite read as three distinct products without leaning on any hue.
BRANDS = (
    ("porcelain", (0.78, 0.76, 0.72), 0.5),
    ("ash", None, None),
    ("graphite", (0.045, 0.045, 0.048), 0.55),
)


def brand_system(mats, shell, offset):
    """One complete cutaway system (shared core inside a brand shell) at offset."""
    name, color, roughness = shell
    shell_mat = mats["sphere"] if color is None else shell_material(name, color, roughness)
    pieces = [cutaway_body("sphere", "box", shell_mat)]
    pieces += [cutaway_body(kind, CHILD[kind], mats[kind]) for kind in ("box", "diamond", "triangle")]
    for piece in pieces:
        piece.location += offset


def render_brands():
    """One platform, many brands: the same core in three different shells,
    in a shallow diagonal row so every cutaway faces the camera."""
    clear_scene()
    configure_render()
    mats = materials()
    positions = (Vector((-4.5, 1.2, 0)), Vector((0, 0, 0)), Vector((4.5, -1.2, 0)))
    for shell, offset in zip(BRANDS, positions):
        brand_system(mats, shell, offset)
    target = (0, 0, 0.35)
    add_studio(camera_position(-22, 17, 16.5, target), target, -2.0)
    render("nested-brands", SIZE, aspect=16 / 9)


def render_brands_compact():
    """The brands trio clustered into a square for narrow slots: ash in
    front, porcelain and graphite behind, all cutaways still visible."""
    clear_scene()
    configure_render()
    mats = materials()
    ash, porcelain, graphite = BRANDS[1], BRANDS[0], BRANDS[2]
    layout = ((porcelain, Vector((-2.4, 2.6, 0))), (graphite, Vector((2.5, 2.2, 0))), (ash, Vector((0, -1.9, 0))))
    for shell, offset in layout:
        brand_system(mats, shell, offset)
    target = (0, 0.4, 0.2)
    add_studio(camera_position(-20, 20, 10.5, target), target, -2.0)
    render("nested-brands-compact", SIZE)


def render_layers():
    """The architecture pulled apart along one axis, left to right: the
    shared core (walnut core lifted from its maple seat), the configuration
    layer (oak box) and the brand shell (ash sphere). Each keeps its carved
    seat so the fit between layers stays visible."""
    clear_scene()
    configure_render()
    mats = materials()
    core = [cutaway_body("diamond", "triangle", mats["diamond"]), cutaway_body("triangle", None, mats["triangle"])]
    # Lift the walnut core just clear of its seat so it reads as a piece,
    # not a dark hole in the maple.
    core[1].location.z += 1.0
    layers = ((core, Vector((-5.3, 0, 0))),
              ([cutaway_body("box", "diamond", mats["box"])], Vector((-1.2, 0, 0))),
              ([cutaway_body("sphere", "box", mats["sphere"])], Vector((3.8, 0, 0))))
    for pieces, offset in layers:
        for piece in pieces:
            piece.location += offset
    target = (-0.7, 0, 0.25)
    add_studio(camera_position(-18, 18, 13.8, target), target, -2.0)
    render("nested-layers", SIZE, aspect=16 / 9)


def main():
    os.makedirs(OUT, exist_ok=True)
    for job in JOBS:
        if job == "assembled":
            render_assembled()
        elif job == "exploded":
            render_exploded()
        elif job == "brands":
            render_brands()
        elif job == "brands-compact":
            render_brands_compact()
        elif job == "layers":
            render_layers()
        elif job.startswith("xray-"):
            render_xray(job[len("xray-"):])
        elif job in SHAPES:
            render_single(job)
    print("Nested-form renders written to", OUT)


main()
