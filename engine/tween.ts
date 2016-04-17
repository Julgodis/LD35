class TweenManager {
    _tweens: Tween[];

    constructor() {
        this._tweens = [];
    }

    update(time: number, dt: number) {

        var i = 0;
        while (i < this._tweens.length) {
            if (this._tweens[i].update(time, dt)) {
                i++;
            } else {
                this._tweens.splice(i, 1);
            }
        }

        return true;
    }

    add(t: Tween) {
        this._tweens.push(t);
    }

    remove(t: Tween) {
        var i = this._tweens.indexOf(t);
        if (i !== -1) {
            this._tweens.splice(i, 1);
        }
    }
}

var _global_tweener = new TweenManager();

class Tween {
    tm: TweenManager;
    start_time: number;
    duration: number;
    delay_time: number;
    running: boolean;

    interpolation_function: (a: number, b: number, t: number) => number;
    easing_function: (t: number) => number;

    object: any;
    start_values: any;
    end_values: any;

    chain: Tween[];

    private on_update: (value: number) => void;
    private on_complete: (obj: any) => void;

    constructor(object?: any) {
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
            if (typeof(object[field]) === "number")
                this.start_values[field] = parseFloat(object[field]);
        }
    }

    to(properties: any, duration?: number): Tween {
        if (duration !== undefined) {
            this.duration = duration;
        }

        for (var field in properties) {
            if (typeof (properties[field]) === "number")
                this.end_values[field] = parseFloat(properties[field]);
        }

        return this;
    }

    delay(d: number): Tween {
        this.delay_time = d;
        return this;
    }

    ease(f: (k: number) => number): Tween {
        this.easing_function = f;
        return this;
    }

    on(func: (value: number) => void): Tween {
        this.on_update = func;
        return this;
    }

    complete(base: any, func: (obj: any) => void): Tween {
        this.on_complete = func.bind(base);
        return this;
    }

    start(time: number): Tween {
        this.tm.add(this);
        this.start_time = time;
        this.start_time += this.delay_time;

        // NOTE: Update the start values
        for (var property in this.end_values) {
            this.start_values[property] = this.object[property];
        }

        this.running = true;
        return this;
    }

    stop(): Tween {
        this.tm.remove(this);
        this.running = false;
        return this;
    }

    update(time: number, dt: number): boolean {
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
    }
}

class Easing {
    static linear(k: number): number {
        return k;
    }

    static quadratic_in(k: number): number {
        return k * k;
    }

    static quadratic_out(k: number): number {
        return k * (2 - k);
    }

    static quadratic_inout(k: number): number {
        if ((k *= 2) < 1) return 0.5 * k * k;
        return -0.5 * (--k * (k - 2) - 1);
    }
}

class Interpolation {
    static linear(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}