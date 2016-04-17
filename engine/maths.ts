class vec2 {
    values = new Float32Array(2);

    get x(): number {
        return this.values[0];
    }

    set x(value: number) {
        this.values[0] = value;
    }

    get y(): number {
        return this.values[1];
    }

    set y(value: number) {
        this.values[1] = value;
    }

    get u(): number {
        return this.values[0];
    }

    get v(): number {
        return this.values[1];
    }

    get s(): number {
        return this.values[0];
    }

    get t(): number {
        return this.values[1];
    }

    get xy(): vec2 {
        return this;
    }

    get st(): vec2 {
        return this;
    }

    get uv(): vec2 {
        return this;
    }

    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    static from2(vec: vec2) {
        var dest = new vec2();
        for (var i = 0; i < 2; i++) {
            dest.values[i] = vec.values[i];
        }

        return dest;
    }

    init(values: number[]) {
        for (var i = 0; i < 2; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 2; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: vec2 = null): vec2 {
        if (!dest) dest = new vec2();

        for (var i = 0; i < 2; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    length2(): number {
        return this.x * this.x + this.y * this.y;
    }

    length(): number {
        return Math.sqrt(this.length2());
    }

    abs(): vec2 {
        for (var i = 0; i < 2; i++) {
            this.values[i] = Math.abs(this.values[i]);
        }

        return this;
    }

    add(vec: vec2 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] += <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] += (<vec2>vec).values[i];
            }
        }

        return this;
    }

    sub(vec: vec2 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] -= (<vec2>vec).values[i];
            }
        }

        return this;
    }

    mul(vec: vec2 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] *= (<vec2>vec).values[i];
            }
        }

        return this;
    }

    div(vec: vec2 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= <number>vec;
            }
        } else {
            for (var i = 0; i < 2; i++) {
                this.values[i] /= (<vec2>vec).values[i];
            }
        }

        return this;
    }


} 

class vec4 {
    values = new Float32Array(4);

    get x(): number {
        return this.values[0];
    }

    set x(value: number) {
        this.values[0] = value;
    }

    get y(): number {
        return this.values[1];
    }

    set y(value: number) {
        this.values[1] = value;
    }

    get z(): number {
        return this.values[2];
    }

    set z(value: number) {
        this.values[2] = value;
    }

    get w(): number {
        return this.values[3];
    }

    set w(value: number) {
        this.values[3] = value;
    }

    get r(): number {
        return this.values[0];
    }

    set r(value: number) {
        this.values[0] = value;
    }

    get g(): number {
        return this.values[1];
    }

    set g(value: number) {
        this.values[1] = value;
    }

    get b(): number {
        return this.values[2];
    }

    set b(value: number) {
        this.values[2] = value;
    }

    get a(): number {
        return this.values[3];
    }

    set a(value: number) {
        this.values[3] = value;
    }

    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    static from4(vec: vec4) {
        var dest = new vec4();
        for (var i = 0; i < 4; i++) {
            dest.values[i] = vec.values[i];
        }

        return dest;
    }

    init(values: number[]) {
        for (var i = 0; i < 4; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 4; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: vec4 = null): vec4 {
        if (!dest) dest = new vec4();

        for (var i = 0; i < 4; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    normalize(): vec4 {
        var length = this.length();
        this.div(length);
        return this;
    }

    length2(): number {
        return this.dot(this);
    }

    length(): number {
        return Math.sqrt(this.length2());
    }

    dot(vec: vec4): number {
        var t: number = 0;
        for (var i = 0; i < 4; i++) {
            t +=  this.values[i] * vec.values[i];
        }
        
        return t;
    }

    add(vec: vec4 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] += <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] += (<vec4>vec).values[i];
            }
        }

        return this;
    }

    sub(vec: vec4 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] -= (<vec4>vec).values[i];
            }
        }

        return this;
    }

    mul(vec: vec4 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] *= (<vec4>vec).values[i];
            }
        }

        return this;
    }

    div(vec: vec4 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= <number>vec;
            }
        } else {
            for (var i = 0; i < 4; i++) {
                this.values[i] /= (<vec4>vec).values[i];
            }
        }

        return this;
    }
}


class vec3 {
    values = new Float32Array(3);

    get x(): number {
        return this.values[0];
    }

    get y(): number {
        return this.values[1];
    }

    get z(): number {
        return this.values[2];
    }

    set x(value: number) {
        this.values[0] = value;
    }

    set y(value: number) {
        this.values[1] = value;
    }

    set z(value: number) {
        this.values[2] = value;
    }


    get r(): number {
        return this.values[0];
    }

    get g(): number {
        return this.values[1];
    }

    get b(): number {
        return this.values[2];
    }

    get xyz(): vec3 {
        return this;
    }

    get rgb(): vec3 {
        return this;
    }

    get xy(): vec2 {
        return new vec2([this.x, this.y]);
    }

    get yz(): vec2 {
        return new vec2([this.y, this.z]);
    }

    get xz(): vec2 {
        return new vec2([this.x, this.z]);
    }


    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    static from2(vec: vec2, z: number): vec3 {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            z
        ]);

        return dest;
    }

    static from3(vec: vec3): vec3 {
        var dest = new vec3([
            vec.values[0],
            vec.values[1],
            vec.values[2]
        ]);

        return dest;
    }

    init(values: number[]) {
        for (var i = 0; i < 3; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 3; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: vec3 = null): vec3 {
        if (!dest) dest = new vec3();

        for (var i = 0; i < 3; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    normalize(): vec3 {
        var length = this.length();
        this.div(length);
        return this;
    }

    length2(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length(): number {
        return Math.sqrt(this.length2());
    }


    dot(vec: vec3): number {
        var t: number = 0;
        for (var i = 0; i < 3; i++) {
            t += this.values[i] * vec.values[i];
        }

        return t;
    }

    add(vec: vec3 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] += <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] += (<vec3>vec).values[i];
            }
        }

        return this;
    }

    sub(vec: vec3 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] -= (<vec3>vec).values[i];
            }
        }

        return this;
    }

    mul(vec: vec3 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] *= (<vec3>vec).values[i];
            }
        }

        return this;
    }

    div(vec: vec3 | number) {
        if (typeof vec == 'number') {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= <number>vec;
            }
        } else {
            for (var i = 0; i < 3; i++) {
                this.values[i] /= (<vec3>vec).values[i];
            }
        }

        return this;
    }

    lerp(v: vec3, t: number) {
        var a = this.x + (v.x - this.x) * t;
        var b = this.y + (v.y - this.y) * t;
        var c = this.z + (v.z - this.z) * t;
        return new vec3([a, b, c]);
    }
}  

class mat3 {
    values = new Float32Array(9);

    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    init(values: number[]) {
        for (var i = 0; i < 9; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 9; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: mat3 = null): mat3 {
        if (!dest) dest = new mat3();

        for (var i = 0; i < 9; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    setIdentity(): mat3 {
        this.init([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        return this;
    }

    set2DPerspective(width: number, height: number) {
        var w = 2.0 / width;
        var h = -2.0 / height;

        this.init([
            w, 0, 0,
            0, h, 0,
            -1, 1, 1
        ]);

        return this;
    }

    setTranslate(x: number, y: number) {
        this.init([
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ]);

        return this;
    }

    setRotate(angle: number) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        this.init([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]);

        return this;
    }

    setScale(x: number, y: number) {
        this.init([
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ]);

        return this;
    }

    multiply(mat: mat3) {
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
    }

    vector(v2: vec2 = null): vec2 {
        var vec = vec3.from2(v2, 1);

        var ret3 = new vec3([
            this.values[0] * vec.x + this.values[3] * vec.y + this.values[6] * vec.z,
            this.values[1] * vec.x + this.values[4] * vec.y + this.values[7] * vec.z,
            this.values[2] * vec.x + this.values[5] * vec.y + this.values[8] * vec.z
        ]);

        return ret3.div(ret3.z).xy;
    }

    static makeIdentity(): mat3 {
        return (new mat3()).setIdentity();
    }

    static make2DPerspective(width: number, height: number): mat3 {
        return (new mat3()).set2DPerspective(width, height);
    }

    static makeTranslate(x: number, y: number): mat3 {
        return (new mat3()).setTranslate(x, y);
    }

    static makeRotation(angle: number): mat3 {
        return (new mat3()).setRotate(angle);
    }

    static makeScale(x: number, y: number): mat3 {
        return (new mat3()).setScale(x, y);
    }
} 

class mat4 {
    values = new Float32Array(16);

    constructor(values?: number[]) {
        if (values) {
            this.init(values);
        }
    }

    init(values: number[]) {
        for (var i = 0; i < 16; i++) {
            this.values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (var i = 0; i < 16; i++) {
            this.values[i] = 0;
        }
    }

    copy(dest: mat4 = null): mat4 {
        if (!dest) dest = new mat4();

        for (var i = 0; i < 16; i++) {
            dest.values[i] = this.values[i];
        }

        return dest;
    }

    setIdentity(): mat4 {
        this.init([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        return this;
    }

    setTranslate(x: number, y: number, z: number) {
        this.init([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);

        return this;
    }

    setRotateX(angle: number) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        this.init([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);

        return this;
    }

    setRotateY(angle: number) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        this.init([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);

        return this;
    }

    setRotateZ(angle: number) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        this.init([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);

        return this;
    }

    setScale(x: number, y: number, z: number) {
        this.init([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);

        return this;
    }

    set2DProjection(width: number, height: number, near: number, far: number) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        /*this.init([
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ]);*/

        var l: number = 0;
        var r: number = width;
        var t: number = 0;
        var b: number = height;
        var f: number = far;
        var n: number = near;

        this.init([
            2 / (r - l), 0, 0, 0,
            0, 2 / (t - b), 0, 0,
            0, 0, -2 / (f - n), 0,
            -1, 1, (n + f) / (n - f), 1,
        ]);

        return this;
    }

    multiply(mat: mat4) {
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
    }

    multiplyVec3(vector: vec3): vec3 {
        var x = vector.x,
            y = vector.y,
            z = vector.z;

        return new vec3([
            this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12],
            this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13],
            this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14]
        ]);
    }

    multiplyVec4(vector: vec4): vec4 {
        var dest = new vec4();
        var x = vector.x,
            y = vector.y,
            z = vector.z,
            w = vector.w;

        dest.x = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12] * w;
        dest.y = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13] * w;
        dest.z = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14] * w;
        dest.w = this.values[3] * x + this.values[7] * y + this.values[11] * z + this.values[15] * w;

        return dest;
    }

    transpose(): mat4 {
        var temp01 = this.values[1], temp02 = this.values[2],
            temp03 = this.values[3], temp12 = this.values[6],
            temp13 = this.values[7], temp23 = this.values[11];

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
    }

    inverse(): mat4 {
        var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3],
            a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7],
            a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11],
            a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

        var det00 = a00 * a11 - a01 * a10,
            det01 = a00 * a12 - a02 * a10,
            det02 = a00 * a13 - a03 * a10,
            det03 = a01 * a12 - a02 * a11,
            det04 = a01 * a13 - a03 * a11,
            det05 = a02 * a13 - a03 * a12,
            det06 = a20 * a31 - a21 * a30,
            det07 = a20 * a32 - a22 * a30,
            det08 = a20 * a33 - a23 * a30,
            det09 = a21 * a32 - a22 * a31,
            det10 = a21 * a33 - a23 * a31,
            det11 = a22 * a33 - a23 * a32;

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
    }


    static makeIdentity(): mat4 {
        return (new mat4()).setIdentity();
    }

    static makeTranslate(x: number, y: number, z: number): mat4 {
        return (new mat4()).setTranslate(x, y, z);
    }

    static makeRotationX(angle: number): mat4 {
        return (new mat4()).setRotateX(angle);
    }

    static makeRotationY(angle: number): mat4 {
        return (new mat4()).setRotateY(angle);
    }

    static makeRotationZ(angle: number): mat4 {
        return (new mat4()).setRotateZ(angle);
    }

    static makeScale(x: number, y: number, z: number): mat4 {
        return (new mat4()).setScale(x, y, z);
    }

    static make2DProjection(width: number, height: number, near: number, far: number): mat4 {
        return (new mat4()).set2DProjection(width, height, near, far);
    }
} 

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