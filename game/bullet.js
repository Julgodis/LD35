var Bullet = (function () {
    function Bullet() {
        this.lifetime = 5000.0;
        this.ignore = null;
    }
    Bullet.prototype.update = function (world, dt) {
        this.lifetime -= dt;
        this.position.add(this.velocity.copy().mul(dt));
    };
    return Bullet;
})();
//# sourceMappingURL=bullet.js.map