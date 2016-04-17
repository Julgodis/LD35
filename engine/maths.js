var vec2 = (function () {
    function vec2(values) {
        this.values = new Float32Array(2);
        if (values) {
            this.init(values);
        }
    }
    Object.defineProperty(vec2.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "u", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "v", {
        get: function () {
            return this.values[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "s", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "t", {
        get: function () {
            return this.values[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "xy", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "st", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec2.prototype, "uv", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    vec2.from2 = function (vec) {
        var dest = new vec2();
        for (var i = 0; i < 2; i++) {
            dest.values[i] = vec.values[i];
        }
        return dest;
    };
    vec2.prototype.init = function (values) {
        for (var i = 0; i < 2; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    vec2.prototype.reset = function () {
        for (var i = 0; i < 2; i++) {
            this.values[i] = 0;
        }
    };
    vec2.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new vec2();
        for (var i = 0; i < 2; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    vec2.prototype.length2 = function () {
        return this.x * this.x + this.y * this.y;
    };
    vec2.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    vec2.prototype.abs = function () {
        for (var i = 0; i < 2; i++) {
            this.values[i] = Math.abs(this.values[i]);
        }
        return this;
    };
    vec2.prototype.add = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] += vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] += vec.values[i];
            }
        }
        return this;
    };
    vec2.prototype.sub = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        return this;
    };
    vec2.prototype.mul = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= vec.values[i];
            }
        }
        return this;
    };
    vec2.prototype.div = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= vec;
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= vec.values[i];
            }
        }
        return this;
    };
    return vec2;
})();
var vec4 = (function () {
    function vec4(values) {
        this.values = new Float32Array(4);
        if (values) {
            this.init(values);
        }
    }
    Object.defineProperty(vec4.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "z", {
        get: function () {
            return this.values[2];
        },
        set: function (value) {
            this.values[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "w", {
        get: function () {
            return this.values[3];
        },
        set: function (value) {
            this.values[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "r", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "g", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "b", {
        get: function () {
            return this.values[2];
        },
        set: function (value) {
            this.values[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec4.prototype, "a", {
        get: function () {
            return this.values[3];
        },
        set: function (value) {
            this.values[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    vec4.from4 = function (vec) {
        var dest = new vec4();
        for (var i = 0; i < 4; i++) {
            dest.values[i] = vec.values[i];
        }
        return dest;
    };
    vec4.prototype.init = function (values) {
        for (var i = 0; i < 4; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    vec4.prototype.reset = function () {
        for (var i = 0; i < 4; i++) {
            this.values[i] = 0;
        }
    };
    vec4.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new vec4();
        for (var i = 0; i < 4; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    vec4.prototype.normalize = function () {
        var length = this.length();
        this.div(length);
        return this;
    };
    vec4.prototype.length2 = function () {
        return this.dot(this);
    };
    vec4.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    vec4.prototype.dot = function (vec) {
        var t = 0;
        for (var i = 0; i < 4; i++) {
            t += this.values[i] * vec.values[i];
        }
        return t;
    };
    vec4.prototype.add = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] += vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] += vec.values[i];
            }
        }
        return this;
    };
    vec4.prototype.sub = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        return this;
    };
    vec4.prototype.mul = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= vec.values[i];
            }
        }
        return this;
    };
    vec4.prototype.div = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= vec;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= vec.values[i];
            }
        }
        return this;
    };
    return vec4;
})();
var vec3 = (function () {
    function vec3(values) {
        this.values = new Float32Array(3);
        if (values) {
            this.init(values);
        }
    }
    Object.defineProperty(vec3.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (value) {
            this.values[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (value) {
            this.values[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "z", {
        get: function () {
            return this.values[2];
        },
        set: function (value) {
            this.values[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "r", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "g", {
        get: function () {
            return this.values[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "b", {
        get: function () {
            return this.values[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xyz", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "rgb", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xy", {
        get: function () {
            return new vec2([this.x, this.y]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "yz", {
        get: function () {
            return new vec2([this.y, this.z]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(vec3.prototype, "xz", {
        get: function () {
            return new vec2([this.x, this.z]);
        },
        enumerable: true,
        configurable: true
    });
    vec3.from2 = function (vec, z) {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            z
        ]);
        return dest;
    };
    vec3.from3 = function (vec) {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            vec.values[2]
        ]);
        return dest;
    };
    vec3.prototype.init = function (values) {
        for (var i = 0; i < 3; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    vec3.prototype.reset = function () {
        for (var i = 0; i < 3; i++) {
            this.values[i] = 0;
        }
    };
    vec3.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new vec3();
        for (var i = 0; i < 3; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    vec3.prototype.normalize = function () {
        var length = this.length();
        this.div(length);
        return this;
    };
    vec3.prototype.length2 = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    vec3.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    vec3.prototype.dot = function (vec) {
        var t = 0;
        for (var i = 0; i < 3; i++) {
            t += this.values[i] * vec.values[i];
        }
        return t;
    };
    vec3.prototype.add = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] += vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] += vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.sub = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.mul = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.div = function (vec) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= vec;
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= vec.values[i];
            }
        }
        return this;
    };
    vec3.prototype.lerp = function (v, t) {
        var a = this.x + (v.x - this.x) * t;
        var b = this.y + (v.y - this.y) * t;
        var c = this.z + (v.z - this.z) * t;
        return new vec3([a, b, c]);
    };
    return vec3;
})();
var mat3 = (function () {
    function mat3(values) {
        this.values = new Float32Array(9);
        if (values) {
            this.init(values);
        }
    }
    mat3.prototype.init = function (values) {
        for (var i = 0; i < 9; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    mat3.prototype.reset = function () {
        for (var i = 0; i < 9; i++) {
            this.values[i] = 0;
        }
    };
    mat3.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new mat3();
        for (var i = 0; i < 9; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    mat3.prototype.setIdentity = function () {
        this.init([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
        return this;
    };
    mat3.prototype.set2DPerspective = function (width, height) {
        var w = 2.0 / width;
        var h = -2.0 / height;
        this.init([
            w, 0, 0,
            0, h, 0,
            -1, 1, 1
        ]);
        return this;
    };
    mat3.prototype.setTranslate = function (x, y) {
        this.init([
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ]);
        return this;
    };
    mat3.prototype.setRotate = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.init([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]);
        return this;
    };
    mat3.prototype.setScale = function (x, y) {
        this.init([
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ]);
        return this;
    };
    mat3.prototype.multiply = function (mat) {
        var a00 = this.values[0 * 3 + 0];
        var a01 = this.values[0 * 3 + 1];
        var a02 = this.values[0 * 3 + 2];
        var a10 = this.values[1 * 3 + 0];
        var a11 = this.values[1 * 3 + 1];
        var a12 = this.values[1 * 3 + 2];
        var a20 = this.values[2 * 3 + 0];
        var a21 = this.values[2 * 3 + 1];
        var a22 = this.values[2 * 3 + 2];
        var b00 = mat.values[0 * 3 + 0];
        var b01 = mat.values[0 * 3 + 1];
        var b02 = mat.values[0 * 3 + 2];
        var b10 = mat.values[1 * 3 + 0];
        var b11 = mat.values[1 * 3 + 1];
        var b12 = mat.values[1 * 3 + 2];
        var b20 = mat.values[2 * 3 + 0];
        var b21 = mat.values[2 * 3 + 1];
        var b22 = mat.values[2 * 3 + 2];
        this.init([
            a00 * b00 + a01 * b10 + a02 * b20,
            a00 * b01 + a01 * b11 + a02 * b21,
            a00 * b02 + a01 * b12 + a02 * b22,
            a10 * b00 + a11 * b10 + a12 * b20,
            a10 * b01 + a11 * b11 + a12 * b21,
            a10 * b02 + a11 * b12 + a12 * b22,
            a20 * b00 + a21 * b10 + a22 * b20,
            a20 * b01 + a21 * b11 + a22 * b21,
            a20 * b02 + a21 * b12 + a22 * b22
        ]);
        return this;
    };
    mat3.prototype.vector = function (v2) {
        if (v2 === void 0) { v2 = null; }
        var vec = vec3.from2(v2, 1);
        var ret3 = new vec3([
            this.values[0] * vec.x + this.values[3] * vec.y + this.values[6] * vec.z,
            this.values[1] * vec.x + this.values[4] * vec.y + this.values[7] * vec.z,
            this.values[2] * vec.x + this.values[5] * vec.y + this.values[8] * vec.z
        ]);
        return ret3.div(ret3.z).xy;
    };
    mat3.makeIdentity = function () {
        return (new mat3()).setIdentity();
    };
    mat3.make2DPerspective = function (width, height) {
        return (new mat3()).set2DPerspective(width, height);
    };
    mat3.makeTranslate = function (x, y) {
        return (new mat3()).setTranslate(x, y);
    };
    mat3.makeRotation = function (angle) {
        return (new mat3()).setRotate(angle);
    };
    mat3.makeScale = function (x, y) {
        return (new mat3()).setScale(x, y);
    };
    return mat3;
})();
var mat4 = (function () {
    function mat4(values) {
        this.values = new Float32Array(16);
        if (values) {
            this.init(values);
        }
    }
    mat4.prototype.init = function (values) {
        for (var i = 0; i < 16; i++) {
            this.values[i] = values[i];
        }
        return this;
    };
    mat4.prototype.reset = function () {
        for (var i = 0; i < 16; i++) {
            this.values[i] = 0;
        }
    };
    mat4.prototype.copy = function (dest) {
        if (dest === void 0) { dest = null; }
        if (!dest)
            dest = new mat4();
        for (var i = 0; i < 16; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    };
    mat4.prototype.setIdentity = function () {
        this.init([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return this;
    };
    mat4.prototype.setTranslate = function (x, y, z) {
        this.init([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
        return this;
    };
    mat4.prototype.setRotateX = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.init([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
        return this;
    };
    mat4.prototype.setRotateY = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.init([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
        return this;
    };
    mat4.prototype.setRotateZ = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.init([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
        return this;
    };
    mat4.prototype.setScale = function (x, y, z) {
        this.init([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);
        return this;
    };
    mat4.prototype.set2DProjection = function (width, height, near, far) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        /*this.init([
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ]);*/
        var l = 0;
        var r = width;
        var t = 0;
        var b = height;
        var f = far;
        var n = near;
        this.init([
            2 / (r - l), 0, 0, 0,
            0, 2 / (t - b), 0, 0,
            0, 0, -2 / (f - n), 0,
            -1, 1, (n + f) / (n - f), 1,
        ]);
        return this;
    };
    mat4.prototype.multiply = function (mat) {
        var a00 = this.values[0 * 4 + 0];
        var a01 = this.values[0 * 4 + 1];
        var a02 = this.values[0 * 4 + 2];
        var a03 = this.values[0 * 4 + 3];
        var a10 = this.values[1 * 4 + 0];
        var a11 = this.values[1 * 4 + 1];
        var a12 = this.values[1 * 4 + 2];
        var a13 = this.values[1 * 4 + 3];
        var a20 = this.values[2 * 4 + 0];
        var a21 = this.values[2 * 4 + 1];
        var a22 = this.values[2 * 4 + 2];
        var a23 = this.values[2 * 4 + 3];
        var a30 = this.values[3 * 4 + 0];
        var a31 = this.values[3 * 4 + 1];
        var a32 = this.values[3 * 4 + 2];
        var a33 = this.values[3 * 4 + 3];
        var b00 = mat.values[0 * 4 + 0];
        var b01 = mat.values[0 * 4 + 1];
        var b02 = mat.values[0 * 4 + 2];
        var b03 = mat.values[0 * 4 + 3];
        var b10 = mat.values[1 * 4 + 0];
        var b11 = mat.values[1 * 4 + 1];
        var b12 = mat.values[1 * 4 + 2];
        var b13 = mat.values[1 * 4 + 3];
        var b20 = mat.values[2 * 4 + 0];
        var b21 = mat.values[2 * 4 + 1];
        var b22 = mat.values[2 * 4 + 2];
        var b23 = mat.values[2 * 4 + 3];
        var b30 = mat.values[3 * 4 + 0];
        var b31 = mat.values[3 * 4 + 1];
        var b32 = mat.values[3 * 4 + 2];
        var b33 = mat.values[3 * 4 + 3];
        this.init([a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33]);
        return this;
    };
    mat4.prototype.multiplyVec3 = function (vector) {
        var x = vector.x, y = vector.y, z = vector.z;
        return new vec3([
            this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12],
            this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13],
            this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14]
        ]);
    };
    mat4.prototype.multiplyVec4 = function (vector) {
        var dest = new vec4();
        var x = vector.x, y = vector.y, z = vector.z, w = vector.w;
        dest.x = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12] * w;
        dest.y = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13] * w;
        dest.z = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14] * w;
        dest.w = this.values[3] * x + this.values[7] * y + this.values[11] * z + this.values[15] * w;
        return dest;
    };
    mat4.prototype.transpose = function () {
        var temp01 = this.values[1], temp02 = this.values[2], temp03 = this.values[3], temp12 = this.values[6], temp13 = this.values[7], temp23 = this.values[11];
        this.values[1] = this.values[4];
        this.values[2] = this.values[8];
        this.values[3] = this.values[12];
        this.values[4] = temp01;
        this.values[6] = this.values[9];
        this.values[7] = this.values[13];
        this.values[8] = temp02;
        this.values[9] = temp12;
        this.values[11] = this.values[14];
        this.values[12] = temp03;
        this.values[13] = temp13;
        this.values[14] = temp23;
        return this;
    };
    mat4.prototype.inverse = function () {
        var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3], a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7], a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11], a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];
        var det00 = a00 * a11 - a01 * a10, det01 = a00 * a12 - a02 * a10, det02 = a00 * a13 - a03 * a10, det03 = a01 * a12 - a02 * a11, det04 = a01 * a13 - a03 * a11, det05 = a02 * a13 - a03 * a12, det06 = a20 * a31 - a21 * a30, det07 = a20 * a32 - a22 * a30, det08 = a20 * a33 - a23 * a30, det09 = a21 * a32 - a22 * a31, det10 = a21 * a33 - a23 * a31, det11 = a22 * a33 - a23 * a32;
        var det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);
        if (!det)
            return null;
        det = 1.0 / det;
        this.values[0] = (a11 * det11 - a12 * det10 + a13 * det09) * det;
        this.values[1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det;
        this.values[2] = (a31 * det05 - a32 * det04 + a33 * det03) * det;
        this.values[3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det;
        this.values[4] = (-a10 * det11 + a12 * det08 - a13 * det07) * det;
        this.values[5] = (a00 * det11 - a02 * det08 + a03 * det07) * det;
        this.values[6] = (-a30 * det05 + a32 * det02 - a33 * det01) * det;
        this.values[7] = (a20 * det05 - a22 * det02 + a23 * det01) * det;
        this.values[8] = (a10 * det10 - a11 * det08 + a13 * det06) * det;
        this.values[9] = (-a00 * det10 + a01 * det08 - a03 * det06) * det;
        this.values[10] = (a30 * det04 - a31 * det02 + a33 * det00) * det;
        this.values[11] = (-a20 * det04 + a21 * det02 - a23 * det00) * det;
        this.values[12] = (-a10 * det09 + a11 * det07 - a12 * det06) * det;
        this.values[13] = (a00 * det09 - a01 * det07 + a02 * det06) * det;
        this.values[14] = (-a30 * det03 + a31 * det01 - a32 * det00) * det;
        this.values[15] = (a20 * det03 - a21 * det01 + a22 * det00) * det;
        return this;
    };
    mat4.makeIdentity = function () {
        return (new mat4()).setIdentity();
    };
    mat4.makeTranslate = function (x, y, z) {
        return (new mat4()).setTranslate(x, y, z);
    };
    mat4.makeRotationX = function (angle) {
        return (new mat4()).setRotateX(angle);
    };
    mat4.makeRotationY = function (angle) {
        return (new mat4()).setRotateY(angle);
    };
    mat4.makeRotationZ = function (angle) {
        return (new mat4()).setRotateZ(angle);
    };
    mat4.makeScale = function (x, y, z) {
        return (new mat4()).setScale(x, y, z);
    };
    mat4.make2DProjection = function (width, height, near, far) {
        return (new mat4()).set2DProjection(width, height, near, far);
    };
    return mat4;
})();
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function lerp_vec4(a, b, t) {
    return new vec4([
        lerp(a.x, b.x, t),
        lerp(a.y, b.y, t),
        lerp(a.z, b.z, t),
        lerp(a.w, b.w, t)
    ]);
}
//# sourceMappingURL=maths.js.map