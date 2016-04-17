class Particle {
    position: vec3;
    velocity: vec3;
    color: vec4;
    color1: vec4;
    color2: vec4;
    rotation: number;
    rotation_velocity: number;
    scale: number;
    scale_velocity: number;

    texture: Texture;
    dead: boolean;

    life: number;
    lifetime: number;
}

interface OnGroundCallback {
    (particle: Particle): void;
}

var particle_setting = 1.0;
class ParticleEmitter {
    particles: Particle[];
    dead: number[];

    spawn_rate: number; // -1, all at the same time
    spawn_count: number;
    spawn_max: number;
    lifetime: number;
    gravity_effect: number = 1;

    size: vec3;

    position: vec3;
    relative_position: vec3;
    relative_random_position: vec3;

    color1: vec4;
    color2: vec4;
    random_color1: vec4;
    random_color2: vec4;

    velocity: vec3;
    random_velocity: vec3;

    rotation: number;
    random_rotation: number;
    rotation_velocity: number;
    random_rotation_velocity: number;

    scale: number;
    random_scale: number;
    scale_velocity: number;
    random_scale_velocity: number;

    textures: Texture[];

    constructor(size: vec3) {
        this.size = size;
        this.particles = [];
        this.dead = [];

        this.relative_position = new vec3([0, 0, 0]);
        this.relative_random_position = new vec3([0, 0, 0]);
        this.color1 = new vec4([1, 1, 1, 1]);
        this.color2 = new vec4([1, 1, 1, 1]);
        this.random_color1 = new vec4([0, 0, 0]);
        this.random_color2 = new vec4([0, 0, 0]);
        this.velocity = new vec3([0, 0, 0]);
        this.random_velocity = new vec3([0, 0, 0]);
        this.rotation = 0;
        this.random_rotation = 0;
        this.rotation_velocity = 0;
        this.random_rotation_velocity = 0;
        this.scale = 1;
        this.random_scale = 0;
        this.scale_velocity = 0;
        this.random_scale_velocity = 0;
        this.textures = [];

        this.spawn_max = 0;
        this.spawn_count = 0;
        this.spawn_rate = 0;
        this.gravity_effect = 1;
    }

    spawn_particle(time: number, delta: number) {
        var p_position = new vec3([2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)]);
        p_position.mul(this.relative_random_position);
        p_position.add(this.relative_position);
        p_position.add(this.position);

        var p_color1 = new vec4([2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 1])
        p_color1.mul(this.random_color1);
        p_color1.add(this.color1);
        var p_color2 = new vec4([2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 1])
        p_color2.mul(this.random_color2);
        p_color2.add(this.color2);

        var p_velocity = new vec3([2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)])
        p_velocity.mul(this.random_velocity);
        p_velocity.add(this.velocity);

        var p_rotation = Math.random();
        p_rotation *= this.random_rotation;
        p_rotation += this.rotation;
        var p_rotation_velocity = 2 * (Math.random() - 0.5);
        p_rotation_velocity *= this.random_rotation_velocity;
        p_rotation_velocity += this.rotation_velocity;

        var p_scale = Math.random();
        p_scale *= this.random_scale;
        p_scale += this.scale;
        var p_scale_velocity = 2 * (Math.random() - 0.5);
        p_scale_velocity *= this.random_scale_velocity;
        p_scale_velocity += this.scale_velocity;

        var p_texture = this.textures[Math.floor(Math.random() * this.textures.length)];

        if (this.dead.length > 0) {
            var index = this.dead[0];
            this.dead.splice(0, 1);
            this.particles[index].position = p_position;
            this.particles[index].velocity = p_velocity;
            this.particles[index].color = p_color1;
            this.particles[index].color1 = p_color1;
            this.particles[index].color2 = p_color2;
            this.particles[index].texture = p_texture;
            this.particles[index].life = time + this.lifetime;
            this.particles[index].rotation = p_rotation;
            this.particles[index].rotation_velocity = p_rotation_velocity;
            this.particles[index].scale = p_scale;
            this.particles[index].scale_velocity = p_scale_velocity;
            this.particles[index].dead = false;
            this.particles[index].lifetime = this.lifetime;
            this.spawn_count++;
        } else {
            var particle = new Particle();
            particle.position = p_position;
            particle.velocity = p_velocity;
            particle.color = p_color1;
            particle.color1 = p_color1;
            particle.color2 = p_color2;
            particle.texture = p_texture;
            particle.life = time + this.lifetime;
            particle.rotation = p_rotation;
            particle.rotation_velocity = p_rotation_velocity;
            particle.scale = p_scale;
            particle.scale_velocity = p_scale_velocity;
            particle.dead = false;
            particle.lifetime = this.lifetime;

            this.particles[this.spawn_count] = particle;
            this.spawn_count++;
        }
    }

    cleanup() {
        this.particles = [];
        this.dead = [];
    }

    spawn_x(time: number, delta: number, n: number) {
        for (var i = 0; i < n * particle_setting; i++) {
            if (this.spawn_max < 0 || this.spawn_count < this.spawn_max)
                this.spawn_particle(time, delta);
        }
    }

    spawn(time: number, delta: number) {
        if (this.spawn_max < 0 || this.spawn_rate < 0 || this.spawn_count < this.spawn_max) {
            if (this.spawn_rate == 0) return;
            if (this.spawn_rate < 0) {
                for (var i = 0; i < this.spawn_max * particle_setting; i++) {
                    this.spawn_particle(time, delta);
                }
            } else {

            }
        }
    }

    update(time: number, delta: number, gravity: vec3) {
        for (var index in this.particles) {
            var particle = this.particles[index];
            if (particle.dead) continue;

            if (time > particle.life) {
                this.dead.push(index);
                particle.dead = true;
                continue;
            }

            var g = gravity.copy().mul(this.gravity_effect).mul(delta);
            particle.velocity.add(g);
            particle.position.add(particle.velocity.copy().mul(delta));
            particle.velocity.add(particle.velocity.copy().mul(new vec3([1.0, 0.5, 1.0])).mul(-delta));

            particle.rotation += particle.rotation_velocity * delta;
            particle.scale += particle.scale_velocity * delta;
            if (particle.scale <= 0.1)
                particle.scale = 0.1;

            particle.color = lerp_vec4(particle.color1, particle.color2, 1 - (particle.life - time) / particle.lifetime);
        }
    }
}