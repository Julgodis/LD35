enum PlayerAnimationState {
    Idle, // NOTE: Also used for running
    Jump,
    Dance,
    Attack,
    Dead,
    Found
}

class Shape {
    animation: AnimationManager;

}

class Player extends AnimatedObject implements AnimationComplete {
    speed: number;
    animation_state: PlayerAnimationState;

    inventory: Item[];
    current_item: number
    weapon: Weapon
    time_shifter: TimeShifter;
    found_item: Item;
    found_item_position: vec3;
    found_item_rotation: number;

    instruction1_item: boolean;
    instruction1_chat: ChatBubble;

    instruction2_item: boolean;
    instruction2_chat: ChatBubble;

    instruction3_item: boolean;
    instruction3_chat: ChatBubble;

    scene: StoryScene;
    shapes: Shape[]

    locked: boolean;
    jump_count: number;

    constructor(texture: Texture, scene: StoryScene) {
        super(texture);

        this.direction = false;
        this.speed = 11.0;
        this.size = new vec3([10.0 / 16.0, 16.0 / 16.0, 10.0 / 16.0]);
        this.sort_bias = 1.0;
        this.animation_state = PlayerAnimationState.Idle;
        this.current_item = 0;
        this.weapon = null;
        this.time_shifter = null;
        this.found_item = null;
        this.found_item_position = new vec3([0, 0, 0]);
        this.found_item_rotation = 0;
        this.inventory = [];

        this.instruction1_item = false;
        this.instruction1_chat = null;
        this.instruction2_item = false;
        this.instruction2_chat = null;
        this.scene = scene;

        this.shapes = [];
        this.shapes.push({ animation: this.animation });

        this.jump_count = 0;
        this.attackable = true;
        this.locked = false;
    }

    add_shape(dim: number, texture: Texture) {
        var anm = new AnimationManager(texture, 16, 16);
        this.initialize_animations_for(anm);

        this.shapes[dim] = { animation: anm };
    }

    initialize_animations() {
        this.initialize_animations_for(this.animation);
    }

    initialize_animations_for(anm: AnimationManager) {
        var idle_animation = anm.add_animation("idle",
            Animation.fsequence(0, 4),
            Animation.ft_repate(4, Animation.FrameTime * 15.0),
            true);
        idle_animation.random_frame_time = 0.5;

        var run_animation = anm.add_animation("run",
            Animation.fsequence(8, 6),
            Animation.ft_repate(6, Animation.FrameTime * 3.5),
            true);

        var dance_animation = anm.add_animation("dance",
            Animation.fsequence(24, 4),
            Animation.ft_repate(4, Animation.FrameTime * 3.5),
            true);
        dance_animation.repeat_max = 4;

        var attack_sword_animation = anm.add_animation("attack_sword",
            Animation.fsequence(32, 4),
            [Animation.FrameTime * 0.5, Animation.FrameTime * 0.25, Animation.FrameTime * 2, Animation.FrameTime * 0.25],
            false);

        var jump_animation = anm.add_animation("jump",
            Animation.fsequence(40, 4),
            [Animation.FrameTime * 0.5, Animation.FrameTime * 1, Animation.FrameTime * 8, Animation.FrameTime * 0.5],
            false);

        var found_animation = anm.add_animation("found",
            [ 40, 41, 42, 43 ],
            [0.05, 0.05, 1.8, 0.1],
            false);

        anm.play("idle");
    }

    animation_complete(name: string): void {
        this.animation_state = PlayerAnimationState.Idle;
    }

    died(): void {
        this.animation_state = PlayerAnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);

        this.scene.chat_destory();
        scene = new LoseScene(engine);
    }

    add_item(item: Item): boolean {
        if (this.inventory.length < 5) {
            pickup_sound.play();

            if (this.inventory.length == 0)
                this.instruction1_item = true;

            this.current_item = this.inventory.length;
            this.inventory.push(item);
            return true;
        }

        return false;
    }

    update(world: World, dt: number): void {
        var prev = this.dimension;
        super.update(world, dt);

        var engine = world.engine;
        var keyboard = engine.keyboard;
        if (prev != this.dimension) {
            world.player_change_dimension(engine.time, dt);
            shift_sound.play();
        }

        if (this.on_ground || (this.velocity.y > - 0.1 && this.velocity <= 0.05)) {
            this.jump_count = 0;
        }

        this.hp += 5 * dt;
        this.hp = Math.min(this.hp_max, this.hp);

        if (this.position.y > 4) {
            world.damage_player(100 * dt);
        }

        for (var s in this.shapes) {
            if (s == 0) continue;

            var shape = this.shapes[s];
            shape.animation.update(engine.time / 1000.0, dt);
        }

        if (this.instruction1_chat == null && this.instruction1_item) {
            this.instruction1_chat = new ChatBubble(engine, new vec2([300, 0]));
            this.instruction1_chat.text = "Press <X> to inspect/use the selected item in your inventory.";
            this.instruction1_chat.skip_by_x = true;
            this.instruction1_chat.time_limit = 5000.0;

            this.scene.add_chat_command(this.instruction1_chat, this, null);
        }

        if (this.instruction2_chat == null && this.instruction2_item) {
            this.instruction2_chat = new ChatBubble(engine, new vec2([350, 0]));
            this.instruction2_chat.text = "Your are now in the time vortex!\nEach plane represents a time period which you can travel to.";
            this.instruction2_chat.time_limit = 7000.0;

            this.locked = true;
            this.scene.add_chat_command(this.instruction2_chat, this, function (command: ChatCommand) {
                var chat = new ChatBubble(engine, new vec2([300, 0]));
                chat.text = "The time-shifter will SHAPESHIFT you in the appropriate form when travling through out time to reduce suspicion.";
                chat.time_limit = 7000.0;
                console.log("g")
                this.scene.add_chat_command(chat, this, function (command: ChatCommand) {
                    this.locked = false;
                }.bind(this));
            }.bind(this));
        }

        if (this.instruction3_chat == null && this.instruction3_item) {
            this.instruction3_chat = new ChatBubble(engine, new vec2([350, 0]));
            this.instruction3_chat.text = "These enemies are from the future, i can't possibly kill it with a regular old sword!";
            this.instruction3_chat.time_limit = 3000.0;

            this.scene.add_chat_command(this.instruction3_chat, this, null);
        }

        if (this.found_item) {
            this.found_item.animation.update(engine.time / 1000.0, dt);
        }

        if (this.time_shifter) {
            this.time_shifter.animation.update(engine.time / 1000.0, dt);
        }

        for (var item_i in this.inventory) {
            this.inventory[item_i].animation.update(engine.time / 1000.0, dt);
        }

        var current_speed = this.speed;
        if (this.animation_state == PlayerAnimationState.Attack) {
            current_speed *= 0.5;
        }

        if (keyboard.press(49)) this.current_item = 0;
        else if (keyboard.press(50)) this.current_item = 1;
        else if (keyboard.press(51)) this.current_item = 2;
        else if (keyboard.press(52)) this.current_item = 3;
        else if (keyboard.press(53)) this.current_item = 4;

        if (this.animation_state != PlayerAnimationState.Found && !this.locked) {
            // NOTE: Move left
            if (keyboard.isDown(39)) {
                this.velocity.x += dt * current_speed * Math.cos(world.current_view_angle * (Math.PI / 180.0));
                this.velocity.z += dt * current_speed * Math.sin(world.current_view_angle * (Math.PI / 180.0));
                this.direction = false;
            }

            // NOTE: Move right
            if (keyboard.isDown(37)) {
                this.velocity.x -= dt * current_speed * Math.cos(world.current_view_angle * (Math.PI / 180.0));
                this.velocity.z -= dt * current_speed * Math.sin(world.current_view_angle * (Math.PI / 180.0));
                this.direction = true;
            }

            // NOTE: Jump
            if (keyboard.press(38) && (this.on_ground || this.jump_count < 2)) {
                this.animation_state = PlayerAnimationState.Jump;
                this.play_anm("jump");
                this.velocity.y -= 5.0 + this.velocity.y * 0.7;
                this.on_ground = false;
                this.jump_count++;
            }

            // NOTE: Dance
            if (keyboard.press(81) && this.animation_state == PlayerAnimationState.Idle) {
                this.animation_state = PlayerAnimationState.Dance;
                this.play_anm("dance");
            }
        }

        // NOTE: Attack
        if (keyboard.press(88) && (this.animation_state == PlayerAnimationState.Idle || this.animation_state == PlayerAnimationState.Jump) && !this.locked) {
            this.scene.button_x();

            var item = this.inventory[this.current_item];
            if (item != null) {
                if (item instanceof Weapon) {
                    this.weapon = <Weapon>item;
                    this.weapon.offset = new vec2([11.0, 3.0]);
                    if (this.weapon != null) {
                        this.animation_state = PlayerAnimationState.Attack;
                        this.play_anm("attack_sword");

                        world.player_attack_weapon(engine.time, dt, this, this.weapon);
                    }
                }

                if (item instanceof TimeShifter) {
                    this.animation_state = PlayerAnimationState.Found;
                    this.play_anm("found");
                    this.found_item = item;

                    this.time_shifter = <TimeShifter>item;
                    this.inventory.splice(this.current_item, 1);

                    inspect_sound.play();

                    (new Tween(this)).to({}, 2000.0).on(function (value: number) {
                        this.found_item_rotation = value;
                        this.found_item_position = new vec3([this.position.x, this.position.y - Math.sin(Math.PI*value) - 0.5, this.position.z])
                    }).complete(this, function () {
                        this.found_item = null;

                        var ins_time_shift = new ChatBubble(engine, new vec2([250, 0]));
                        ins_time_shift.text = "You found the \n'TIME SHIFTER' press <SPACE> to use it.";
                        ins_time_shift.skip_by_space = true;
                        this.scene.add_chat_command(ins_time_shift, this, null);

                    }).start(engine.time);
                }
            }
        }

        // NOTE: Shift view
        if (keyboard.press(32) && !this.locked) {
            this.scene.button_space();
            if (this.time_shifter != null)
            {
                this.instruction2_item = true;
                world.toggle_angle();
            }
        }

        if (this.animation_state == PlayerAnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.play_anm_ifn("run");
            } else {
                this.play_anm_ifn("idle");
            }
        }
    }

    private play_anm(name: string) {
        for (var s in this.shapes) {
            var shape = this.shapes[s];
            shape.animation.play(name);
        }
    }

    private play_anm_ifn(name: string) {
        for (var s in this.shapes) {
            var shape = this.shapes[s];
            shape.animation.play_ifn(name);
        }
    }

    current_animator(): AnimationManager {
        var shape = this.shapes[-this.dimension];
        if (shape == null)
            return null;

        return shape.animation;
    }
}