var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Weapon = (function (_super) {
    __extends(Weapon, _super);
    function Weapon(item_id, texture) {
        _super.call(this, item_id, texture);
        this.rotation = 0;
        this.offset = new vec2([0, 0]);
        this.scale = new vec3([1, 1, 1]);
    }
    Weapon.prototype.damage = function (obj) { return 0; };
    Weapon.prototype.push = function (obj) { return 0; };
    return Weapon;
})(Item);
var FirstSword = (function (_super) {
    __extends(FirstSword, _super);
    function FirstSword(texture) {
        _super.call(this, 0, texture);
        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }
    FirstSword.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    FirstSword.prototype.damage = function (obj) { return 18 + Math.random() * 4; };
    FirstSword.prototype.push = function (obj) { return 5; };
    return FirstSword;
})(Weapon);
var LastSword = (function (_super) {
    __extends(LastSword, _super);
    function LastSword(texture) {
        _super.call(this, 1, texture);
        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }
    LastSword.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    LastSword.prototype.damage = function (obj) { return (4 + Math.random()) * 8; };
    LastSword.prototype.push = function (obj) { return 10; };
    return LastSword;
})(Weapon);
var BulletBounce = (function (_super) {
    __extends(BulletBounce, _super);
    function BulletBounce(texture, prev) {
        _super.call(this, 0, texture);
        this.prev = prev;
        this.scale = new vec3([0.0, 0.0, 0.0]);
        this.rotation = 0;
    }
    BulletBounce.prototype.damage = function (obj) { return 7 * this.prev.damage(obj); };
    BulletBounce.prototype.push = function (obj) { return 2 * this.prev.damage(obj); };
    return BulletBounce;
})(Weapon);
var BossCanon = (function (_super) {
    __extends(BossCanon, _super);
    function BossCanon(texture) {
        _super.call(this, 0, texture);
        this.scale = new vec3([0.0, 0.0, 0.0]);
        this.rotation = 0;
    }
    BossCanon.prototype.damage = function (obj) { return 24 + 7 * Math.random(); };
    BossCanon.prototype.push = function (obj) { return 20; };
    return BossCanon;
})(Weapon);
var BossSword = (function (_super) {
    __extends(BossSword, _super);
    function BossSword(texture) {
        _super.call(this, 5, texture);
        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }
    BossSword.prototype.damage = function (obj) { return 10 + 6 * Math.random(); };
    BossSword.prototype.push = function (obj) { return 10; };
    return BossSword;
})(Weapon);
var Knight1Sword = (function (_super) {
    __extends(Knight1Sword, _super);
    function Knight1Sword(texture) {
        _super.call(this, 3, texture);
        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }
    Knight1Sword.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    Knight1Sword.prototype.damage = function (obj) { return 8; };
    Knight1Sword.prototype.push = function (obj) { return 1; };
    return Knight1Sword;
})(Weapon);
var Knight2Sword = (function (_super) {
    __extends(Knight2Sword, _super);
    function Knight2Sword(texture) {
        _super.call(this, 3, texture);
        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }
    Knight2Sword.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    Knight2Sword.prototype.damage = function (obj) { return 13; };
    Knight2Sword.prototype.push = function (obj) { return 15; };
    return Knight2Sword;
})(Weapon);
var RobotLaser = (function (_super) {
    __extends(RobotLaser, _super);
    function RobotLaser(texture) {
        _super.call(this, 4, texture);
        this.scale = new vec3([0.8, 0.8, 0.8]);
        this.rotation = 0;
    }
    RobotLaser.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(this.item_id * 4, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    RobotLaser.prototype.damage = function (obj) { return 7; };
    RobotLaser.prototype.push = function (obj) { return 5; };
    return RobotLaser;
})(Weapon);
//# sourceMappingURL=weapon.js.map