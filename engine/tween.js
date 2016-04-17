var TweenManager = (function () {
    function TweenManager() {
        this._tweens = [];
    }
    TweenManager.prototype.update = function (time, dt) {
        var i = 0;
        while (i < this._tweens.length) {
            if (this._tweens[i].update(time, dt)) {
                i++;
            }
            else {
                this._tweens.splice(i, 1);
            }
        }
        return true;
    };
    TweenManager.prototype.add = function (t) {
        this._tweens.push(t);
    };
    TweenManager.prototype.remove = function (t) {
        var i = this._tweens.indexOf(t);
        if (i !== -1) {
            this._tweens.splice(i, 1);
        }
    };
    return TweenManager;
})();
var _global_tweener = new TweenManager();
var Tween = (function () {
    function Tween(object) {
        this.tm = _global_tweener;
        this.start_time = 0;
        this.duration = 0;
        this.delay_time = 0;
        this.running = false;
        this.interpolation_function = Interpolation.linear;
        this.easing_function = Easing.linear;
        this.start_values = {};
        this.end_values = {};
        this.chain = [];
        this.on_update = null;
        this.on_complete = null;
        this.object = object;
        for (var field in object) {
            if (typeof (object[field]) === "number")
                this.start_values[field] = parseFloat(object[field]);
        }
    }
    Tween.prototype.to = function (properties, duration) {
        if (duration !== undefined) {
            this.duration = duration;
        }
        for (var field in properties) {
            if (typeof (properties[field]) === "number")
                this.end_values[field] = parseFloat(properties[field]);
        }
        return this;
    };
    Tween.prototype.delay = function (d) {
        this.delay_time = d;
        return this;
    };
    Tween.prototype.ease = function (f) {
        this.easing_function = f;
        return this;
    };
    Tween.prototype.on = function (func) {
        this.on_update = func;
        return this;
    };
    Tween.prototype.complete = function (base, func) {
        this.on_complete = func.bind(base);
        return this;
    };
    Tween.prototype.start = function (time) {
        this.tm.add(this);
        this.start_time = time;
        this.start_time += this.delay_time;
        // NOTE: Update the start values
        for (var property in this.end_values) {
            this.start_values[property] = this.object[property];
        }
        this.running = true;
        return this;
    };
    Tween.prototype.stop = function () {
        this.tm.remove(this);
        this.running = false;
        return this;
    };
    Tween.prototype.update = function (time, dt) {
        if (!this.running)
            return false;
        if (time < this.start_time)
            return true;
        var elapsed = (time - this.start_time) / this.duration;
        elapsed = elapsed > 1 ? 1 : elapsed;
        var value = this.easing_function(elapsed);
        for (var property in this.end_values) {
            var s = this.start_values[property];
            var e = this.end_values[property];
            this.object[property] = this.interpolation_function(s, e, value);
        }
        if (this.on_update !== null) {
            this.on_update.call(this.object, value);
        }
        if (elapsed == 1) {
            if (this.on_complete !== null) {
                this.on_complete(this);
            }
            for (var c in this.chain) {
                this.chain[c].start(time);
            }
            this.stop();
        }
        return true;
    };
    return Tween;
})();
var Easing = (function () {
    function Easing() {
    }
    Easing.linear = function (k) {
        return k;
    };
    Easing.quadratic_in = function (k) {
        return k * k;
    };
    Easing.quadratic_out = function (k) {
        return k * (2 - k);
    };
    Easing.quadratic_inout = function (k) {
        if ((k *= 2) < 1)
            return 0.5 * k * k;
        return -0.5 * (--k * (k - 2) - 1);
    };
    return Easing;
})();
var Interpolation = (function () {
    function Interpolation() {
    }
    Interpolation.linear = function (a, b, t) {
        return a + (b - a) * t;
    };
    return Interpolation;
})();
//# sourceMappingURL=tween.js.map