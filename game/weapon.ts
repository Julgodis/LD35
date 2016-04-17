class Weapon extends Item {
    offset: vec2;
    scale: vec3;
    rotation: number;

    constructor(item_id: number, texture: Texture) {
        super(item_id, texture);

        this.rotation = 0;
        this.offset = new vec2([0, 0]);
        this.scale = new vec3([1, 1, 1]);
    }

    damage(obj: GameObject): number { return 0; }
    push(obj: GameObject): number { return 0; }
}

class FirstSword extends Weapon {
    constructor(texture: Texture) {
        super(0, texture);

        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }

    damage(obj: GameObject): number { return 18 + Math.random() * 4; }
    push(obj: GameObject): number { return 5; }
} 

class LastSword extends Weapon {
    constructor(texture: Texture) {
        super(1, texture);

        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }

    damage(obj: GameObject): number { return (4 + Math.random()) * 8; }
    push(obj: GameObject): number { return 10; }
} 

class BulletBounce extends Weapon {
    prev: Weapon;

    constructor(texture: Texture, prev: Weapon) {
        super(0, texture);

        this.prev = prev;
        this.scale = new vec3([0.0, 0.0, 0.0]);
        this.rotation = 0;
    }

    damage(obj: GameObject): number { return 7 * this.prev.damage(obj); }
    push(obj: GameObject): number { return 2 * this.prev.damage(obj); }
}

class BossCanon extends Weapon {
    constructor(texture: Texture) {
        super(0, texture);

        this.scale = new vec3([0.0, 0.0, 0.0]);
        this.rotation = 0;
    }

    damage(obj: GameObject): number { return 24 + 7 * Math.random(); }
    push(obj: GameObject): number { return 20; }
}

class BossSword extends Weapon {
    constructor(texture: Texture) {
        super(5, texture);

        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }

    damage(obj: GameObject): number { return 10 + 6 * Math.random(); }
    push(obj: GameObject): number { return 10; }
}

class Knight1Sword extends Weapon {
    constructor(texture: Texture) {
        super(3, texture);

        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }

    damage(obj: GameObject): number { return 8; }
    push(obj: GameObject): number { return 1; }
}

class Knight2Sword extends Weapon {
    constructor(texture: Texture) {
        super(3, texture);

        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }

    damage(obj: GameObject): number { return 13; }
    push(obj: GameObject): number { return 15; }
}

class RobotLaser extends Weapon {
    constructor(texture: Texture) {
        super(4, texture);

        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }

    initialize_animations() {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    }

    damage(obj: GameObject): number { return 7; }
    push(obj: GameObject): number { return 5; }
}