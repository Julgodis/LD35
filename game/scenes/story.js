var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StoryState;
(function (StoryState) {
    StoryState[StoryState["Intro"] = 0] = "Intro";
    StoryState[StoryState["PastSon"] = 1] = "PastSon";
})(StoryState || (StoryState = {}));
var Story = (function (_super) {
    __extends(Story, _super);
    function Story(engine) {
        _super.call(this, engine, "story");
        this.state = StoryState.Intro;
        this.world = new World(this.engine);
        this.create_world();
    }
    Story.prototype.create_world = function () {
        var map = [];
        var dimensions = [];
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
            var map_batch = new ModelBatch(engine, (6 * 6) * 512);
            map_batch.texture = tilemap_texture;
            dimensions[-i] = ({
                index: i,
                background_color: (new vec3([135.0 - i * 50, 206.0 - i * 10, 250.0])).div(255.0),
                batch: map_batch,
                background_textures: []
            });
        }
        var mapCtx = document.createElement("canvas").getContext("2d");
        mapCtx.canvas.width = map_texture.size.x;
        mapCtx.canvas.height = map_texture.size.y;
        mapCtx.imageSmoothingEnabled = false;
        mapCtx.clearRect(0, 0, map_texture.size.x, map_texture.size.y);
        mapCtx.drawImage(map_texture.image, 0, 0, map_texture.size.x, map_texture.size.y, 0, 0, map_texture.size.x, map_texture.size.y);
        var image = mapCtx.getImageData(0, 0, map_texture.size.x, map_texture.size.y);
        var data = image.data;
        for (var i = -1; i < 1; i++) {
            for (var y = 0; y < map_texture.size.y / 2; y++) {
                for (var x = 0; x < map_texture.size.x; x++) {
                    var my = (map_texture.size.y / 2) + i * (map_texture.size.y / 2) + y;
                    var mx = x;
                    var py = y - 5;
                    var px = x - 10;
                    var f = (mx + my * map_texture.size.x) * 4;
                    var r = data[f + 0];
                    var g = data[f + 1];
                    var b = data[f + 2];
                    var a = data[f + 3];
                    if (a > 128) {
                        var tile_id = -1;
                        if (r == 128 && g == 128 && b == 128)
                            tile_id = TileData.STONE_01;
                        else if (r == 64 && g == 64 && b == 64)
                            tile_id = TileData.WALL_01;
                        else if (r == 0 && g == 255 && b == 0)
                            tile_id = TileData.DIM01_GROUND_GRASS;
                        else if (r == 0 && g == 128 && b == 0)
                            tile_id = TileData.DIM01_GROUND;
                        else if (r == 255 && g == 128 && b == 0)
                            tile_id = TileData.DIM02_GROUND_GRASS;
                        else if (r == 128 && g == 64 && b == 0)
                            tile_id = TileData.DIM02_GROUND;
                        else if (r == 128 && g == 128 && b == 0)
                            tile_id = TileData.SLOPE_0r1;
                        else if (r == 128 && g == 128 && b == 1)
                            tile_id = TileData.SLOPE_0r3;
                        else if (r == 64 && g == 128 && b == 0)
                            tile_id = TileData.SLOPE_1r1;
                        else if (r == 64 && g == 128 && b == 1)
                            tile_id = TileData.SLOPE_1r3;
                        else if (r == 0 && g == 10 && b == 255)
                            tile_id = TileData.WATER_01;
                        else if (r == 0 && g == 0 && b == 255)
                            tile_id = TileData.WATER_02;
                        else if (r == 10 && g == 10 && b == 255)
                            tile_id = TileData.WATER_11;
                        else if (r == 10 && g == 0 && b == 255)
                            tile_id = TileData.WATER_12;
                        else if (r == 200 && g == 200 && b == 200) {
                            if (this.world.player != null)
                                throw new Error("2 players!!!");
                            var player = new Player(player_texture, this);
                            player.add_shape(-1, player_texture_2);
                            player.position = new vec3([0.5 + px, py, i + 0.01]);
                            this.world.player = player;
                            this.world.add_object(player);
                        }
                        else if (r == 128 && g == 0 && b == 10) {
                            var first_sword = new WeaponObject(itemmap_texture, new FirstSword(itemmap_texture));
                            first_sword.position = new vec3([0.5 + px, py, i]);
                            this.world.add_object(first_sword);
                        }
                        else if (r == 128 && g == 0 && b == 20) {
                            var first_sword = new WeaponObject(itemmap_texture, new LastSword(itemmap_texture));
                            first_sword.position = new vec3([0.5 + px, py, i]);
                            this.world.add_object(first_sword);
                        }
                        else if (r == 200 && g == 200 && b == 100) {
                            if (this.son != null)
                                throw new Error("2 players!!!");
                            this.son = new AnimatedObject(son_texture);
                            this.son.position = new vec3([0.5 + px, py, i]);
                            this.son.size = new vec3([10.0 / 16.0, 16.0 / 16.0, 10.0 / 16.0]);
                            this.son.direction = true;
                            this.son.color = new vec4([1, 1, 1, 0]);
                            var son_idle_animation = this.son.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, Animation.FrameTime * 15.0), true);
                            son_idle_animation.random_frame_time = 0.5;
                            var son_dead_animation = this.son.animation.add_animation("dead", Animation.fsequence(16, 4), Animation.ft_repate(4, Animation.FrameTime * 5.0), false);
                            this.son.animation.play("idle");
                            this.world.add_object(this.son);
                        }
                        else if (r == 255 && g == 0 && b == 0) {
                            var enemy = new Knight1(enemy_texture[0], new Knight1Sword(itemmap_texture));
                            enemy.position = new vec3([0.5 + px, py, i + 0.01]);
                            this.world.add_object(enemy);
                        }
                        else if (r == 255 && g == 0 && b == 64) {
                            var enemy = new Knight1(enemy_texture[1], new Knight2Sword(itemmap_texture));
                            enemy.position = new vec3([0.5 + px, py, i + 0.01]);
                            this.world.add_object(enemy);
                        }
                        else if (r == 128 && g == 0 && b == 110) {
                            var renemy = new Robot(enemy_texture[2], new RobotLaser(itemmap_texture));
                            renemy.position = new vec3([0.5 + px, py, i + 0.01]);
                            this.world.add_object(renemy);
                        }
                        else if (r == 0 && g == 0 && b == 0) {
                            var benemy = new Boss(big_boss_texture, this);
                            benemy.position = new vec3([0.5 + px, py - 4, i + 0.01]);
                            this.world.add_object(benemy);
                        }
                        else if (r == 128 && g == 80 && b == 0) {
                            var block = new PushBlock(push_block_texture, this);
                            block.position = new vec3([0.5 + px, py, i + -0.9]);
                            this.world.add_object(block);
                        }
                        if (tile_id >= 0) {
                            add_to_world_map(px, py, -i, tile_id);
                        }
                    }
                }
            }
        }
        // DIM 0
        for (var i = 0; i < 150; i++) {
            var z = Math.random() * 0.5;
            var bg_tex = {
                animation: new AnimationManager(tree_texture_1, 16, 32),
                position: new vec3([i * 2.0 + Math.random() * 2 - 1.0 - 10, -1.4 + z * 0.8, 0.0]),
                parallex: 0.0,
                scale: 1.0 - z
            };
            var animation = bg_tex.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, 500.0), true);
            animation.random_frame_time = 400.0;
            bg_tex.animation.play("idle");
            dimensions[0].background_textures.push(bg_tex);
        }
        {
            for (var i = 0; i < 25; i++) {
                var bg_tex = {
                    animation: new AnimationManager(bush_texture_1, 128, 48),
                    position: new vec3([i * 8, 0.0, 0.0]),
                    parallex: 0.0,
                    scale: 1.0
                };
                var animation = bg_tex.animation.add_animation("idle", Animation.fsequence(0, 1), Animation.ft_repate(4, 300.0), true);
                animation.random_frame_time = 100.0;
                bg_tex.animation.play("idle");
                dimensions[0].background_textures.push(bg_tex);
            }
        }
        // DIM 1
        for (var i = 0; i < 150; i++) {
            var z = Math.random() * 0.5;
            var bg_tex = {
                animation: new AnimationManager(tree_texture_2, 16, 32),
                position: new vec3([i * 2.0 + Math.random() * 2 - 1.0 - 10, -1.4 + z * 0.8, 0.0]),
                parallex: 0.0,
                scale: 1.0 - z
            };
            var animation = bg_tex.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, 500.0), true);
            animation.random_frame_time = 400.0;
            bg_tex.animation.play("idle");
            dimensions[1].background_textures.push(bg_tex);
        }
        {
            for (var i = 0; i < 25; i++) {
                var bg_tex = {
                    animation: new AnimationManager(sandhill_texture_1, 128, 48),
                    position: new vec3([i * 8, 0.0, 0.0]),
                    parallex: 0.0,
                    scale: 1.0
                };
                var animation = bg_tex.animation.add_animation("idle", Animation.fsequence(0, 1), Animation.ft_repate(4, 300.0), true);
                animation.random_frame_time = 100.0;
                bg_tex.animation.play("idle");
                dimensions[1].background_textures.push(bg_tex);
            }
        }
        function update_batches(dimension) {
            dimension.batch.begin();
            var dimension_map = map[-dimension.index];
            function has(x, y, z) {
                var d = map[z];
                if (d == null)
                    return false;
                if (d[y] == null)
                    return false;
                if (d[y][x] == null)
                    return false;
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
        this.world.dimensions = dimensions;
        this.world.map = map;
        this.world.current_background_color = this.world.dimensions[0].background_color.copy();
        //
        this.chat_commands = [];
        this.fps_text = new TextTexture(engine, "FPS: 000", -engine.width / 2 + 5, -engine.height / 2, 0.0, 300, 30, { center: false, font: "24px 'pixel_font'" });
        (new Tween(this.son)).to({}, 1000.0).delay(500.0).ease(Easing.quadratic_inout).start(engine.time).on(function (value) {
            this.rotation = value * 4;
            this.color.r = 1.0;
            this.color.g = value * 0.5 + 0.5;
            this.color.b = value * 0.5 + 0.5;
            this.color.a = value;
        });
        //this.world.player.time_shifter = new TimeShifter(1, itemmap_texture);
        //this.world.player.add_item(new LastSword(itemmap_texture));
        (new Tween(this)).to({}, 100.0).delay(1500.0).start(engine.time).complete(this, function () {
            this.start_story_text();
        });
    };
    Story.prototype.kill_son = function () {
        this.son.rotation = 0;
        (new Tween(this.son)).to({ rotation: 1 / 4 }, 100.0).start(engine.time).complete(this, function () {
            this.son.animation.play("dead");
            this.son.rotation = 0;
            var chat = new ChatBubble(engine, new vec2([300, 0]));
            chat.text = "Nooooooooooo!";
            this.add_chat_command(chat, this.world.player, function (command) {
                var chat = new ChatBubble(engine, new vec2([300, 0]));
                chat.text = "Ok so where is this \"Bob\"?";
                this.add_chat_command(chat, this.world.player, function (command) {
                    var chat = new ChatBubble(engine, new vec2([650, 0]));
                    chat.text = "Controls:\n- Movement is done with the arrow keys.\n- <X> Is the your primary skill (attack / use)\n- <SPACE> Time shifter\n- <ENTER> Talking";
                    chat.position = new vec3([1.4, 0, 0]);
                    this.add_chat_command(chat, this.world.player, function (command) {
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        });
    };
    Story.prototype.start_story_text = function () {
        var chat = new ChatBubble(engine, new vec2([150, 0]));
        chat.text = "Hello!";
        this.add_chat_command(chat, this.son, function (command) {
            var chat1 = new ChatBubble(engine, new vec2([150, 0]));
            chat1.text = "WTF!?";
            this.add_chat_command(chat1, this.world.player, function (command) {
                var chat1 = new ChatBubble(engine, new vec2([300, 0]));
                chat1.text = "My name is Theodor and I am from the FUTURE!";
                this.add_chat_command(chat1, this.son, function (command) {
                    var chat1 = new ChatBubble(engine, new vec2([300, 0]));
                    chat1.text = "THE FUTURE!?\n\nHow?";
                    this.add_chat_command(chat1, this.world.player, function (command) {
                        var chat1 = new ChatBubble(engine, new vec2([400, 0]));
                        chat1.text = "No time to explain, but I need your help.\nI need you to help me destory Bob from accounting. He has built a bomb that could rip both time and space.";
                        this.add_chat_command(chat1, this.son, function (command) {
                            var chat1 = new ChatBubble(engine, new vec2([300, 0]));
                            chat1.text = "Time? Space?\nOk.... I am in.";
                            this.add_chat_command(chat1, this.world.player, function (command) {
                                var chat1 = new ChatBubble(engine, new vec2([300, 0]));
                                chat1.text = "Take this!\nThis item will let you travel through out time.";
                                var ts = new TimeShifterObject(itemmap_texture);
                                ts.position = this.son.position.copy();
                                ts.velocity = (this.world.player.position.copy().sub(this.son.position)).normalize().mul(10);
                                ts.velocity.add(new vec3([0, -7, 0]));
                                ts.velocity.mul(new vec3([1, 1, 0]));
                                this.world.add_object(ts);
                                this.add_chat_command(chat1, this.son, function (command) {
                                    var chat1 = new ChatBubble(engine, new vec2([300, 0]));
                                    chat1.text = "AHHHHHHHHHHHH!\nMy heart!";
                                    this.add_chat_command(chat1, this.son, function (command) { this.kill_son(); }.bind(this));
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    };
    Story.prototype.add_chat_command = function (chat, follow, complete) {
        if (complete === void 0) { complete = null; }
        chat.scale = 0;
        this.chat_commands.push({
            chat: chat,
            follow: follow,
            complete: complete
        });
        (new Tween(chat)).to({ scale: 1 }, 100.0).ease(Easing.quadratic_in).start(engine.time);
    };
    Story.prototype.remove_chat_command = function (enter, space, x) {
        if (this.chat_commands.length <= 0)
            return;
        var command = this.chat_commands[0];
        if (space && !command.chat.skip_by_space)
            return;
        if (x && !command.chat.skip_by_x)
            return;
        select_sound.play();
        command.chat.lifetime = engine.time + 10000000;
        (new Tween(command.chat)).to({ scale: 0 }, 100.0).ease(Easing.quadratic_out).start(engine.time).complete(this, function (obj) {
            var command = this.chat_commands[0];
            this.chat_commands.splice(0, 1);
            if (command != null) {
                command.chat.free();
                if (command.complete != null)
                    command.complete(this);
            }
        });
    };
    Story.prototype.button_x = function () {
        this.remove_chat_command(false, false, true);
    };
    Story.prototype.button_space = function () {
        this.remove_chat_command(false, true, false);
    };
    Story.prototype.chat_destory = function () {
        for (var c in this.chat_commands) {
            var command = this.chat_commands[c];
            command.chat.free();
        }
        this.chat_commands = [];
        this.fps_text.free();
    };
    Story.prototype.update = function (time, dt) {
        if (this.state == StoryState.Intro && this.world.player.dimension != 0) {
            this.state = StoryState.PastSon;
            (new Tween(this)).to({}, 3000.0).on(function (value) {
                screen_x_offset = -(engine.width / 4 + 50) * (1 - value);
            }).start(engine.time);
        }
        if (this.state == StoryState.Intro) {
            screen_x_offset = -(engine.width / 4 + 50);
            if (this.son.animation.current_animation != "dead")
                this.son.direction = (this.son.position.x - this.world.player.position.x) > 0;
        }
        for (var c in this.chat_commands) {
            var command = this.chat_commands[c];
            if (!command.chat.shown && command.chat.time_limit > 0) {
                command.chat.lifetime = engine.time + command.chat.time_limit;
            }
            if (!command.chat.shown)
                pickup_sound.play();
            command.chat.shown = true;
            if (engine.time > command.chat.lifetime && command.chat.time_limit > 0) {
                this.remove_chat_command(true, false, false);
            }
            break;
        }
        if (engine.keyboard.press(13) && this.chat_commands.length > 0) {
            this.remove_chat_command(true, false, false);
        }
        this.world.update(dt);
    };
    Story.prototype.render = function (time, dt) {
        render.call(this, time, dt, this.world);
    };
    return Story;
})(Scene);
//# sourceMappingURL=story.js.map