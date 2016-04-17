var TILE_SIZE = 1.0;

interface Math {
    sign(x: number): number;
}

class BackgroundTexture {
    parallex: number;
    animation: AnimationManager;

    position: vec3;
    scale: number;
}

class DimensionPlane {
    index: number;
    background_color: vec3;
    batch: ModelBatch;

    background_textures: BackgroundTexture []; 
}

class World {
    engine: Engine;
    gravity: vec3;
    player: Player;

    projection_matrix: mat4;
    view_matrix: mat4;

    current_view_angle: number;
    next_view_angle: number;
    angle_changing: boolean;
    angle_tween: Tween;

    view_normal: vec3;
    view_inverse_normal: vec3;

    current_background_color: vec3;
    inbetween_background_color: vec3;

    dimensions: DimensionPlane[];

    gameobjects: GameObject[];
    pushables: Pushable[];
    bullets: Bullet[];
    map: number[][][]; 

    blood_particle_emitter: ParticleEmitter;
    dimension_particle_emitter: ParticleEmitter;
    ex_particle_emitter: ParticleEmitter;

    static SPAWN_BLOOD_COUNT: number = 30;
    static SPAWN_DIMENSION_COUNT: number = 100;
    static SPAWN_EX_COUNT: number = 200;

    constructor(engine: Engine) {
        this.engine = engine; 
        this.gravity = new vec3([0, 9.81, 0]);

        this.projection_matrix = mat4.makeIdentity();
        this.view_matrix = mat4.makeIdentity();

        this.current_view_angle = 0;
        this.next_view_angle = 0;
        this.angle_changing = false;
        this.gameobjects = [];
        this.pushables = [];
        this.bullets = [];
        this.map = [[[]]];
        this.player = null;

        this.dimensions = [];
        this.view_normal = new vec3([1, 0, 0]);
        this.view_inverse_normal = new vec3([0, 0, 1]);

        this.inbetween_background_color = (new vec3([20.0, 20.0, 20.0])).div(255.0);
        this.current_background_color = this.inbetween_background_color.copy();

        this.setup_blood_emitter();
        this.setup_dimension_emitter();
        this.setup_ex_emitter();
    }

    private setup_blood_emitter() {
        var pm = new ParticleEmitter(new vec3([1, 1, 1]));
        pm.position = new vec3([0, 0, 0]);
        pm.textures = [particle_texture_basic];
        pm.spawn_max = -1;
        pm.spawn_rate = -1;
        pm.lifetime = 2000.0;
        pm.gravity_effect = 1.0;
        pm.relative_position = new vec3([0, 0, 0]);
        pm.relative_random_position = new vec3([0, 0, 0]);
        pm.velocity = new vec3([0, -4.0, 0]);
        pm.random_velocity = new vec3([2.5, 2.5, 2.5]);
        pm.scale = 1.2 / 16;
        pm.scale_velocity = 0.01;
        pm.random_scale = 0.5 / 16;
        pm.color1 = new vec4([1, 0.2, 0.2, 1]);
        pm.color2 = new vec4([0.5, 0.0, 0.0, 0]);
        pm.random_color1 = new vec4([0.2, 0.1, 0.1, 0]);
        pm.random_color2 = new vec4([0.2, 0.1, 0.1, 0]);
        pm.rotation = 0;
        pm.random_rotation = 2.0;

        this.blood_particle_emitter = pm;
    }

    private setup_dimension_emitter() {
        var pm = new ParticleEmitter(new vec3([1, 1, 1]));
        pm.position = new vec3([0, 0, 0]);
        pm.textures = [particle_texture_basic];
        pm.spawn_max = -1;
        pm.spawn_rate = -1;
        pm.lifetime = 1000.0;
        pm.gravity_effect = 0.0;
        pm.relative_position = new vec3([0, 0.0, 0]);
        pm.relative_random_position = new vec3([0, 0, 0]);
        pm.velocity = new vec3([0, 0.0, 0]);
        pm.random_velocity = new vec3([1.0, 1.0, 1.0]);
        pm.scale = 0.5 / 16;
        pm.scale_velocity = 0.01;
        pm.random_scale = 0.25 / 16;
        pm.color1 = new vec4([0.2, 0.8, 0.2, 1]);
        pm.color2 = new vec4([0.5, 1.0, 1.5, 0]);
        pm.random_color1 = new vec4([0.1, 0.1, 0.1, 0]);
        pm.random_color2 = new vec4([0.1, 0.1, 0.1, 0]);
        pm.rotation = 0;
        pm.random_rotation = 2.0;

        this.dimension_particle_emitter = pm;
    }

    private setup_ex_emitter() {
        var pm = new ParticleEmitter(new vec3([1, 1, 1]));
        pm.position = new vec3([0, 0, 0]);
        pm.textures = [particle_texture_basic];
        pm.spawn_max = -1;
        pm.spawn_rate = -1;
        pm.lifetime = 1000.0;
        pm.gravity_effect = 0.0;
        pm.relative_position = new vec3([2, 2.0, 1.0]);
        pm.relative_random_position = new vec3([0.5, 0.5, 0]);
        pm.velocity = new vec3([0, 0.0, 0]);
        pm.random_velocity = new vec3([3.0, 3.0, 3.0]);
        pm.scale = 8 / 16;
        pm.scale_velocity = 0.1;
        pm.random_scale = 2 / 16;
        pm.color1 = new vec4([1.0, 1.0, 1.0, 1]);
        pm.color2 = new vec4([1.0, 1.0, 1.0, 0]);
        pm.random_color1 = new vec4([0.2, 0.2, 0.2, 0]);
        pm.random_color2 = new vec4([0.2, 0.2, 0.2, 0]);
        pm.rotation = 0;
        pm.random_rotation = 2.0;

        this.ex_particle_emitter = pm;
    }

    toggle_angle() {
        this.angle_changing = true;

        if (this.next_view_angle == 90)
            this.next_view_angle = 0;
        else if (this.next_view_angle == 0)
            this.next_view_angle = 90;

        if (this.angle_tween == null)
            this.angle_tween = new Tween(this);

        if (this.angle_tween.running)
            this.angle_tween.stop();

        pickup_sound.play();

        this.angle_tween.to({ current_view_angle: this.next_view_angle }, 180.0).on(function (value: number) {
            var dim = this.dimensions[this.player.dimension];
            if (dim) {
                var dim_color = dim.background_color;
                if (this.next_view_angle == 0)
                    this.current_background_color = this.inbetween_background_color.lerp(dim_color, value);
                else
                    this.current_background_color = this.inbetween_background_color.lerp(dim_color, 1 - value);
            } else {
                this.current_background_color = this.inbetween_background_color.copy();
            }
        }).start(engine.time);
    }

    bais_towards_camera(pm: ParticleEmitter) {
        pm.velocity = new vec3([0, -2.0, 0]);
        pm.velocity.add(this.view_inverse_normal);
        pm.velocity.mul(new vec3([-1, 1, 1]));
        pm.velocity.mul(0.4);
    }

    update(dt: number) {
        var value = 1.0 - this.current_view_angle / 90.0;
        this.view_normal = new vec3([1 * value, 0, 1 * (1.0 - value)]);
        this.view_inverse_normal = new vec3([1 * (1.0 - value), 0, 1 * value]);

        this.bais_towards_camera(this.blood_particle_emitter);
        this.bais_towards_camera(this.dimension_particle_emitter);

        this.blood_particle_emitter.update(engine.time, dt, this.gravity);
        this.dimension_particle_emitter.update(engine.time, dt, this.gravity);
        this.ex_particle_emitter.update(engine.time, dt, this.gravity);

        for (var obj_index in this.gameobjects) {
            var obj = this.gameobjects[obj_index];
            var ok = (obj.position.copy().sub(this.player.position).length2()) < 10 * 10;
            if (!ok) continue;

            obj.velocity.add(obj.velocity.copy().mul(new vec3([5, 0.5, 5])).mul(-dt));

            obj.update(this, dt);
            obj.velocity.add(this.gravity.copy().mul(dt));
            this.check_collision(obj, dt);
            this.check_collision_world(obj, dt);

            obj.position.add(obj.velocity.copy().mul(dt));

            if (this.next_view_angle == 0 && !(obj instanceof PushBlock))
                obj.velocity.z += (-this.player.position.z - this.player.dimension * TILE_SIZE) * 0.01;
        }

        for (var p_index in this.pushables) {
            var p = this.pushables[p_index];
 
           // if (pushable.dimension != this.player.dimension)
            //    continue;

            if (p instanceof Enemy) {
                if (p.dimension != this.player.dimension)
                    continue;
            }

            var As = this.player.size.copy().mul(this.player.scale);
            var Ap = this.player.position.copy();//.add(this.gravity.copy().mul(dt));

            var pushable = <GameObject><any>p;

            var Bs = pushable.size.copy().mul(pushable.scale);
            var Bp = pushable.position.copy();
            
            var hit = this.aabb(Ap, As, Bp, Bs);
            if (hit.intersect) {
                if (hit.normal.y > 0) this.player.on_ground = true;

                var vx1 = (hit.normal.x != 0 && Math.sign(hit.normal.x) == Math.sign(pushable.velocity.x)) ? 0 : 1;
                var vy1 = (hit.normal.y != 0 && Math.sign(hit.normal.y) == Math.sign(pushable.velocity.y)) ? 0 : 1;
                var vz1 = (hit.normal.z != 0 && Math.sign(hit.normal.z) == Math.sign(pushable.velocity.z)) ? 0 : 1;
                var vx2 = (hit.normal.x != 0 && Math.sign(hit.normal.x) == Math.sign(this.player.velocity.x)) ? 0 : 1;
                var vy2 = (hit.normal.y != 0 && Math.sign(hit.normal.y) == Math.sign(this.player.velocity.y)) ? 0 : 1;
                var vz2 = (hit.normal.z != 0 && Math.sign(hit.normal.z) == Math.sign(this.player.velocity.z)) ? 0 : 1;

                var distance = hit.offset.length2() / Bs.length2();
                //pushable.velocity.add(hit.normal.copy().mul(p.push_factor * (1 - distance)));

                pushable.velocity.add(hit.offset.copy().mul(1000 * dt));
                pushable.position.add(hit.offset.copy().mul(1 * p.push_factor));
                //pushable.position.sub(this.gravity.copy().mul(dt * hit.normal.y * 0.5));
                
                if (pushable instanceof PushBlock) {
                    var pb = <PushBlock>pushable;
                    if (pb.push_me.time_limit < 0) {
                        pb.push_me.lifetime = engine.time + 1000.0;
                        pb.push_me.time_limit = 1000.0;
                    }
                }
               
                this.player.velocity.mul(new vec3([vx2, vy2, vz2]));
                this.player.position.add(hit.offset.copy().mul(-1 * (1 - p.push_factor * 0.5)));
                //this.player.position.sub(this.gravity.copy().mul(dt));
            }
        }

        for (var bullet_index = 0; bullet_index < this.bullets.length; bullet_index++) {
            var bullet = this.bullets[bullet_index];
            bullet.update(this, dt);

            // if (pushable.dimension != this.player.dimension)
            //    continue;

            var As = bullet.size.copy().mul(this.player.scale);
            var Ap = bullet.position.copy().add(this.gravity.copy().mul(dt));

            var bullet_hit: boolean = this.check_collision_bullet(bullet, dt);
            if (bullet.lifetime > 0 && !bullet_hit) {
                for (var obj_index in this.gameobjects) {
                    var obj = this.gameobjects[obj_index];
                    if (obj.dimension != bullet.dimension && this.next_view_angle != 90)
                        continue;

                    if (bullet.ignore == obj)
                        continue;

                    if (!(obj instanceof LivingObject))
                        continue;

                    var living = <LivingObject>obj;
                    if (!living.attackable)
                        continue;

                    var Bs = obj.size.copy().mul(pushable.scale);
                    var Bp = obj.position.copy();

                    var hit = this.aabb(Ap, As, Bp, Bs);
                    if (hit.intersect) {
                        if (obj instanceof Boss) {
                            var bs = <Boss>obj;
                            if (bs.stage == BossStage.Sword) {
                                var speed = bullet.velocity.length();
                                bullet.velocity.x = -Math.sign(bullet.velocity.x);
                                bullet.velocity.y = 2.0 * (Math.random() - 0.5);
                                bullet.velocity.normalize();
                                bullet.velocity.mul(speed);

                                bullet.weapon = new BulletBounce(itemmap_texture, bullet.weapon);
                                bullet.ignore = obj;

                                wall_hit_sound.play();

                                continue;
                            }
                        }

                        if (obj instanceof Player) {
                            var pl = <Player>obj;
                            if (pl.animation_state == PlayerAnimationState.Attack && pl.weapon instanceof LastSword) {
                                var speed = bullet.velocity.length();
                                bullet.velocity.x = -Math.sign(bullet.velocity.x);
                                bullet.velocity.y = 2.0 * (Math.random() - 0.5);
                                bullet.velocity.normalize();
                                bullet.velocity.mul(speed);

                                bullet.weapon = new BulletBounce(itemmap_texture, bullet.weapon);
                                bullet.ignore = obj;

                                wall_hit_sound.play();

                                continue;
                            }
                        }

                        var distance = hit.offset.length2() / Bs.length2();
                        var move = hit.normal.copy().mul(0.1 * bullet.weapon.push(obj));
                        move.z *= 0;
                        obj.velocity.add(move);

                        living.do_damage(bullet.weapon.damage(obj));
                        hurt_sound.play();

                        this.blood_particle_emitter.position = bullet.position.copy().add(bullet.velocity.copy().mul(dt));
                        this.blood_particle_emitter.spawn_x(engine.time, 0.0, World.SPAWN_BLOOD_COUNT);

                        bullet_hit = true;
                        break;
                    }
                }
            } else {
                bullet_hit = true;
            }

            if (bullet_hit) {
                this.bullets.splice(bullet_index, 1);
                bullet_index--;
            }
        }

        var current_dimension = this.dimensions[this.player.dimension];
        if (current_dimension != null) {
            for (var b in current_dimension.background_textures) {
                var tex = current_dimension.background_textures[b];
                tex.animation.update(engine.time, dt)
            }
        }
    }

    add_bullet(bullet: Bullet) {
        this.bullets.push(bullet);
    }

    push_particles(temp: GameObject[]) {
        this.push_particle_emitter(this.blood_particle_emitter, temp);
        this.push_particle_emitter(this.dimension_particle_emitter, temp);
        this.push_particle_emitter(this.ex_particle_emitter, temp);
   
    }

    private push_particle_emitter(pm: ParticleEmitter, temp: GameObject[]) {
        for (var index in pm.particles) {
            var particle = pm.particles[index];
            if (particle.dead) continue;

            var obj = new ParticleObject(particle.texture);
            obj.position = particle.position;
            obj.scale = particle.scale;
            obj.color = particle.color;
            obj.velocity = particle.velocity;
            obj.rotation = particle.rotation;
            obj.update(this, 0.0);

            this.check_collision(obj, engine.fixed_update_fps);
            temp.push(obj);
        }
    }

    private aabb(Ap: vec3, As: vec3, Bp: vec3, Bs: vec3):
        { intersect: boolean; position: vec3; offset: vec3; normal: vec3; }
    {
        var hit = {
            intersect: false,
            position: new vec3([0, 0, 0]),
            offset: new vec3([0, 0, 0]),
            normal: new vec3([0, 0, 0])
        };

        var dx = Bp.x - Ap.x;
        var px = (Bs.x + As.x) * 0.5 - Math.abs(dx);
        if (px <= 0.005) return hit;

        var dy = Bp.y - Ap.y;
        var py = (Bs.y + As.y) * 0.5 - Math.abs(dy);
        if (py <= -0.05)
            return hit;

        var dz = Bp.z - Ap.z;
        var pz = (Bs.z + As.z) * 0.5 - Math.abs(dz);
        if (pz <= 0.005) return hit;

        hit.intersect = true;
        if (px < py && px < pz) {
            var sx = Math.sign(dx);
            hit.offset.x = px * sx;
            hit.normal.x = sx;
            hit.position.x = Ap.x + As.x * sx * 0.5;
            hit.position.y = Ap.y;
            hit.position.z = Ap.z;
        } else if (pz < py && pz < px) {
            var sz = Math.sign(dz);
            hit.offset.z = pz * sz;
            hit.normal.z = sz;
            hit.position.x = Ap.x;
            hit.position.y = Ap.y;
            hit.position.z = Ap.z + As.z * sz * 0.5;
        } else {
            var sy = Math.sign(dy);
            hit.offset.y = py * sy;
            hit.normal.y = sy;
            hit.position.x = Ap.x;
            hit.position.y = Ap.y + As.y * sy * 0.5;
            hit.position.z = Ap.z;
        }

        return hit;
    }

    check_collision_world(obj: GameObject, dt: number) {
        var min_dim = 0;
        var max_dim = 0;

        for (var dim_index in this.dimensions) {
            var dim = this.dimensions[dim_index];
            min_dim = Math.min(min_dim, dim.index);
            max_dim = Math.max(max_dim, dim.index);
        }

        var max_box_position = new vec3([0.5, 0, max_dim + 1]);
        var min_box_position = new vec3([0.5, 0, min_dim - 1]);

        var max_box_size = (new vec3([1000, 1000, 1])).mul(TILE_SIZE);
        var min_box_size = (new vec3([1000, 1000, 1])).mul(TILE_SIZE);

        var As = obj.size.copy().mul(obj.scale);
        var Ap = obj.position.copy();

        var hit1 = this.aabb(Ap, As, max_box_position, max_box_size);
        if (hit1.intersect) {
            if (hit1.normal.y > 0) obj.on_ground = true;

            var vx = (hit1.normal.x != 0 && Math.sign(hit1.normal.x) == Math.sign(obj.velocity.x)) ? 0 : 1;
            var vy = (hit1.normal.y != 0 && Math.sign(hit1.normal.y) == Math.sign(obj.velocity.y)) ? 0 : 1;
            var vz = (hit1.normal.z != 0 && Math.sign(hit1.normal.z) == Math.sign(obj.velocity.z)) ? 0 : 1;
            obj.velocity.mul(new vec3([vx, vy, vz]));
            obj.position.add(new vec3([-hit1.offset.x, -hit1.offset.y, -hit1.offset.z]));
        }

        var hit2 = this.aabb(Ap, As, min_box_position, min_box_size);
        if (hit2.intersect) {
            if (hit2.normal.y > 0) obj.on_ground = true;

            var vx = (hit2.normal.x != 0 && Math.sign(hit2.normal.x) == Math.sign(obj.velocity.x)) ? 0 : 1;
            var vy = (hit2.normal.y != 0 && Math.sign(hit2.normal.y) == Math.sign(obj.velocity.y)) ? 0 : 1;
            var vz = (hit2.normal.z != 0 && Math.sign(hit2.normal.z) == Math.sign(obj.velocity.z)) ? 0 : 1;
            obj.velocity.mul(new vec3([vx, vy, vz]));
            obj.position.add(new vec3([-hit2.offset.x, -hit2.offset.y, -hit2.offset.z]));
        }
    }

    check_collision_bullet(obj: Bullet, dt: number): boolean {
        var current_tile_x = ((obj.position.x) / TILE_SIZE) | 0;
        var current_tile_y = ((obj.position.y) / TILE_SIZE) | 0;

        // TODO: Test the world bounds

        var max_x = (((obj.position.x + obj.size.x * 0.5) / TILE_SIZE) | 0) + 1 - current_tile_x;
        var min_x = (((obj.position.x - obj.size.x * 0.5) / TILE_SIZE) | 0) - 1 - current_tile_x;
        var max_y = (((obj.position.y + obj.size.y * 0.5) / TILE_SIZE) | 0) + 1 - current_tile_y;
        var min_y = (((obj.position.y - obj.size.y * 0.5) / TILE_SIZE) | 0) - 1 - current_tile_y;


        for (var z = -1; z < 2; z++) {
            var map_2d = this.map[obj.dimension + z];
            if (map_2d != null) {
                for (var y = min_y; y < max_y + 1; y++) {
                    var map_1d = map_2d[current_tile_y + y];
                    if (map_1d != null) {
                        for (var x = min_x; x < max_x + 1; x++) {
                            var tile_id = map_1d[current_tile_x + x];
                            if (tile_id != null) {
                                var tile = TileData.get(tile_id);
                                if (!tile.has_collision) continue;

                                var Bs = tile.collision.copy();
                                var Bp = new vec3([(current_tile_x + x) * TILE_SIZE + 0.5, (current_tile_y + y) * TILE_SIZE, (-(obj.dimension + z)) * TILE_SIZE]);
                                Bp.add(tile.offset);

                                var As = obj.size.copy();
                                var Ap = obj.position.copy();

                                if (tile_id == TileData.SLOPE_0r1 || tile_id == TileData.SLOPE_1r1) {
                                    var dx = (Bp.x - Bs.x * 0.5) - (Ap.x + As.x * 0.5);
                                    //dx -= (1.0 / 16.0) * TILE_SIZE; // NOTE: Shift up it a litle bit because we are currently using the center point of the object
                                    dx = Math.min(Math.max(-0.15, -dx * 1.00), 1.0);
                                    Bp.y -= dx * Bs.y - TILE_SIZE;
                                } else if (tile_id == TileData.SLOPE_0r3 || tile_id == TileData.SLOPE_1r3) {
                                    var dx = (Bp.x + Bs.x * 0.5) - (Ap.x - As.x * 0.5);
                                    //dx += (9.0 / 16.0) * TILE_SIZE; // NOTE: Shift up it a litle bit because we are currently using the center point of the object
       
                                    dx = Math.min(Math.max(0.0, dx * 1.00), 1.0);
                                    Bp.y -= dx * Bs.y - TILE_SIZE;
                                }

                                var hit = this.aabb(Ap, As, Bp, Bs);
                                if (hit.intersect) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    check_collision(obj: GameObject, dt: number) {    
        var current_tile_x = ((obj.position.x) / TILE_SIZE) | 0;
        var current_tile_y = ((obj.position.y) / TILE_SIZE) | 0;

        // TODO: Test the world bounds

        var max_x = (((obj.position.x + obj.size.x * 0.5) / TILE_SIZE) | 0) + 1 - current_tile_x;
        var min_x = (((obj.position.x - obj.size.x * 0.5) / TILE_SIZE) | 0) - 1 - current_tile_x;
        var max_y = (((obj.position.y + obj.size.y * 0.5) / TILE_SIZE) | 0) + 1 - current_tile_y;
        var min_y = (((obj.position.y - obj.size.y * 0.5) / TILE_SIZE) | 0) - 1 - current_tile_y;


        for (var z = -1; z < 2; z++) {
            var map_2d = this.map[obj.dimension + z];
            if (map_2d != null) {
                for (var y = min_y; y < max_y + 1; y++) {
                    var map_1d = map_2d[current_tile_y + y];
                    if (map_1d != null) {
                        for (var x = min_x; x < max_x + 1 ; x++) {
                            var tile_id = map_1d[current_tile_x + x];
                            if (tile_id != null) {
                                var tile = TileData.get(tile_id);
                                if (!tile.has_collision) continue;

                                var Bs = tile.collision.copy();
                                var Bp = new vec3([(current_tile_x + x) * TILE_SIZE + 0.5, (current_tile_y + y) * TILE_SIZE, (-(obj.dimension + z)) * TILE_SIZE]);
                                Bp.add(tile.offset);

                                var As = obj.size.copy().mul(obj.scale);
                                var Ap = obj.position.copy();

                                if (tile_id == TileData.SLOPE_0r1 || tile_id == TileData.SLOPE_1r1) {
                                    var dx = (Bp.x - Bs.x * 0.5) - (Ap.x + As.x * 0.5);
                                    //dx -= (1.0 / 16.0) * TILE_SIZE; // NOTE: Shift up it a litle bit because we are currently using the center point of the object
                                    dx = Math.min(Math.max(-0.15, -dx * 1.00), 1.0);             
                                    Bp.y -= dx * Bs.y - TILE_SIZE; 
                                } else if (tile_id == TileData.SLOPE_0r3 || tile_id == TileData.SLOPE_1r3) {
                                    var dx = (Bp.x + Bs.x * 0.5) - (Ap.x - As.x * 0.5);
                                    //dx += (9.0 / 16.0) * TILE_SIZE; // NOTE: Shift up it a litle bit because we are currently using the center point of the object
       
                                    dx = Math.min(Math.max(0.0, dx * 1.00), 1.0);
                                    Bp.y -= dx * Bs.y - TILE_SIZE;
                                }

                                var hit = this.aabb(Ap, As, Bp, Bs);
                                if (hit.intersect) {
                                    if (hit.normal.y > 0) obj.on_ground = true;

                                    var vx = (hit.normal.x != 0 && Math.sign(hit.normal.x) == Math.sign(obj.velocity.x)) ? 0 : 1;
                                    var vy = (hit.normal.y != 0 && Math.sign(hit.normal.y) == Math.sign(obj.velocity.y)) ? 0 : 1;
                                    var vz = (hit.normal.z != 0 && Math.sign(hit.normal.z) == Math.sign(obj.velocity.z)) ? 0 : 1;
                                    obj.velocity.mul(new vec3([vx, vy, vz]));
                                    obj.position.add(new vec3([-hit.offset.x, -hit.offset.y, -hit.offset.z]));
                                }
                            }
                        }
                    }
                }
            }
        }


    }

    add_object(obj: GameObject) {
        this.gameobjects.push(obj);

        if ((<any>obj).push_factor != undefined) {
            this.pushables.push(<Pushable><any>obj);
        }
    }

    remove_object(obj: GameObject) {
        var i = this.gameobjects.indexOf(obj);
        if (i > -1) {
            this.gameobjects.splice(i, 1);
        }

        i = this.pushables.indexOf(<Pushable>obj);
        if (i > -1) {
            this.pushables.splice(i, 1);
        }
    }

    enemy_attack_weapon(time: number, dt: number, enemy: Enemy, weapon: Weapon, use_z: boolean = false) {
        var dir = enemy.direction ? -1 : 1;
        var Bs = new vec3([10 / 16, 1 / 16, 10 / 16]);
        var Bp = (new vec3([4 / 16, 0, 4 / 16]))
            .add(Bs.copy().mul(0.4))
            .mul(this.view_normal)
            .mul(dir)
            .add(enemy.position);


        var Os = this.player.size.copy();
        var Op = this.player.position.copy();

        var hit = this.aabb(Op, Os, Bp, Bs);
        if (hit.intersect) {
            var force = weapon.push(this.player);
            var d = enemy.position.copy().sub(Op);
            d.normalize();
            d.mul(-force);

            d.y = -Math.max(0.0, Math.min(4.0, -d.y));
            d.mul(this.view_normal);
            if (!use_z) d.mul(this.view_inverse_normal);

            this.player.velocity.add(d);

            this.player.do_damage(weapon.damage(this.player));

            this.blood_particle_emitter.position = Op;
            this.blood_particle_emitter.spawn_x(time, dt, World.SPAWN_BLOOD_COUNT);
        }
        
    }

    player_attack_weapon(time: number, dt: number, player: Player, weapon: Weapon) {
        var dir = this.player.direction ? -1 : 1;
        var Bs = new vec3([10 / 16, 1 / 16, 10 /16]); 
        var Bp = (new vec3([4 / 16, 0, 4 / 16]))
            .add(Bs.copy().mul(0.4))
            .mul(this.view_normal)
            .mul(dir)
            .add(this.player.position);

        for (var i in this.gameobjects) {
            var obj = this.gameobjects[i];
            if (obj === this.player || (obj.dimension != this.player.dimension && this.next_view_angle != 90))
                continue;

            if (!(obj instanceof LivingObject))
                continue;

            var living = <LivingObject>obj;
            if (!living.attackable)
                continue;

            var Os = obj.size.copy();
            var Op = obj.position.copy();

            var hit = this.aabb(Op, Os, Bp, Bs);
            if (hit.intersect) {
                var force = weapon.push(obj);
                var d = this.player.position.copy().sub(Op);
                d.normalize();
                d.mul(-force);

                d.y = -Math.max(0.0, Math.min(4.0, -d.y));
                d.mul(this.view_normal);
                obj.velocity.add(d);
       
                var damage = weapon.damage(obj);
                if (obj instanceof Boss) {
                    var bs = <Boss>obj;
                    if(bs.stage != BossStage.Sword)
                        damage *= 0.2;
                }

                living.do_damage(damage);

                this.blood_particle_emitter.position = Op;
                this.blood_particle_emitter.spawn_x(time, dt, World.SPAWN_BLOOD_COUNT);
            }
        }
    }

    player_change_dimension(time: number, dt: number) {
        this.dimension_particle_emitter.velocity = this.player.velocity.copy();
        this.dimension_particle_emitter.relative_random_position = new vec3([this.player.size.x * 0.5, this.player.size.y * 0.25, this.player.size.z * 0.5]);
        this.dimension_particle_emitter.position = this.player.position;
        this.dimension_particle_emitter.spawn_x(time, dt, World.SPAWN_DIMENSION_COUNT);
    }

    damage_player(damage: number) {
        this.player.do_damage(damage);

        this.blood_particle_emitter.position = this.player.position;
        this.blood_particle_emitter.spawn_x(engine.time, 0.0, World.SPAWN_BLOOD_COUNT);
    }
}