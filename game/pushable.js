var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PushBlock = (function (_super) {
    __extends(PushBlock, _super);
    function PushBlock(texture, scene) {
        _super.call(this, texture);
        this.scene = scene;
        this.size = new vec3([0.8, 2.0, 4 / 16.0]);
        this.push_factor = 1.0;
        this.scale = 1;
        this.push_me = null;
    }
    PushBlock.prototype.update = function (world, dt) {
        _super.prototype.update.call(this, world, dt);
        var delta = this.position.copy().sub(world.player.position);
        var distance = delta.length2();
        if (distance < Math.pow(2, 2) && this.push_me == null) {
            this.push_me = new ChatBubble(world.engine, new vec2([150, 0]));
            this.push_me.text = "Push?";
            this.scene.add_chat_command(this.push_me, this, null);
        }
    };
    return PushBlock;
})(GameObject);
//# sourceMappingURL=pushable.js.map