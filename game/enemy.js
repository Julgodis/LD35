var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(texture) {
        _super.call(this, texture);
        this.direction = false;
        this.speed = 8.0;
        this.size = new vec3([8.0 / 16.0, 1, 8.0 / 16.0]);
        this.attackable = true;
        this.attack_cd = 0;
        this.push_factor = 0;
    }
    Enemy.prototype.initialize_animations = function () {
        var idle_animation = this.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, Animation.FrameTime * 15.0), true);
        idle_animation.random_frame_time = 0.5;
        var run_animation = this.animation.add_animation("run", Animation.fsequence(8, 6), Animation.ft_repate(6, Animation.FrameTime * 3.5), true);
        var attack_animation = this.animation.add_animation("attack", Animation.fsequence(16, 4), [Animation.FrameTime, Animation.FrameTime * 0.5, Animation.FrameTime * 4, Animation.FrameTime * 0.5], false);
        var jump_animation = this.animation.add_animation("jump", Animation.fsequence(24, 4), [Animation.FrameTime * 0.5, Animation.FrameTime * 1, Animation.FrameTime * 8, Animation.FrameTime * 0.5], false);
        this.animation.play("idle");
    };
    Enemy.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
        this.attack_cd -= dt;
    };
    return Enemy;
})(AnimatedObject);
var Knight1State;
(function (Knight1State) {
    Knight1State[Knight1State["Idle"] = 0] = "Idle";
    Knight1State[Knight1State["Following"] = 1] = "Following";
    Knight1State[Knight1State["Attacking"] = 2] = "Attacking";
    Knight1State[Knight1State["Won"] = 3] = "Won";
})(Knight1State || (Knight1State = {}));
var Knight1AnimationState;
(function (Knight1AnimationState) {
    Knight1AnimationState[Knight1AnimationState["Idle"] = 0] = "Idle";
    Knight1AnimationState[Knight1AnimationState["Attack"] = 1] = "Attack";
    Knight1AnimationState[Knight1AnimationState["Dead"] = 2] = "Dead";
    Knight1AnimationState[Knight1AnimationState["Jump"] = 3] = "Jump";
})(Knight1AnimationState || (Knight1AnimationState = {}));
var Knight1 = (function (_super) {
    __extends(Knight1, _super);
    function Knight1(texture, weapon) {
        _super.call(this, texture);
        this.state = Knight1State.Idle;
        this.animation_state = Knight1AnimationState.Idle;
        this.weapon = weapon;
    }
    Knight1.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
        if (!world.player.alive) {
            this.state = Knight1State.Won;
        }
        if (this.weapon != null) {
            this.weapon.offset = new vec2([11.0, 3.0]);
            this.weapon.animation.update(engine.time / 1000.0, dt);
        }
        if (this.animation_state == Knight1AnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.animation.play_ifn("run");
            }
            else {
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
            if (this.dimension != world.player.dimension) {
                this.state = Knight1State.Idle;
                return;
            }
            this.direction = (this.position.x - world.player.position.x) > 0;
            var delta = this.position.copy().sub(world.player.position);
            var distance = delta.length2();
            if (distance < 1 && this.animation_state == Knight1AnimationState.Idle) {
                this.attack_player(world, dt);
            }
            else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 4, 2)) {
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
    };
    Knight1.prototype.attack_player = function (world, dt) {
        if (this.attack_cd > 0)
            return;
        this.animation_state = Knight1AnimationState.Attack;
        this.animation.play("attack");
        world.enemy_attack_weapon(engine.time, dt, this, this.weapon);
        this.attack_cd = 0.5 + (Math.random() - 0.5) * 0.1;
    };
    Knight1.prototype.initialize_animations = function () {
        _super.prototype.initialize_animations.call(this);
    };
    Knight1.prototype.animation_complete = function (name) {
        this.animation_state = Knight1AnimationState.Idle;
    };
    Knight1.prototype.died = function () {
        this.animation_state = Knight1AnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);
    };
    return Knight1;
})(Enemy);
//
var RobotState;
(function (RobotState) {
    RobotState[RobotState["Idle"] = 0] = "Idle";
    RobotState[RobotState["Following"] = 1] = "Following";
    RobotState[RobotState["Attacking"] = 2] = "Attacking";
    RobotState[RobotState["Won"] = 3] = "Won";
})(RobotState || (RobotState = {}));
var RobotAnimationState;
(function (RobotAnimationState) {
    RobotAnimationState[RobotAnimationState["Idle"] = 0] = "Idle";
    RobotAnimationState[RobotAnimationState["Attack"] = 1] = "Attack";
    RobotAnimationState[RobotAnimationState["Dead"] = 2] = "Dead";
    RobotAnimationState[RobotAnimationState["Jump"] = 3] = "Jump";
})(RobotAnimationState || (RobotAnimationState = {}));
var Robot = (function (_super) {
    __extends(Robot, _super);
    function Robot(texture, weapon) {
        _super.call(this, texture);
        this.state = RobotState.Idle;
        this.animation_state = RobotAnimationState.Idle;
        this.weapon = weapon;
        this.hp = 250;
        this.hp_max = 250;
    }
    Robot.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
        if (!world.player.alive) {
            this.state = RobotState.Won;
        }
        if (this.animation_state == RobotAnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.animation.play_ifn("run");
            }
            else {
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
            }
            else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1, 2)) {
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
    };
    Robot.prototype.attack_player = function (world, dt, direction) {
        if (this.attack_cd > 0)
            return;
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
    };
    Robot.prototype.initialize_animations = function () {
        _super.prototype.initialize_animations.call(this);
        this.animation.animations["attack"].frame_time = [Animation.FrameTime * 0.5, Animation.FrameTime * 0.5 * 0.5, Animation.FrameTime * 4 * 0.5, Animation.FrameTime * 0.5 * 0.5];
    };
    Robot.prototype.animation_complete = function (name) {
        this.animation_state = RobotAnimationState.Idle;
    };
    Robot.prototype.died = function () {
        this.animation_state = RobotAnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);
    };
    return Robot;
})(Enemy);
// 
var BossState;
(function (BossState) {
    BossState[BossState["Attacking"] = 0] = "Attacking";
    BossState[BossState["Won"] = 1] = "Won";
})(BossState || (BossState = {}));
var BossStage;
(function (BossStage) {
    BossStage[BossStage["Machine"] = 0] = "Machine";
    BossStage[BossStage["Machine_NoGlass"] = 1] = "Machine_NoGlass";
    BossStage[BossStage["Sword"] = 2] = "Sword";
})(BossStage || (BossStage = {}));
var BossAnimationState;
(function (BossAnimationState) {
    BossAnimationState[BossAnimationState["Idle"] = 0] = "Idle";
    BossAnimationState[BossAnimationState["Fire"] = 1] = "Fire";
    BossAnimationState[BossAnimationState["Sword"] = 2] = "Sword";
    BossAnimationState[BossAnimationState["Dead"] = 3] = "Dead";
    BossAnimationState[BossAnimationState["Jump"] = 4] = "Jump";
})(BossAnimationState || (BossAnimationState = {}));
var Boss = (function (_super) {
    __extends(Boss, _super);
    function Boss(textures, scene) {
        this.textures = textures;
        _super.call(this, this.textures[0]);
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
    Boss.prototype.update = function (world, dt) {
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
                (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value) {
                    screen_x_offset = (world.player.position.x - this.position.x) * 100 * (value);
                }).complete(this, function (obj) {
                    world.ex_particle_emitter.position = this.position.copy().add(new vec3([-1, -1, 0]));
                    world.ex_particle_emitter.spawn_x(engine.time, dt, World.SPAWN_EX_COUNT);
                    explosion_sound.play();
                    this.animation.spritesheet = this.textures[1];
                    (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value) {
                        screen_x_offset = (world.player.position.x - this.position.x) * 100 * (1.0 - value);
                        this.position.x = lerp(this.position.x, this.first_pos.x, value);
                        this.position.y = lerp(this.position.y, this.first_pos.y, value);
                        this.position.z = lerp(this.position.z, this.first_pos.z, value);
                    }).complete(this, function (obj) {
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
                (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value) {
                    screen_x_offset = (world.player.position.x - this.position.x) * 100 * (value);
                }).complete(this, function (obj) {
                    world.ex_particle_emitter.position = this.position.copy().add(new vec3([-1, -1, 0]));
                    world.ex_particle_emitter.spawn_x(engine.time, dt, World.SPAWN_EX_COUNT);
                    explosion_sound.play();
                    this.stage = BossStage.Sword;
                    this.size = new vec3([10 / 16.0, 1, 10 / 16.0]);
                    this.animation = new AnimationManager(this.textures[2], 16, 16);
                    var idle_animation = this.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, Animation.FrameTime * 15.0), true);
                    idle_animation.random_frame_time = 0.5;
                    var run_animation = this.animation.add_animation("run", Animation.fsequence(8, 6), Animation.ft_repate(6, Animation.FrameTime * 3.5), true);
                    var attack_animation = this.animation.add_animation("attack", Animation.fsequence(16, 4), [Animation.FrameTime, Animation.FrameTime * 0.5, Animation.FrameTime * 4, Animation.FrameTime * 0.5], false);
                    var jump_animation = this.animation.add_animation("jump", Animation.fsequence(24, 4), [Animation.FrameTime * 0.5, Animation.FrameTime * 1, Animation.FrameTime * 8, Animation.FrameTime * 0.5], false);
                    (new Tween(this)).to({}, 2000.0).start(engine.time).on(function (value) {
                        screen_x_offset = (world.player.position.x - this.position.x) * 100 * (1.0 - value);
                        this.position.x = lerp(this.position.x, this.first_pos.x, value);
                        this.position.y = lerp(this.position.y, this.first_pos.y, value);
                        this.position.z = lerp(this.position.z, this.first_pos.z, value);
                    }).complete(this, function (obj) {
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
        _super.prototype.update.call(this, world, dt);
        if (this.locked)
            return;
        if (!world.player.alive) {
            this.state = BossState.Won;
        }
        if (this.animation_state == BossAnimationState.Idle) {
            if (this.velocity.length2() > 0.1) {
                this.animation.play_ifn("run");
            }
            else {
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
                }
                else {
                    if (distance > Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 3, 2)) {
                        delta.normalize();
                        this.velocity.sub(delta.mul(dt * this.speed));
                    }
                    else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1, 2)) {
                        delta.normalize();
                        this.velocity.add(delta.mul(dt * this.speed));
                    }
                    if (this.animation_state == BossAnimationState.Idle) {
                        delta.normalize();
                        this.fire_canon(world, new vec3([Math.sign(delta.x), 0, 0]));
                    }
                }
            }
        }
        else if (this.stage == BossStage.Machine_NoGlass) {
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
                }
                else {
                    if (distance > Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 3, 2)) {
                        delta.normalize();
                        this.velocity.sub(delta.mul(dt * this.speed));
                    }
                    else if (distance < Math.pow(this.size.x * 0.5 + world.player.size.x * 0.5 + 1, 2)) {
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
                }
                else {
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
    };
    Boss.prototype.attack_player = function (world, dt) {
        if (this.attack_cd > 0)
            return;
        this.animation_state = BossAnimationState.Sword;
        this.animation.play("attack");
        world.enemy_attack_weapon(engine.time, dt, this, this.sword);
        this.attack_cd = 0.5 + (Math.random() - 0.5) * 0.1;
    };
    Boss.prototype.fire_canon = function (world, direction) {
        if (this.attack_cd > 0)
            return;
        this.animation_state = BossAnimationState.Fire;
        this.animation.play("fire_canon");
        var bullet = new Bullet();
        bullet.texture = boss_canon_texture;
        bullet.position = this.position.copy().add(new vec3([-8 / 10, 9.5 / 16 + 1, 1 / 16]));
        bullet.size = new vec3([2 / 16, 2 / 16, 2 / 16]);
        bullet.velocity = direction.copy().mul(-5);
        bullet.velocity.z = 0;
        bullet.weapon = this.canon;
        bullet.dimension = this.dimension;
        bullet.ignore = this;
        laser_sound.play();
        world.add_bullet(bullet);
        this.attack_cd = 0.8 - Math.random() * 0.4;
    };
    Boss.prototype.initialize_animations = function () {
        _super.prototype.initialize_animations.call(this);
        this.animation = new AnimationManager(this.textures[0], 48, 32);
        this.animation.complete_interface = this;
        var idle_animation = this.animation.add_animation("idle", Animation.fsequence(0, 4), Animation.ft_repate(4, 0.1), true);
        idle_animation.random_frame_time = 0.05;
        this.animation.play("idle");
        this.animation.add_animation("fire_canon", Animation.fsequence(4, 4), Animation.ft_repate(4, 0.1), false);
        this.animation.add_animation("jump", Animation.fsequence(0, 4), Animation.ft_repate(4, 0.05), false);
    };
    Boss.prototype.animation_complete = function (name) {
        this.animation_state = BossAnimationState.Idle;
    };
    Boss.prototype.died = function () {
        this.animation_state = BossAnimationState.Dead;
        this.velocity = new vec3([0, 0, 0]);
        this.scene.chat_destory();
        scene = new WinScene(engine);
    };
    return Boss;
})(Enemy);
//# sourceMappingURL=enemy.js.map