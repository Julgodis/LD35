class Level1 extends Scene implements StoryScene {
    world: World
    fps_text: TextTexture
    chat_commands: ChatCommand[];

    constructor(engine: Engine) {
        super(engine, "level1");

        this.world = new World(this.engine);
        this.create_world();
    }

    create_world() {
        var x = 0;
        var y = 0;
        var z = 0;

        var map: number[][][] = [];
        var dimensions: DimensionPlane[] = [];

        function add_to_world_map(x, y, z, id) {
            if (map[z] == null)
                map[z] = [];

            var m1 = map[z];
            if (m1[y] == null)
                m1[y] = [];

            var m2 = m1[y];
            m2[x] = Math.abs(id | 0);
        }

        for (var i = -1; i < 1; i++) {
            var map_batch = new ModelBatch(engine, (6 * 6) * 256);
            map_batch.texture = tilemap_texture;
            dimensions[-i] = ({
                index: i,
                background_color: (new vec3([135.0 - i * 100, 206.0 - i * 30, 250.0])).div(255.0),
                batch: map_batch,
                background_textures: []
            });
        }

        for (var i = -1; i < 1; i++) {
            z = i;
            x = 0;
            y = 0;
            for (var il = 0; il < 127; il++) {
                add_to_world_map(x, y, -i, -i * 2);
                add_to_world_map(x, y + 1, -i, -i * 2 + 1);
                x += 1;
            }


            //map_batch.end();
        }

        x = 3;
        add_to_world_map(x, -1, 0, TileData.SLOPE_0r1);
        add_to_world_map(x - 1, -1, 0, TileData.CHEST_01);
        add_to_world_map(x + 1, -1, 0, TileData.STONE_01);
        add_to_world_map(x + 2, -1, 0, TileData.STONE_01);
        add_to_world_map(x + 3, -1, 0, TileData.STONE_01);
        add_to_world_map(x + 4, -1, 0, TileData.SLOPE_0r3);

        add_to_world_map(x, -1, 1, TileData.SLOPE_1r1);
        add_to_world_map(x + 1, -1, 1, TileData.SLOPE_1r3);

        function update_batches(dimension: DimensionPlane) {
            dimension.batch.begin();
            var dimension_map = map[-dimension.index];

            function has(x: number, y: number, z: number) {
                var d = map[z];
                if (d == null) return false;
                if (d[y] == null) return false;
                if (d[y][x] == null) return false;
                return true;
            }

            var dimension_map = map[-dimension.index];
            for (var y in dimension_map) {
                for (var x in dimension_map[y]) {
                    var position = new vec3([parseFloat(x) + 1 / 2, parseFloat(y), dimension.index]);
                    var tile_type = dimension_map[y][x];
                    var tile = TileData.get(tile_type);

                    var has_array = [
                        !has(x, y, -dimension.index + 1) || dimension.index == 0,
                        !has(x - 1, y, -dimension.index) || true,
                        !has(x, y, -dimension.index - 1),
                        !has(x + 1, y, -dimension.index),
                        !has(x, y + 1, -dimension.index),
                        !has(x, y - 1, -dimension.index),
                    ];

                    tile.add_model(dimension.batch, position, has_array);
                }
            }

            dimension.batch.end();
        }

        for (var di in dimensions) {
            update_batches(dimensions[di]);
        }

        var player = new Player(player_texture, this);
        player.position = new vec3([0.5, -2, 0.01]);
        player.add_shape(-1, player_texture_2);

        this.world.player = player;
        this.world.add_object(player);

        for (var k = 0; k < 30; k++) {
            var enemy = new Knight1(enemy_texture);
            enemy.position = new vec3([5 + Math.random() * 50, -3, Math.random() < 0.5 ? -1.0 : 0.0]);
            this.world.add_object(enemy);
        }

        var p = new Pushable(itemmap_texture);
        p.size = new vec3([0.5, 0.8, 0.5]);
        p.position = new vec3([5, -3, 0.0]);

        this.world.add_object(p);

        this.world.dimensions = dimensions;
        this.world.map = map;

        this.world.current_background_color = this.world.dimensions[0].background_color.copy();

        this.fps_text = new TextTexture(engine, "FPS: 000", -engine.width / 2 + 5, -engine.height / 2, 0.0, 100, 30, { center: false, font: "24px 'pixel_font'" });
        this.chat_commands = [];
    }

    add_chat_command(chat: ChatBubble, follow: GameObject, complete: (command: ChatCommand) => void = null) {
        chat.scale = 0;
        this.chat_commands.push({
            chat: chat,
            follow: follow,
            complete: complete
        });

        (new Tween(chat)).to({ scale: 1 }, 100.0).start(engine.time);
    }

    remove_chat_command(enter: boolean, space: boolean, x: boolean) {
        if (this.chat_commands.length <= 0) return;

        var command = this.chat_commands[0];
        if (space && !command.chat.skip_by_space) return;
        if (x && !command.chat.skip_by_x) return;

        (new Tween(command.chat)).to({ scale: 0 }, 100.0).ease(Easing.quadratic_out).start(engine.time).complete(this, function (obj) {
            var command = this.chat_commands[0];
            this.chat_commands.splice(0, 1);

            if (command != null) {
                command.chat.free();
                if (command.complete != null)
                    command.complete(this)
            }
        });
    }

    button_x() {
        this.remove_chat_command(false, false, true);
    }

    button_space() {
        this.remove_chat_command(false, true, false);
    }

    update(time: number, dt: number) {
        if (engine.keyboard.press(13) && this.chat_commands.length > 0) {
            this.remove_chat_command(true, false, false);
        }

        this.world.update(dt);
    }

    render(time: number, dt: number) {
        render.call(this, time, dt, this.world);
    }
}

function render_background(time: number, world: World) {
    var current_dimension = world.dimensions[this.world.player.dimension];
    if (current_dimension == null) return;

    var world_rotation_change = (world.current_view_angle / 90.0);

    billboard_batch.use_shader(billboard_3d_shader);
    billboard_3d_shader.setMatrix4("projection", projection_matrix);
    billboard_3d_shader.setMatrix4("view", view_matrix);
    billboard_3d_shader.setFloat("time", time);
    billboard_3d_shader.setFloat("deform", 0);
    billboard_3d_shader.setInteger("sampler0", 0);
    billboard_batch.begin();

    for (var b in current_dimension.background_textures) {
        var tex = current_dimension.background_textures[b];

        var position = new vec3([0, 0, 0]);
        position.add(new vec3([-world.player.position.x, 0, 0]));
        position.mul(1 - tex.parallex);
        position.add(tex.position);

        billboard_batch.draw_spritesheet(
            tex.animation.spritesheet,
            position,
            (new vec3([tex.animation.width_per_frame, tex.animation.height_per_frame, 1])).mul((1.0/16.0) * tex.scale),
            tex.animation.coords,
            true,
            new vec4([1, 1, 1, 1 - world_rotation_change]));
    }

    billboard_batch.end();
}

function render_objects(time: number, deformation: number, world: World, fixed_view_matrix: mat4) {
    var current_dimension = world.dimensions[this.world.player.dimension];
    var world_rotation_change = (world.current_view_angle / 90.0);

    billboard_batch.use_shader(billboard_3d_shader);
    billboard_3d_shader.setMatrix4("projection", projection_matrix);
    billboard_3d_shader.setMatrix4("view", view_matrix);
    billboard_3d_shader.setFloat("time", time);
    billboard_3d_shader.setFloat("deform", deformation);
    billboard_3d_shader.setInteger("sampler0", 0);
    billboard_batch.begin();

    var temp: GameObject[] = world.gameobjects.slice();
    world.push_particles(temp);


    // NOTE: Sort by z
    var keys = Object.keys(temp);
    var values = keys.map((key) => { return temp[key]; });
    var sorted = <GameObject[]>values.sort((a: GameObject, b: GameObject) => {
        var vA = a.position.z * (1 - world_rotation_change);
        var vB = b.position.z * (1 - world_rotation_change);

        vA += -a.position.x * (world_rotation_change);
        vB += -b.position.x * (world_rotation_change);

        return (((vA) - (vB)) * 10000) | 0;
    }).filter((value) => {
        var ok = (value.position.copy().sub(world.player.position).length2()) < 10 * 10;
        if (!ok) return false;

        return value.dimension == -current_dimension.index || world.next_view_angle == 90;
    });

    for (var i in sorted) {
        var obj = sorted[i];
        var draw_position = obj.position.copy();
        //draw_position.add(new vec3([-obj.sort_bias * 0.1 * world_rotation_change, 0, obj.sort_bias * (1 - world_rotation_change)]));

        if (obj instanceof Player) {
            var pobj = <Player>obj;
            if (pobj.animation_state == PlayerAnimationState.Attack) {
                var ani = pobj.animation.animations[pobj.animation.current_animation];
                if (ani.current_frame == 2) {
                    var weapon = pobj.weapon;
                    var weapon_position = draw_position.copy();
                    weapon_position.add((new vec3([weapon.offset.x, 0, weapon.offset.x]))
                        .mul(world.view_normal)
                        .mul(1 / 16)
                        .mul(pobj.direction ? -1 : 1)
                    );
                    weapon_position.add((new vec3([0, weapon.offset.y, 0])).mul(1 / 16));
                    billboard_batch.draw_spritesheet_rotation(
                        weapon.animation.spritesheet,
                        weapon_position,
                        weapon.scale,
                        weapon.animation.coords,
                        !pobj.direction,
                        weapon.rotation,
                        pobj.color);
                }
            }

            var animator = pobj.current_animator();
            billboard_batch.draw_spritesheet_rotation(
                animator.spritesheet,
                draw_position,
                new vec3([pobj.scale, pobj.scale, pobj.scale]),
                animator.coords,
                pobj.direction,
                pobj.rotation,
                pobj.color);
        } else if (obj instanceof Knight1) {
            var k1obj = <Knight1>obj;
            if (k1obj.animation_state == Knight1AnimationState.Attack) {
                var ani = k1obj.animation.animations[k1obj.animation.current_animation];
                if (ani.current_frame == 2) {
                    var weapon = k1obj.weapon;
                    var weapon_position = draw_position.copy();
                    weapon_position.add((new vec3([weapon.offset.x, 0, weapon.offset.x]))
                        .mul(world.view_normal)
                        .mul(1 / 16)
                        .mul(k1obj.direction ? -1 : 1)
                    );
                    weapon_position.add((new vec3([0, weapon.offset.y, 0])).mul(1 / 16));
                    billboard_batch.draw_spritesheet_rotation(
                        weapon.animation.spritesheet,
                        weapon_position,
                        weapon.scale,
                        weapon.animation.coords,
                        !k1obj.direction,
                        weapon.rotation,
                        k1obj.color);
                }
            }

            billboard_batch.draw_spritesheet_rotation(
                k1obj.animation.spritesheet,
                draw_position,
                new vec3([k1obj.scale, k1obj.scale, k1obj.scale]),
                k1obj.animation.coords,
                k1obj.direction,
                k1obj.rotation,
                k1obj.color);

        }else if (obj instanceof Boss) {
            var bobj = <Boss>obj;
            if (bobj.stage == BossStage.Sword) {
                billboard_batch.draw_spritesheet_rotation(
                    bobj.animation.spritesheet,
                    draw_position,
                    new vec3([bobj.scale, bobj.scale, bobj.scale]),
                    bobj.animation.coords,
                    bobj.direction,
                    bobj.rotation,
                    bobj.color);

                if (bobj.animation_state == BossAnimationState.Sword) {
                    var ani = bobj.animation.animations[bobj.animation.current_animation];
                    if (ani.current_frame == 2) {
                        var weapon = bobj.sword;
                        var weapon_position = draw_position.copy();
                        weapon_position.add((new vec3([weapon.offset.x, 0, weapon.offset.x]))
                            .mul(world.view_normal)
                            .mul(1 / 16)
                            .mul(bobj.direction ? -1 : 1)
                        );
                        weapon_position.add((new vec3([0, weapon.offset.y, 0])).mul(1 / 16));
                        billboard_batch.draw_spritesheet_rotation(
                            weapon.animation.spritesheet,
                            weapon_position,
                            weapon.scale,
                            weapon.animation.coords,
                            !bobj.direction,
                            weapon.rotation,
                            bobj.color);
                    }
                }
            } else {
                billboard_batch.draw_spritesheet_rotation(
                    bobj.animation.spritesheet,
                    draw_position.copy().add(new vec3([0, 1.0, 0])),
                    new vec3([bobj.scale * 3, bobj.scale * 2, bobj.scale]),
                    bobj.animation.coords,
                    bobj.direction,
                    bobj.rotation,
                    bobj.color);
            }
        } else if (obj instanceof AnimatedObject) {
            var aniobj = <AnimatedObject>obj;
            billboard_batch.draw_spritesheet_rotation(
                aniobj.texture,
                draw_position,
                new vec3([aniobj.scale, aniobj.scale, aniobj.scale]),
                aniobj.animation.coords,
                aniobj.direction,
                aniobj.rotation,
                aniobj.color);
        } else if (obj instanceof ItemObject) {
            var itemobj = <ItemObject>obj;
            billboard_batch.draw_spritesheet_rotation(
                itemobj.texture,
                draw_position,
                new vec3([itemobj.scale, itemobj.scale, itemobj.scale]),
                itemobj.animation.coords,
                itemobj.direction,
                itemobj.rotation,
                itemobj.color);
        } else if (obj instanceof ParticleObject) {
            var ppobj = <ParticleObject>obj;
            billboard_batch.draw_spritesheet_rotation(
                ppobj.texture,
                draw_position,
                ppobj.size.copy().mul(ppobj.scale),
                new vec4([0, 0, 1, 1]),
                ppobj.direction,
                ppobj.rotation,
                ppobj.color);
        } else {
            billboard_batch.draw_spritesheet_rotation(
                obj.texture,
                draw_position,
                obj.size.copy().mul(obj.scale),
                new vec4([0, 0, 1, 1]),
                obj.direction,
                obj.rotation,
                obj.color);
        }
    }

    for (var bullet_index in this.world.bullets) {
        var bullet = this.world.bullets[bullet_index];
        billboard_batch.draw_image(bullet.texture, bullet.position, bullet.texture.size.copy().mul(1 / 16.0), true);
    }

    for (var chat_index in this.chat_commands) {
        var command = this.chat_commands[chat_index];
        var chat = command.chat;
        var follow = command.follow;

        if (this.world.player.dimension != follow.dimension && this.world.next_view_angle != 90)
            continue;

        var position = new vec3([0.0, follow.position.y - chat.size.y * (1.0 / 100.0) * 0.5 + Math.sin(time) * 0.1 - 0.1, 0.0]);
        position.add((new vec3([0.7, 0.0, 0.7])).mul(world.view_normal).mul(follow.direction ? -1 : 1));
        position.add((new vec3([0, 0.0, follow.position.z])).mul(world.view_normal));
        position.add(new vec3([follow.position.x, 0.0, 0]));
        position.add(chat.position.copy().mul(world.view_normal));

        billboard_batch.draw_chat_bubble(chat, position, chat.size.copy().mul(1.0 / 100.0), !follow.direction);
        break; // NOTE: Only render 1
    }

    if (world.player.found_item != null) {
        billboard_batch.draw_spritesheet_rotation(
            world.player.found_item.animation.spritesheet,
            world.player.found_item_position,
            new vec3([1, 1, 1]),
            world.player.found_item.animation.coords,
            true,
            world.player.found_item_rotation,
            new vec4([1, 1, 1, 1])
        );
    }

    billboard_batch.end();

    if (world.player.inventory.length > 0 || world.player.time_shifter != null) {
        billboard_batch.begin();
        billboard_3d_shader.setMatrix4("view", fixed_view_matrix);

        var inv_size = inventory_base_texture.size.copy().mul(1.0 / 32.0);
        var inv_position = new vec3([
            (engine.width / 200),
            0,
            (engine.width / 200)]);
        inv_position.mul(world.view_normal);
        inv_position.y += inv_size.y * 0.5 + 4 / 100;
        billboard_batch.draw_image(inventory_base_texture, inv_position, inv_size, true);

        for (var item_i in world.player.inventory) {
            var item = world.player.inventory[item_i];

            var item_position = new vec3([
                (engine.width / 200) - (18 * 2) / 32 + (18 / 32) * item_i,
                0,
                (engine.width / 200) - (18 * 2) / 32 + (18 / 32) * item_i
            ]);
            item_position.mul(world.view_normal);
            item_position.y += inv_size.y * 0.5 + 4 / 100;

            billboard_batch.draw_spritesheet(
                item.animation.spritesheet,
                item_position,
                new vec3([0.5, 0.5, 0.5]),
                item.animation.coords,
                true,
                new vec4([1, 1, 1, 1])
            );
        }

        var sel_size = inventory_select_texture.size.copy().mul(1.0 / 32.0);
        var sel_position = new vec3([
            (engine.width / 200) - (18 * 2) / 32 + (18 / 32) * world.player.current_item,
            0,
            (engine.width / 200) - (18 * 2) / 32 + (18 / 32) * world.player.current_item]);
        sel_position.mul(world.view_normal);
        sel_position.y += inv_size.y * 0.5 + 4 / 100;
        billboard_batch.draw_image(inventory_select_texture, sel_position, sel_size, true);

        if (world.player.time_shifter != null) {
            var item_position = new vec3([
                (engine.width / 200) - (18 * 3 + 4) / 32,
                0,
                (engine.width / 200) - (18 * 3 + 4) / 32
            ]);
            item_position.mul(world.view_normal);
            item_position.y += inv_size.y * 0.5 + 4 / 100;

            billboard_batch.draw_spritesheet(
                world.player.time_shifter.animation.spritesheet,
                item_position,
                new vec3([0.5, 0.5, 0.5]),
                world.player.time_shifter.animation.coords,
                true,
                new vec4([1, 1, 1, 1])
            );
        }

        billboard_batch.end();
    }


}

function render_world(time: number, deformation: number, world: World) {
    var current_dimension = world.dimensions[this.world.player.dimension];
    if (current_dimension && world.next_view_angle == 0) {
        var batch = current_dimension.batch;
        batch.use_shader(basic_3d_shader);
        basic_3d_shader.setMatrix4("projection", projection_matrix);
        basic_3d_shader.setMatrix4("view", view_matrix);
        basic_3d_shader.setFloat("time", time);
        basic_3d_shader.setFloat("deform", deformation);
        basic_3d_shader.setInteger("sampler0", 0);
        basic_3d_shader.setVec4("color", new vec4([1, 1, 1, 1]));
        tilemap_texture.bind(0);
        batch.render();
    } else {
        for (var dim_index in world.dimensions) {
            var dim = world.dimensions[dim_index];
            var batch = dim.batch;
            batch.use_shader(basic_3d_shader);
            basic_3d_shader.setMatrix4("projection", projection_matrix);
            basic_3d_shader.setMatrix4("view", view_matrix);
            basic_3d_shader.setInteger("sampler0", 0);
            basic_3d_shader.setFloat("time", time);
            basic_3d_shader.setFloat("deform", deformation);
            basic_3d_shader.setVec4("color", new vec4([1, 1, 1, 1]));
            tilemap_texture.bind(0);
            batch.render();
        }
    }
}

function render(time: number, dt: number, world: World) {
    function degToRad(d) {
        return d * Math.PI / 180;
    }

    var world_rotation_change = (world.current_view_angle / 90.0);
    var camera_x1 = engine.width * 0.5 + screen_x_offset * (1 - world_rotation_change);
    var camera_x2 = - this.world.player.position.x * (1 - world_rotation_change) * 100
        - this.world.player.position.z * (world_rotation_change) * 100;
    var camera_x = camera_x1 + camera_x2;
    var camera_z = (this.world.player.position.x) * 100;
    camera_z -= (camera_z % 100) - 0.1;
    camera_z *= world_rotation_change;
    camera_z -= (1 - world_rotation_change) * 100;
    camera_z -= 1000;

    var camera_y = engine.height - 60 - this.world.player.position.y * 100.0 - 100;
    camera_y = Math.max(engine.height - 60, camera_y);

    projection_matrix = mat4.make2DProjection(engine.width, engine.height, 0.0, 2000.0);
    var translationMatrix2 = mat4.makeTranslate(camera_x, camera_y, camera_z);
    var translationMatrix1 = mat4.makeTranslate(camera_x1, camera_y, camera_z);
    var translationMatrix3 = mat4.makeTranslate(camera_x, camera_y, camera_z - 100);
    var translationMatrix4 = mat4.makeTranslate(0, 0, -100);
    var rotationXMatrix = mat4.makeRotationX(degToRad(0));
    var rotationYMatrix = mat4.makeRotationY(degToRad(world.current_view_angle + 0 * engine.time / 1000.0));
    var rotationZMatrix = mat4.makeRotationZ(degToRad(0));
    var scaleMatrix = mat4.makeScale(100, 100, 100);
    view_matrix = mat4.makeIdentity();
    view_matrix.multiply(scaleMatrix);
    view_matrix.multiply(rotationZMatrix);
    view_matrix.multiply(rotationYMatrix);
    view_matrix.multiply(rotationXMatrix);

    var temp_view_matrix = view_matrix.copy();
    view_matrix.multiply(translationMatrix1);

    var gl = engine.webgl;
    gl.clearColor(world.current_background_color.x, world.current_background_color.y, world.current_background_color.z, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var time = engine.time / 1000.0;
    var deformation = 0;
    //if (world.next_view_angle != 0)
    {
        //deformation = 10 * ((world.next_view_angle - world.current_view_angle) / 90.0);
        //deformation += 1 - ((world.next_view_angle - world.current_view_angle) / 90.0);
        var x = 1.5 * world_rotation_change;
        deformation = x;//(1 - x * x) * 2;
    }
    gl.disable(gl.DEPTH_TEST);
    if (world.next_view_angle != 90)
        render_background.call(this, time, world);
    gl.enable(gl.DEPTH_TEST);

    view_matrix = temp_view_matrix;
    view_matrix.multiply(translationMatrix2);


    render_world.call(this, time, deformation, this.world);
    gl.disable(gl.DEPTH_TEST);

    view_matrix = mat4.makeIdentity();
    view_matrix.multiply(scaleMatrix);
    view_matrix.multiply(rotationZMatrix);
    view_matrix.multiply(rotationYMatrix);
    view_matrix.multiply(rotationXMatrix);

    var fixed_view_matrix = view_matrix.copy();
    view_matrix.multiply(translationMatrix3);

    fixed_view_matrix.multiply(translationMatrix4);

    render_objects.call(this, time, deformation, this.world, fixed_view_matrix);

    var fps = engine.fps;//(1000.0 / engine.dt_render);
    fps *= 1.0;
    this.fps_text.data = "FPS: " + (fps | 0).toString();
    batch_count = 0;

    batch2d.use_shader(engine.basic_2d_shader);
    engine.basic_2d_shader.setFloat2("origin", 0, 0);
    engine.basic_2d_shader.setFloat2("resolution", engine.width, engine.height);

    batch2d.begin();
    batch2d.draw_text(this.fps_text);


    batch2d.end();
    gl.enable(gl.DEPTH_TEST);
}