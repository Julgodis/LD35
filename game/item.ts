class Item implements AnimationComplete {
    item_id: number;
    animation: AnimationManager;
    
    constructor(item_id: number, texture: Texture) {
        this.item_id = item_id;
        this.animation = new AnimationManager(texture, 16, 16);
        this.animation.complete_interface = this;
        this.initialize_animations();
    }

    initialize_animations() { }
    animation_complete(name: string): void { }
}

class ItemObject extends GameObject implements AnimationComplete {
    animation: AnimationManager;
    start_time: number;

    constructor(texture: Texture) {
        super(texture);

        this.animation = new AnimationManager(this.texture, 16, 16);
        this.animation.complete_interface = this;
        this.initialize_animations();

        this.start_time = -1;
    }

    initialize_animations() { }
    animation_complete(name: string): void { }

    update(world: World, dt: number): void {
        super.update(world, dt);
        this.rotation += 0.1 * dt;

        if (world.player.dimension == this.dimension) {
            var d = this.position.copy().sub(world.player.position);
            var l = d.length2();

            if (l < 2 * 2) {
                d.normalize();
                d.mul(dt * 15.0);
                if (this.start_time > 0 && engine.time - this.start_time > 1500.0) {
                    var t = Math.min((engine.time - this.start_time) - 1500, 1000);
                    d.mul((1000 - t) / 1000.0);
                }

                d.mul(new vec3([1, 1, 0]));
                this.velocity.sub(d);
            }

            if (l < 0.5 * 0.5) {
                if (this.start_time < 0)
                    this.start_time = engine.time;

                if (engine.time - this.start_time > 1000.0) {
                    if (world.player.add_item(this.get_item())) {
                        world.remove_object(this);
                    }
                }
            }
        }

        this.animation.update(engine.time / 1000.0, dt);
    }

    get_item(): Item { return null; }
}

class WeaponObject extends ItemObject {
    weapon: Weapon;

    constructor(texture: Texture, weapon: Weapon) {
        this.weapon = weapon;
        super(texture);

        this.size = new vec3([0.5, 1.0, 0.5]);
        this.scale = 0.8;
    }

    initialize_animations() {
        var temp = this.weapon.animation;

        // NOTE: (HACK) Copy the animations from the item
        this.weapon.animation = this.animation;
        this.weapon.initialize_animations();
        this.weapon.animation = temp;
    }

    update(world: World, dt: number): void {
        super.update(world, dt);
    }

    get_item() {
        return this.weapon;
    }
}

//

class TimeShifter extends Item {
    constructor(item_id: number, texture: Texture) {
        super(item_id, texture);
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(8, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }
}

class TimeShifterObject extends ItemObject {
    constructor(texture: Texture) {
        super(texture);

        this.size = new vec3([0.5, 1.0, 0.5]);
        this.scale = 0.5;
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(8, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }

    update(world: World, dt: number): void {
        super.update(world, dt);

        this.color.r = Math.sin(world.engine.time / 200.0) * 0.2 + 0.8;
        this.color.g = Math.cos(world.engine.time / 200.0) * 0.2 + 0.8;
        this.color.b = (this.color.r + this.color.g) * 0.5;
        this.color.a = Math.sin(world.engine.time / 200.0) * 0.1 + 0.9;
    }

    get_item(): Item {
        return new TimeShifter(0, this.texture);
    }
}

