class Enemy extends AnimatedObject implements Pushable {
    speed: number;

    attack_cd: number;
    push_factor: number;

    constructor(texture: Texture) {
        super(texture);

        this.direction = false;
        this.speed = 8.0;
        this.size = new vec3([8.0 / 16.0, 1, 8.0 / 16.0]);

        this.attackable = true;
        this.attack_cd = 0;
        this.push_factor = 0;
    }

    initialize_animations() {
        var idle_animation = this.animation.add_animation("idle",
            Animation.fsequence(0, 4),
            Animation.ft_repate(4, Animation.FrameTime * 15.0),
            true);
        idle_animation.random_frame_time = 0.5;

        var run_animation = this.animation.add_animation("run",
            Animation.fsequence(8, 6),
            Animation.ft_repate(6, Animation.FrameTime * 3.5),
            true);

        var attack_animation = this.animation.add_animation("attack",
            Animation.fsequence(16, 4),
            [Animation.FrameTime, Animation.FrameTime * 0.5, Animation.FrameTime * 4, Animation.FrameTime * 0.5],
            false);

        var jump_animation = this.animation.add_animation("jump",
            Animation.fsequence(24, 4),
            [Animation.FrameTime * 0.5, Animation.FrameTime * 1, Animation.FrameTime * 8, Animation.FrameTime * 0.5],
            false);

        this.animation.play("idle");
    }

    update(world: World, dt: number): void {
        super.update(world, dt);

        this.attack_cd -= dt;
    }
}

enum Knight1State {
    Idle,
    Following,
    Attacking,
    Won
}

enum Knight1AnimationState {
    Idle,
    Attack,
    Dead,
    Jump
}

class Knight1 extends Enemy {
    state: Knight1State;
    animation_state: Knight1AnimationState;

    weapon: Weapon;

    constructor(texture: Texture, weapon: Weapon) {
        super(texture);

        this.state = Knight1State.Idle;
        this.animation_state = Knight1AnimationState.Idle;
        this.weapon = weapon;
    }

    update(world: World, dt: number): void {
        super.update(world, dt);

        if (!world.player.alive) {
            this.state = Knight1State.Won;
        }

        if (this.weapon != null) { // NOTE: Bad way ....
            this.weapon.offset = new vec2([11.0, 3.0]);
            this.weapon.animation.update(engine.time / 1000.0, dt);
        }

        if (this.animation_state == Knight1AnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.animation.play_ifn("run");
            } else {
                this.animation.play_ifn("idle");
            }
        }

        if (this.state == Knight1State.Idle && this.dimension == world.player.dimension) {
            this.direction = (this.position.x - world.player.position.x) > 0;

            var delta = this.position.copy().sub(world.player.position);
            var distance = delta.length2();

            if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 4, 2)) {
                this.state = Knight1State.Attacking;
            }
        }

        if (this.state == Knight1State.Attacking) {
            if (this.dimension != world.player.dimension)
            {
                this.state = Knight1State.Idle;
                return;
            }

            this.direction = (this.position.x - world.player.position.x) > 0;

            var delta = this.position.copy().sub(world.player.position);
            var distance = delta.length2();

            if (distance < 1 && this.animation_state == Knight1AnimationState.Idle) {
                this.attack_player(world, dt);
            } else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 4, 2)) {
                delta.normalize();
                if (delta.y > 0.9) {
                    this.velocity.sub((new vec3([(this.direction ? -1 : 1), 0, 0])).mul(dt * this.speed * this.speed));
                }
                delta.z = 0;
                delta.y = 0;
                this.velocity.sub(delta.mul(dt * this.speed));
            }

            if (this.position.y + (Math.random() * 0.5 - 0.5) > world.player.position.y && Math.random() > 0.9 && this.on_ground) {
                this.animation_state = Knight1AnimationState.Jump;
                this.animation.play("jump");

                this.velocity.y -= 5.0 + this.velocity.y * 0.7;
                this.on_ground = false;
            }
        }
    }

    attack_player(world: World, dt: number) {
        if (this.attack_cd > 0) return;

        this.animation_state = Knight1AnimationState.Attack;
        this.animation.play("attack");

        world.enemy_attack_weapon(engine.time, dt, this, this.weapon);
        this.attack_cd = 0.5 + (Math.random() - 0.5) * 0.1;
    }

    initialize_animations() {
        super.initialize_animations();
    }

    animation_complete(name: string): void {
        this.animation_state = Knight1AnimationState.Idle;
    }

    died(): void {
        this.animation_state = Knight1AnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);
    }
}

//


enum RobotState {
    Idle,
    Following,
    Attacking,
    Won
}

enum RobotAnimationState {
    Idle,
    Attack,
    Dead,
    Jump
}

class Robot extends Enemy {
    state: RobotState;
    animation_state: RobotAnimationState;

    weapon: Weapon;

    constructor(texture: Texture, weapon: Weapon) {
        super(texture);

        this.state = RobotState.Idle;
        this.animation_state = RobotAnimationState.Idle;
        this.weapon = weapon;

        this.hp = 250;
        this.hp_max = 250;
    }

    update(world: World, dt: number): void {
        super.update(world, dt);

        if (!world.player.alive) {
            this.state = RobotState.Won;
        }

        if (this.animation_state == RobotAnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.animation.play_ifn("run");
            } else {
                this.animation.play_ifn("idle");
            }
        }

        if (this.state == RobotState.Idle && this.dimension == world.player.dimension) {
            this.direction = (this.position.x - world.player.position.x) > 0;

            var delta = this.position.copy().sub(world.player.position);
            var distance = delta.length2();

            if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 3, 2)) {
                world.player.instruction3_item = true;
            }

            if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 2, 2)) {
                this.state = RobotState.Attacking;
            }
        }

        if (this.state == RobotState.Attacking) {
            if (this.dimension != world.player.dimension) {
                this.state = RobotState.Idle;
                return;
            }

            this.direction = (this.position.x - world.player.position.x) > 0;

            var delta = this.position.copy().sub(world.player.position);
            var distance = delta.length2();

            if (distance > Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 3, 2)) {
                delta.normalize();
                this.velocity.sub(delta.mul(dt * this.speed));
            } else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1, 2)) {
                delta.normalize();
                if (delta.y > 0.9) {
                    this.velocity.sub((new vec3([(this.direction ? -1 : 1), 0, 0])).mul(dt * this.speed * this.speed));
                }
                this.velocity.add(delta.mul(dt * this.speed));
            }

            if (this.animation_state == RobotAnimationState.Idle) {
                delta.normalize();
                this.attack_player(world, dt, new vec3([Math.sign(delta.x), 0, 0]));
            }

            if (this.position.y + (Math.random() * 0.5 - 0.5) > world.player.position.y && Math.random() > 0.9 && this.on_ground) {
                this.animation_state = RobotAnimationState.Jump;
                this.animation.play("jump");

                this.velocity.y -= 5.0 + this.velocity.y * 0.7;
                this.on_ground = false;
            }
        }
    }

    attack_player(world: World, dt: number, direction: vec3) {
        if (this.attack_cd > 0) return;

        this.animation_state = RobotAnimationState.Attack;
        this.animation.play("attack");

        laser_sound.play();


        var bullet = new Bullet();
        bullet.texture = boss_canon_texture;
        bullet.position = this.position.copy().add(new vec3([-3 / 10, 4 / 16, 1 / 16]));
        bullet.size = new vec3([2 / 16, 2 / 16, 2 / 16]);
        bullet.velocity = direction.copy().mul(-10);
        bullet.velocity.z = 0;
        bullet.weapon = this.weapon;
        bullet.dimension = this.dimension;
        bullet.ignore = this;

        world.add_bullet(bullet);

        this.attack_cd = 0.1;
    }

    initialize_animations() {
        super.initialize_animations();

        this.animation.animations["attack"].frame_time = [Animation.FrameTime * 0.5, Animation.FrameTime * 0.5 * 0.5, Animation.FrameTime * 4 * 0.5, Animation.FrameTime * 0.5 * 0.5 ];
    }

    animation_complete(name: string): void {
        this.animation_state = RobotAnimationState.Idle;
    }

    died(): void {
        this.animation_state = RobotAnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);
    }
}


// 

enum BossState {
    Attacking,
    Won
}

enum BossStage {
    Machine,
    Machine_NoGlass,
    Sword
}

enum BossAnimationState {
    Idle,
    Fire,
    Sword,
    Dead,
    Jump
}

class Boss extends Enemy {
    textures: Texture[];

    stage: BossStage;
    state: BossState;
    animation_state: BossAnimationState;

    canon: Weapon;
    sword: Weapon;
    locked: boolean;

    first_pos: vec3;

    scene: StoryScene;
    constructor(textures: Texture[], scene: StoryScene) {
        this.textures = textures;
        super(this.textures[0]);

        this.scene = scene;
        this.stage = BossStage.Machine;
        this.state = BossState.Attacking;
        this.animation_state = BossAnimationState.Idle;

        this.hp = 800.0;
        this.hp_max = 800.0;
        this.size = new vec3([3.0 - 6 / 16.0, 4, 0.8]);
        this.scale = 1;
        this.locked = false;

        this.canon = new BossCanon(boss_canon_texture);
        this.sword = new BossSword(boss_canon_texture);

        this.first_pos = null;
    }

    update(world: World, dt: number): void {
        if (this.first_pos == null)
            this.first_pos = new vec3([this.position.x, -4, this.position.z]);

        this.sword.animation.update(engine.time, dt);

        if (this.hp <= 0 || !this.alive) {
            if (this.stage == BossStage.Machine) {
                // TODO: BOOOM

                this.hp = 1100.0;
                this.hp_max = 1100.0;
                this.alive = true;
                this.color = new vec4([1, 1, 1, 1]);

                var delta = this.position.copy().sub(world.player.position);
                delta.normalize();
                world.player.velocity.sub(delta.mul(10));

                this.stage = BossStage.Machine_NoGlass;
                this.state = BossState.Attacking;
                this.animation_state = BossAnimationState.Idle;
                world.player.locked = true;
                this.locked = true;

                this.animation.play("idle");
                (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value: number) {
                    screen_x_offset = (world.player.position.x - this.position.x) * 100 * (value);
                }).complete(this, function (obj: any) {
                    world.ex_particle_emitter.position = this.position.copy().add(new vec3([-1, -1, 0]));
                    world.ex_particle_emitter.spawn_x(engine.time, dt, World.SPAWN_EX_COUNT);
                    explosion_sound.play();

                    this.animation.spritesheet = this.textures[1];
                    (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value: number) {
                        screen_x_offset = (world.player.position.x - this.position.x) * 100 * (1.0 - value);

                        this.position.x = lerp(this.position.x, this.first_pos.x, value);
                        this.position.y = lerp(this.position.y, this.first_pos.y, value);
                        this.position.z = lerp(this.position.z, this.first_pos.z, value);
                    }).complete(this, function (obj: any) {
                        world.player.locked = false;
                        this.locked = false;
                        this.velocity = new vec3([0, 0, 0]);

                        var back = new Robot(enemy_texture[2], new RobotLaser(itemmap_texture));
                        back.position = new vec3([world.player.position.x - 5, -5, world.player.position.z]);
                        back.velocity = new vec3([20, 0, 0]);
                        world.add_object(back);
                    });
                });
            }
            else if (this.stage == BossStage.Machine_NoGlass) {
                // TODO: BOOOM

                this.hp = 350.0;
                this.hp_max = 350.0;
                this.alive = true;
                this.color = new vec4([1, 1, 1, 1]);

                var delta = this.position.copy().sub(world.player.position);
                delta.normalize();
                world.player.velocity.sub(delta.mul(10));

                this.state = BossState.Attacking;
                this.animation_state = BossAnimationState.Idle;
                world.player.locked = true;
                this.locked = true;

                this.animation.play("idle");
                (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value: number) {
                    screen_x_offset = (world.player.position.x - this.position.x) * 100 * (value);
                }).complete(this, function (obj: any) {
                    world.ex_particle_emitter.position = this.position.copy().add(new vec3([-1, -1, 0]));
                    world.ex_particle_emitter.spawn_x(engine.time, dt, World.SPAWN_EX_COUNT);
                    explosion_sound.play();

                    this.stage = BossStage.Sword;
                    this.size = new vec3([10 / 16.0, 1, 10 / 16.0]);
                    this.animation = new AnimationManager(this.textures[2], 16, 16);
                    var idle_animation = this.animation.add_animation("idle",
                        Animation.fsequence(0, 4),
                        Animation.ft_repate(4, Animation.FrameTime * 15.0),
                        true);
                    idle_animation.random_frame_time = 0.5;

                    var run_animation = this.animation.add_animation("run",
                        Animation.fsequence(8, 6),
                        Animation.ft_repate(6, Animation.FrameTime * 3.5),
                        true);

                    var attack_animation = this.animation.add_animation("attack",
                        Animation.fsequence(16, 4),
                        [Animation.FrameTime, Animation.FrameTime * 0.5, Animation.FrameTime * 4, Animation.FrameTime * 0.5],
                        false);

                    var jump_animation = this.animation.add_animation("jump",
                        Animation.fsequence(24, 4),
                        [Animation.FrameTime * 0.5, Animation.FrameTime * 1, Animation.FrameTime * 8, Animation.FrameTime * 0.5],
                        false);
                    (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value: number) {
                        screen_x_offset = (world.player.position.x - this.position.x) * 100 * (1.0 - value);

                        this.position.x = lerp(this.position.x, this.first_pos.x, value);
                        this.position.y = lerp(this.position.y, this.first_pos.y, value);
                        this.position.z = lerp(this.position.z, this.first_pos.z, value);
                    }).complete(this, function (obj: any) {
                        world.player.locked = false;
                        this.locked = false;
                        this.velocity = new vec3([0, 0, 0]);

                        var back = new Robot(enemy_texture[2], new RobotLaser(itemmap_texture));
                        back.position = new vec3([world.player.position.x - 5, -5, world.player.position.z]);
                        back.velocity = new vec3([20, 0, 0]);
                        world.add_object(back);
                    });
                });
            }
        }

        super.update(world, dt);
        if (this.locked) return;

        if (!world.player.alive) {
            this.state = BossState.Won;
        }

        if (this.animation_state == BossAnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.animation.play_ifn("run");
            } else {
                this.animation.play_ifn("idle");
            }
        }

        if (this.stage == BossStage.Machine) {
            if (this.state == BossState.Attacking) {
                this.position.z = world.player.position.z;
                this.direction = (this.position.x - world.player.position.x) > 0;

                var delta = this.position.copy().sub(world.player.position);
                var distance = delta.length2();

                if (((Math.random() > 0.8 && Math.random() > 0.5) || (1 * Math.random() > distance)) && ((this.animation_state == BossAnimationState.Idle && this.on_ground) || ((6 * Math.random() > distance) && this.position.y > -5))) {
                    this.animation_state = BossAnimationState.Jump;
                    this.animation.play("jump");

                    this.position.y -= 0.05;
                    this.velocity.y -= 6;
                } else {
                    if (distance > Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 3, 2)) {
                        delta.normalize();
                        this.velocity.sub(delta.mul(dt * this.speed));
                    } else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1, 2)) {
                        delta.normalize();
                        this.velocity.add(delta.mul(dt * this.speed));
                    }

                    if (this.animation_state == BossAnimationState.Idle) {
                        delta.normalize();
                        this.fire_canon(world, new vec3([Math.sign(delta.x), 0, 0]));
                    }
                }
            }
        } else if (this.stage == BossStage.Machine_NoGlass) {
            if (this.state == BossState.Attacking) {
                this.position.z = world.player.position.z;
                this.direction = (this.position.x - world.player.position.x) > 0;

                var delta = this.position.copy().sub(world.player.position);
                var distance = delta.length2();

                if (((Math.random() > 0.8 && Math.random() > 0.4) || (1 * Math.random() > distance)) && ((this.animation_state == BossAnimationState.Idle && this.on_ground) || ((6 * Math.random() > distance) && this.position.y > -5))) {
                    this.animation_state = BossAnimationState.Jump;
                    this.animation.play("jump");

                    this.position.y -= 0.05;
                    this.velocity.y -= 6;
                } else {
                    if (distance > Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 3, 2)) {
                        delta.normalize();
                        this.velocity.sub(delta.mul(dt * this.speed));
                    } else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1, 2)) {
                        delta.normalize();
                        this.velocity.add(delta.mul(dt * this.speed));
                    }

                    if (this.animation_state == BossAnimationState.Idle) {
                        delta.normalize();
                        var t = new vec3([Math.sign(delta.x), 2 * Math.random() - 1.0, 0]);
                        t.normalize();
                        this.fire_canon(world, t);
                    }
                }

            }
        }
        else if (this.stage == BossStage.Sword) {
            if (this.animation_state == BossAnimationState.Idle) {
                if (this.velocity.length2() > 0.1) {
                    this.animation.play_ifn("run");
                } else {
                    this.animation.play_ifn("idle");
                }
            }

            if (this.state == BossState.Attacking) {
                this.position.z = world.player.position.z;
                this.direction = (this.position.x - world.player.position.x) > 0;

                var delta = this.position.copy().sub(world.player.position);
                var distance = delta.length2();

                if (distance > Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5, 2)) {
                    delta.normalize();
                    if (delta.y > 0.9) {
                        this.velocity.sub((new vec3([(this.direction ? -1 : 1), 0, 0])).mul(dt * this.speed * this.speed));
                    }
                    this.velocity.sub(delta.mul(dt * this.speed));
                }

                if (distance <= Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1.0, 2)) {
                    this.attack_player(world, dt);
                }

                if (Math.random() > 0.8 && Math.random() > 0.3 && this.animation_state == BossAnimationState.Idle && this.on_ground) {
                    this.animation_state = BossAnimationState.Jump;
                    this.animation.play("jump");

                    this.velocity.y -= 6;
                }
            }
        }

    }

    attack_player(world: World, dt: number) {
        if (this.attack_cd > 0) return;

        this.animation_state = BossAnimationState.Sword;
        this.animation.play("attack");

        world.enemy_attack_weapon(engine.time, dt, this, this.sword);
        this.attack_cd = 0.5 + (Math.random() - 0.5) * 0.1;
    }

    fire_canon(world: World, direction: vec3) {
        if (this.attack_cd > 0) return;

        this.animation_state = BossAnimationState.Fire;
        this.animation.play("fire_canon");

        var bullet = new Bullet();
        bullet.texture = boss_canon_texture;
        bullet.position = this.position.copy().add(new vec3([-8/10, 9.5/16 + 1, 1/16]));
        bullet.size = new vec3([2/16, 2/16, 2/16]);
        bullet.velocity = direction.copy().mul(-5);
        bullet.velocity.z = 0;
        bullet.weapon = this.canon;
        bullet.dimension = this.dimension;
        bullet.ignore = this;

        laser_sound.play();

        world.add_bullet(bullet);
        this.attack_cd = 0.8 - Math.random() * 0.4;
    }

    initialize_animations() {
        super.initialize_animations();

        this.animation = new AnimationManager(this.textures[0], 48, 32);
        this.animation.complete_interface = this;

        var idle_animation = this.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, 0.1), true);
        idle_animation.random_frame_time = 0.05;
        this.animation.play("idle");

        this.animation.add_animation("fire_canon", Animation.fsequence(4, 4), Animation.ft_repate(4, 0.1), false);
        this.animation.add_animation("jump", Animation.fsequence(0, 4), Animation.ft_repate(4, 0.05), false);
    }

    animation_complete(name: string): void {
        this.animation_state = BossAnimationState.Idle;
    }

    died(): void {
        this.animation_state = BossAnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);

        this.scene.chat_destory();
        scene = new WinScene(engine);
    }
}