// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = (function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        });
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
//
var Engine = (function () {
    function Engine(width, height) {
        this.time = 0;
        this.dt = 0;
        this.dt_render = 0;
        this.fps = 0;
        this.fps_counter = 0;
        this.fps_next = 0;
        this.update_next = 0;
        this.fixed_update_fps = 1.0 / 60.0;
        this.update_between = true;
        this.tt = 0;
        this.width = width;
        this.height = height;
        this.do_update = null;
        this.do_render = null;
        var name = "webgl-canvas";
        var newCanvas = document.createElement("canvas");
        newCanvas.setAttribute("id", name);
        newCanvas.setAttribute("width", "" + width);
        newCanvas.setAttribute("height", "" + height);
        newCanvas.innerHTML = "Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.";
        document.body.appendChild(newCanvas);
        try {
            this.canvasElement = document.getElementById(name);
            this.webgl = this.canvasElement.getContext("webgl", { antialias: true, preserveDrawingBuffer: true }) ||
                this.canvasElement.getContext("experimental-webgl", { antialias: true, preserveDrawingBuffer: true });
            this.webgl.viewport(0, 0, width, height);
        }
        catch (e) {
            alert("WebGL: " + e);
        }
        if (!this.webgl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
        this.mouse = new Mouse(this.canvasElement);
        this.keyboard = new Keyboard(this.canvasElement);
        this.browser_render_callback = window.requestAnimationFrame;
        this.setup_opengl();
    }
    Engine.prototype.setup_opengl = function () {
        var gl = this.webgl;
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // NOTE: Load basic shader
        var basic_vertex = document.getElementById("2d-vertex-shader");
        var basic_frag = document.getElementById("2d-fragment-shader");
        this.basic_2d_shader = new Shader(this, basic_vertex.textContent, basic_frag.textContent);
    };
    Engine.prototype.run = function () {
        if (this.do_update == null)
            new Error("No do_update function registered!");
        if (this.do_render == null)
            new Error("No do_render function registered!");
        this.last_update_time = 0;
        this.last_render_time = 0;
        this.fps_next = 1000;
        var temp_engine = this;
        //window.setTimeout(function () { Engine.self_update(temp_engine) }, 1000.0 / 60.0);
        this.browser_render_callback.call(window, function (time) {
            //Engine.self_update(temp_engine);
            Engine.self_render(temp_engine, time);
        });
    };
    Engine.self_update = function (engine) {
        engine.dt = engine.time - engine.last_update_time;
        engine.last_update_time = engine.time;
        engine.keyboard.update();
        engine.update_between = true;
        engine.do_update(engine.dt / 1000.0);
        engine.fps_counter++;
        if (engine.time >= engine.fps_next) {
            engine.fps = engine.fps_counter;
            engine.fps_counter = 0;
            engine.fps_next = engine.time + 1000;
        }
        //window.setTimeout(function () { Engine.self_update(engine) }, 1000.0 / 60.0);
    };
    Engine.self_render = function (engine, time) {
        engine.time = time;
        engine.dt = engine.time - engine.last_update_time;
        engine.last_update_time = engine.time;
        engine.dt_render = engine.time - engine.last_render_time;
        engine.last_render_time = engine.time;
        if (engine.time >= engine.update_next) {
            engine.keyboard.update();
            engine.update_between = true;
            engine.do_update(engine.fixed_update_fps);
            engine.update_next += 1000.0 * engine.fixed_update_fps;
            engine.fps_counter++;
        }
        if (engine.time >= engine.fps_next) {
            engine.fps = engine.fps_counter;
            engine.fps_counter = 0;
            engine.fps_next = engine.time + 1000;
            engine.update_next = engine.time;
        }
        var gl = engine.webgl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        engine.do_render(0, engine.update_between);
        gl.flush();
        engine.update_between = false;
        engine.browser_render_callback.call(window, function (time) {
            //Engine.self_update(engine);
            Engine.self_render(engine, time);
        });
    };
    return Engine;
})();
//# sourceMappingURL=engine.js.map