class GameObject {
    texture: Texture;

    position: vec3;
    velocity: vec3;
    dimension: number;

    size: vec3;
    direction: boolean;
    sort_bias: number;

    on_ground: boolean;
    scale: number;
    rotation: number;
    color: vec4;

    constructor(texture: Texture) {
        this.position = new vec3([0, 0, 0]);
        this.velocity = new vec3([0, 0, 0]);
        this.size = new vec3([1, 1, 1]);
        this.dimension = 0;
        this.texture = texture;
        this.direction = false;
        this.sort_bias = 0;
        this.on_ground = false;
        this.scale = 1;
        this.color = new vec4([1, 1, 1, 1]);
        this.rotation = 0;
    }

    update(world: World, dt: number): void {
        this.dimension = (-(this.position.z - this.size.z * 1.0) / TILE_SIZE) | 0;
    }
}

class LivingObject extends GameObject {
    hp: number;
    hp_max: number;

    alive: boolean;
    damage_indicator: number;

    attackable: boolean;

    constructor(texture: Texture) {
        super(texture);

        this.hp = 100;
        this.hp_max = 100;
        this.alive = true;
        this.damage_indicator = 0;
        this.attackable = false;
    }

    update(world: World, dt: number): void {
        super.update(world, dt);

        this.damage_indicator -= dt;
        if (this.damage_indicator < 0)
            this.damage_indicator = 0;

        if (this.hp != this.hp_max) {
            var indictor = (this.hp / this.hp_max) * 0.8 + 0.2;
            this.color = (new vec4([
                1,
                indictor + 0.2 - this.damage_indicator * 0.1,
                indictor + 0.2 - this.damage_indicator * 0.1,
                1]));

            if (this.color.g < 0) this.color.g = 0;
            if (this.color.b < 0) this.color.b = 0;
            if (this.color.g > 1) this.color.g = 1;
            if (this.color.b > 1) this.color.b = 1;
        }

        if (!this.alive) {
            this.died();
            world.remove_object(this)
        }
    }

    do_damage(damage: number) {
        hurt_sound.play();
        this.hp -= damage;

        if (this.hp <= 0) {
            this.alive = false;
            this.hp = 0;
        }
    }

    damager(): void {
        this.damage_indicator += 1.0;
        this.damage_indicator = Math.min(2.0, this.damage_indicator);
    }

    died(): void { }
}

class AnimatedObject extends LivingObject implements AnimationComplete {
    animation: AnimationManager;
    constructor(texture: Texture) {
        super(texture);
      
        this.animation = new AnimationManager(this.texture, 16, 16);
        this.animation.complete_interface = this;
        this.initialize_animations();
    }

    initialize_animations() { }
    animation_complete(name: string): void { }

    died(): void { }

    update(world: World, dt: number): void {
        super.update(world, dt);
        this.animation.update(engine.time / 1000.0, dt);
    }
}

class ParticleObject extends GameObject {
    constructor(texture: Texture) {
        super(texture);
    }

    update(world: World, dt: number): void {
        super.update(world, dt);
    }
}
