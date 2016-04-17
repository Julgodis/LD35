class Bullet {
    position: vec3
    size: vec3;
    velocity: vec3
    lifetime: number;
    texture: Texture;

    dimension: number;
    weapon: Weapon;

    ignore: any;

    constructor() {
        this.lifetime = 5000.0;
        this.ignore = null;
    }

    update(world: World, dt: number): void {
        this.lifetime -= dt;
        this.position.add(this.velocity.copy().mul(dt));
    }
}
