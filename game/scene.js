var Scene = (function () {
    function Scene(engine, name) {
        this.engine = engine;
        this.name = name;
    }
    Scene.prototype.update = function (time, dt) { };
    Scene.prototype.render = function (time, dt) { };
    return Scene;
})();
//# sourceMappingURL=scene.js.map