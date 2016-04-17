var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = (function () {
    function GameObject(texture) {
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
    GameObject.prototype.update = function (world, dt) {
        this.dimension = (-(this.position.z - this.size.z * 1.0) / TILE_SIZE) | 0;
    };
    return GameObject;
})();
var LivingObject = (function (_super) {
    __extends(LivingObject, _super);
    function LivingObject(texture) {
        _super.call(this, texture);
        this.hp = 100;
        this.hp_max = 100;
        this.alive = true;
        this.damage_indicator = 0;
        this.attackable = false;
    }
    LivingObject.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
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
            if (this.color.g < 0)
                this.color.g = 0;
            if (this.color.b < 0)
                this.color.b = 0;
            if (this.color.g > 1)
                this.color.g = 1;
            if (this.color.b > 1)
                this.color.b = 1;
        }
        if (!this.alive) {
            this.died();
            world.remove_object(this);
        }
    };
    LivingObject.prototype.do_damage = function (damage) {
        hurt_sound.play();
        this.hp -= damage;
        if (this.hp <= 0) {
            this.alive = false;
            this.hp = 0;
        }
    };
    LivingObject.prototype.damager = function () {
        this.damage_indicator += 1.0;
        this.damage_indicator = Math.min(2.0, this.damage_indicator);
    };
    LivingObject.prototype.died = function () { };
    return LivingObject;
})(GameObject);
var AnimatedObject = (function (_super) {
    __extends(AnimatedObject, _super);
    function AnimatedObject(texture) {
        _super.call(this, texture);
        this.animation = new AnimationManager(this.texture, 16, 16);
        this.animation.complete_interface = this;
        this.initialize_animations();
    }
    AnimatedObject.prototype.initialize_animations = function () { };
    AnimatedObject.prototype.animation_complete = function (name) { };
    AnimatedObject.prototype.died = function () { };
    AnimatedObject.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
        this.animation.update(engine.time / 1000.0, dt);
    };
    return AnimatedObject;
})(LivingObject);
var ParticleObject = (function (_super) {
    __extends(ParticleObject, _super);
    function ParticleObject(texture) {
        _super.call(this, texture);
    }
    ParticleObject.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
    };
    return ParticleObject;
})(GameObject);
//# sourceMappingURL=gameobject.js.map