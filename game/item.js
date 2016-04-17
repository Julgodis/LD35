var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Item = (function () {
    function Item(item_id, texture) {
        this.item_id = item_id;
        this.animation = new AnimationManager(texture, 16, 16);
        this.animation.complete_interface = this;
        this.initialize_animations();
    }
    Item.prototype.initialize_animations = function () { };
    Item.prototype.animation_complete = function (name) { };
    return Item;
})();
var ItemObject = (function (_super) {
    __extends(ItemObject, _super);
    function ItemObject(texture) {
        _super.call(this, texture);
        this.animation = new AnimationManager(this.texture, 16, 16);
        this.animation.complete_interface = this;
        this.initialize_animations();
        this.start_time = -1;
    }
    ItemObject.prototype.initialize_animations = function () { };
    ItemObject.prototype.animation_complete = function (name) { };
    ItemObject.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
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
    };
    ItemObject.prototype.get_item = function () { return null; };
    return ItemObject;
})(GameObject);
var WeaponObject = (function (_super) {
    __extends(WeaponObject, _super);
    function WeaponObject(texture, weapon) {
        this.weapon = weapon;
        _super.call(this, texture);
        this.size = new vec3([0.5, 1.0, 0.5]);
        this.scale = 0.8;
    }
    WeaponObject.prototype.initialize_animations = function () {
        var temp = this.weapon.animation;
        // NOTE: (HACK) Copy the animations from the item
        this.weapon.animation = this.animation;
        this.weapon.initialize_animations();
        this.weapon.animation = temp;
    };
    WeaponObject.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
    };
    WeaponObject.prototype.get_item = function () {
        return this.weapon;
    };
    return WeaponObject;
})(ItemObject);
//
var TimeShifter = (function (_super) {
    __extends(TimeShifter, _super);
    function TimeShifter(item_id, texture) {
        _super.call(this, item_id, texture);
    }
    TimeShifter.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(8, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    return TimeShifter;
})(Item);
var TimeShifterObject = (function (_super) {
    __extends(TimeShifterObject, _super);
    function TimeShifterObject(texture) {
        _super.call(this, texture);
        this.size = new vec3([0.5, 1.0, 0.5]);
        this.scale = 0.5;
    }
    TimeShifterObject.prototype.initialize_animations = function () {
        this.animation.add_animation("basic", Animation.fsequence(8, 4), Animation.ft_repate(4, Animation.FrameTime * 10), true);
        this.animation.play("basic");
    };
    TimeShifterObject.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
        this.color.r = Math.sin(world.engine.time / 200.0) * 0.2 + 0.8;
        this.color.g = Math.cos(world.engine.time / 200.0) * 0.2 + 0.8;
        this.color.b = (this.color.r + this.color.g) * 0.5;
        this.color.a = Math.sin(world.engine.time / 200.0) * 0.1 + 0.9;
    };
    TimeShifterObject.prototype.get_item = function () {
        return new TimeShifter(0, this.texture);
    };
    return TimeShifterObject;
})(ItemObject);
//# sourceMappingURL=item.js.map