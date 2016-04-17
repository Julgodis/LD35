var ModelBatch = (function () {
    function ModelBatch(engine, count) {
        this.engine = engine;
        this.in_use = false;
        this.shader = null;
        this.count = count;
        this.current_count = 0;
        this.buffers = [];
        this.vertex_buffer = new Float32Array(this.count * (3 + 2));
        this.texture = null;
        var gl = this.engine.webgl;
        this.array_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex_buffer, gl.DYNAMIC_DRAW);
    }
    ModelBatch.prototype.use_shader = function (shader) {
        if (!this.in_use)
            new Error("ModelBatch::use_shader");
        this.shader = shader;
        if (this.shader == null)
            return;
        this.shader.bind();
        //if (this.buffers[shader.program_index] == null) {
        var position = this.shader.getVertexAttr("position");
        var texture = this.shader.getVertexAttr("texture_coords");
        var gl = this.engine.webgl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.enableVertexAttribArray(position.handle);
        gl.vertexAttribPointer(position.handle, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.enableVertexAttribArray(texture.handle);
        gl.vertexAttribPointer(texture.handle, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //this.buffers[shader.program_index] = true;
        //}
    };
    ModelBatch.prototype.clear = function () {
        this.current_count = 0;
    };
    ModelBatch.prototype.begin = function () {
        if (this.in_use)
            new Error("ModelBatch::begin");
        this.in_use = true;
    };
    ModelBatch.prototype.end = function () {
        if (!this.in_use)
            new Error("ModelBatch::end");
        this.in_use = false;
        if (this.current_count == 0)
            return;
        var gl = this.engine.webgl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex_buffer, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    ModelBatch.prototype.render = function () {
        if (this.current_count <= 0)
            return;
        var gl = this.engine.webgl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.drawArrays(gl.TRIANGLES, 0, this.current_count);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    /*

    append_2dquad(x: number, y: number, width: number, height: number): void {
        var z = 0.0;

        this.add_vertex(x - width * 0.5, y - height * 0.5, z, 0.0, 0.0);
        this.add_vertex(x + width * 0.5, y - height * 0.5, z, 1.0, 0.0);
        this.add_vertex(x - width * 0.5, y + height * 0.5, z, 0.0, 1.0);

        this.add_vertex(x - width * 0.5, y + height * 0.5, z, 0.0, 1.0);
        this.add_vertex(x + width * 0.5, y - height * 0.5, z, 1.0, 0.0);
        this.add_vertex(x + width * 0.5, y + height * 0.5, z, 1.0, 1.0);
    }

    append_slope(tilemap: Texture, x: number, y: number, z: number, width: number, height: number, depth: number, direction: number, id: number): void {
        var x1 = x+-width * 0.5
        var y1 = y+-height * 0.5
        var z1 = z+-depth * 0.5
        var x2 = x+width * 0.5
        var y2 = y+height * 0.5
        var z2 = z+depth * 0.5

        var dx = 1.0 / (tilemap.size.x / 16.0);
        var dy = 1.0 / (tilemap.size.y / 16.0);

        var u1 = 0;
        var u2 = 0;
        var v1 = 0;
        var v2 = 0;

        var m = 1.0 / 500.0;

        //
        var tilemap_index = id * 6
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v2 = (((tilemap_index / 6) | 0)) * dy + m;
        v1 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Front Triangle
        this.add_vertex(x1, y2, z2, u1, v1);
        this.add_vertex(x2, y2, z2, u2, v1);
        this.add_vertex(x2, y1, z2, u2, v2);

        //
        var tilemap_index = id * 6 + 2
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v2 = (((tilemap_index / 6) | 0)) * dy + m;
        v1 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        /* Back Triangle
        this.add_vertex(x1, y2, z1, u2, v1);
        this.add_vertex(x2, y2, z1, u1, v1);
        this.add_vertex(x2, y1, z1, u1, v2);

        //
        var tilemap_index = id * 6 + 1
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v2 = (((tilemap_index / 6) | 0)) * dy + m;
        v1 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Slope Triangle 1
        this.add_vertex(x1, y2, z2, u2, v1);
        this.add_vertex(x2, y1, z2, u2, v2);
        this.add_vertex(x1, y2, z1, u1, v1);

        // Slope Triangle 2
        this.add_vertex(x1, y2, z1, u1, v1);
        this.add_vertex(x2, y1, z1, u1, v2);
        this.add_vertex(x2, y1, z2, u2, v2);

        //
        var tilemap_index = id * 6 + 3
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v2 = (((tilemap_index / 6) | 0)) * dy + m;
        v1 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Not-Slope Triangle 1
        this.add_vertex(x2, y2, z2, u2, v1);
        this.add_vertex(x2, y1, z2, u2, v2);
        this.add_vertex(x2, y2, z1, u1, v1);

        // Not-Slope Triangle 2
        this.add_vertex(x2, y2, z1, u1, v1);
        this.add_vertex(x2, y1, z1, u1, v2);
        this.add_vertex(x2, y1, z2, u2, v2);
    }

    append_cube(tilemap: Texture, x: number, y: number, z: number, width: number, height: number, depth: number, id: number): void {
        var x1 = x - width * 0.5
        var y1 = y - height * 0.5
        var z1 = z - depth * 0.5
        var x2 = x + width * 0.5
        var y2 = y + height * 0.5
        var z2 = z + depth * 0.5

        var dx = 1.0 / (tilemap.size.x / 16.0);
        var dy = 1.0 / (tilemap.size.y / 16.0);

        var u1 = 0;
        var u2 = 0;
        var v1 = 0;
        var v2 = 0;

        var m = 1.0 / 500.0;

        //
        var tilemap_index = id * 6
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v2 = (((tilemap_index / 6) | 0)) * dy + m;
        v1 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Front Face
        this.add_vertex(x1, y1, z2, u1, v2);
        this.add_vertex(x2, y1, z2, u2, v2);
        this.add_vertex(x2, y2, z2, u2, v1);
        this.add_vertex(x2, y2, z2, u2, v1);
        this.add_vertex(x1, y1, z2, u1, v2);
        this.add_vertex(x1, y2, z2, u1, v1);

        //
        tilemap_index = id * 6+2
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v1 = (((tilemap_index / 6) | 0)) * dy + m;
        v2 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Back Face
        this.add_vertex(x1, y1, z1, u1, v1);
        this.add_vertex(x1, y2, z1, u1, v2);
        this.add_vertex(x2, y2, z1, u2, v2);
        this.add_vertex(x2, y2, z1, u2, v2);
        this.add_vertex(x1, y1, z1, u1, v1);
        this.add_vertex(x2, y1, z1, u2, v1);
        
        //
        tilemap_index = id * 6+4
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v1 = (((tilemap_index / 6) | 0)) * dy + m;
        v2 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Top Face
        this.add_vertex(x1, y2, z1, u2, v2);
        this.add_vertex(x1, y2, z2, u2, v1);
        this.add_vertex(x2, y2, z2, u1, v1);
        this.add_vertex(x2, y2, z2, u1, v1);
        this.add_vertex(x1, y2, z1, u2, v2);
        this.add_vertex(x2, y2, z1, u1, v2);
 
        //
        tilemap_index = id * 6+5
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v1 = (((tilemap_index / 6) | 0)) * dy + m;
        v2 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Bottom Face
        this.add_vertex(x1, y1, z1, u1, v2);
        this.add_vertex(x2, y1, z1, u2, v2);
        this.add_vertex(x2, y1, z2, u2, v1);
        this.add_vertex(x2, y1, z2, u2, v1);
        this.add_vertex(x1, y1, z1, u1, v2);
        this.add_vertex(x1, y1, z2, u1, v1);

        //
        tilemap_index = id * 6+1
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v1 = (((tilemap_index / 6) | 0)) * dy + m;
        v2 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Right face
        this.add_vertex(x2, y1, z1, u1, v1);
        this.add_vertex(x2, y2, z1, u1, v2);
        this.add_vertex(x2, y2, z2, u2, v2);
        this.add_vertex(x2, y2, z2, u2, v2);
        this.add_vertex(x2, y1, z1, u1, v1);
        this.add_vertex(x2, y1, z2, u2, v1);
 
        //
        tilemap_index = id * 6+3
        u1 = tilemap_index % 6 * dx + m;
        u2 = (tilemap_index % 6 + 1) * dx - m;
        v1 = (((tilemap_index / 6) | 0)) * dy + m;
        v2 = (((tilemap_index / 6) | 0) + 1) * dy - m;

        // Left Face
        this.add_vertex(x1, y1, z1, u2, v1);
        this.add_vertex(x1, y1, z2, u1, v1);
        this.add_vertex(x1, y2, z2, u1, v2);
        this.add_vertex(x1, y2, z2, u1, v2);
        this.add_vertex(x1, y1, z1, u2, v1);
        this.add_vertex(x1, y2, z1, u2, v2);
    }
    */
    ModelBatch.prototype.coords_from_texture_index = function (t, shift, size) {
        var tx = 16.0 / this.texture.size.x;
        var ty = 16.0 / this.texture.size.y;
        var m = 1.0 / 500.0;
        var coords = new vec4([
            (shift + 0) * tx + m,
            (t + 0) * ty + m,
            (shift + (size.x / 16.0)) * tx - m,
            (t + (size.y / 16.0)) * ty - m,
        ]);
        return coords;
    };
    ModelBatch.prototype.append_cube = function (position, size, texture, has_array) {
        this.append_cube_texture_size(position, size, texture, new vec3([16.0, 16.0, 16.0]), has_array);
    };
    ModelBatch.prototype.append_cube_texture_size = function (position, size, texture, tex_size, has_array) {
        var coords1 = this.coords_from_texture_index(texture, 0, new vec2([tex_size.x, tex_size.y]));
        var coords2 = this.coords_from_texture_index(texture, 1, new vec2([tex_size.x, tex_size.y]));
        var coords3 = this.coords_from_texture_index(texture, 2, new vec2([tex_size.x, tex_size.y]));
        var coords4 = this.coords_from_texture_index(texture, 3, new vec2([tex_size.x, tex_size.y]));
        var coords5 = this.coords_from_texture_index(texture, 4, new vec2([tex_size.z, tex_size.y]));
        var coords6 = this.coords_from_texture_index(texture, 5, new vec2([tex_size.z, tex_size.y]));
        var half_size = size.copy().mul(0.5);
        var min = position.copy().sub(half_size);
        var max = position.copy().add(half_size);
        var A = new vec3();
        var B = new vec3();
        var C = new vec3();
        var D = new vec3();
        // Bottom
        if (has_array[4]) {
            A = new vec3([max.x, max.y, max.z]);
            B = new vec3([max.x, max.y, min.z]);
            C = new vec3([min.x, max.y, max.z]);
            D = new vec3([min.x, max.y, min.z]);
            this.add_quad(A, B, C, D, coords5);
        }
        // Back
        if (has_array[2]) {
            A = new vec3([max.x, max.y, min.z]);
            B = new vec3([max.x, min.y, min.z]);
            C = new vec3([min.x, max.y, min.z]);
            D = new vec3([min.x, min.y, min.z]);
            this.add_quad(A, B, C, D, coords3);
        }
        // Right
        if (has_array[3]) {
            A = new vec3([max.x, max.y, max.z]);
            B = new vec3([max.x, min.y, max.z]);
            C = new vec3([max.x, max.y, min.z]);
            D = new vec3([max.x, min.y, min.z]);
            this.add_quad(A, B, C, D, coords4);
        }
        // Top
        if (has_array[5]) {
            A = new vec3([max.x, min.y, max.z]);
            B = new vec3([max.x, min.y, min.z]);
            C = new vec3([min.x, min.y, max.z]);
            D = new vec3([min.x, min.y, min.z]);
            this.add_quad(A, B, C, D, coords6);
        }
        // Left
        if (has_array[1]) {
            A = new vec3([min.x, max.y, max.z]);
            B = new vec3([min.x, min.y, max.z]);
            C = new vec3([min.x, max.y, min.z]);
            D = new vec3([min.x, min.y, min.z]);
            this.add_quad(A, B, C, D, coords2);
        }
        // Front
        if (has_array[0]) {
            A = new vec3([max.x, max.y, max.z]);
            B = new vec3([max.x, min.y, max.z]);
            C = new vec3([min.x, max.y, max.z]);
            D = new vec3([min.x, min.y, max.z]);
            this.add_quad(A, B, C, D, coords1);
        }
    };
    ModelBatch.prototype.append_slope = function (position, size, texture, direction, has_array) {
        this.append_slope_texture_size(position, size, texture, direction, new vec3([16.0, 16.0, 16.0]), has_array);
    };
    ModelBatch.prototype.rotate_xz = function (v, c, s) {
        var xnew = v.x * c - v.z * s;
        var znew = v.x * s + v.z * c;
        v.x = xnew;
        v.z = znew;
        return v;
    };
    ModelBatch.prototype.append_slope_texture_size = function (position, size, texture, direction, tex_size, has_array) {
        var coords1 = this.coords_from_texture_index(texture, 0, new vec2([tex_size.x, tex_size.y]));
        var coords2 = this.coords_from_texture_index(texture, 1, new vec2([tex_size.x, tex_size.y])); // NOTE: Slope
        var coords3 = this.coords_from_texture_index(texture, 2, new vec2([tex_size.x, tex_size.y]));
        var coords4 = this.coords_from_texture_index(texture, 3, new vec2([tex_size.x, tex_size.y]));
        var coords5 = this.coords_from_texture_index(texture, 4, new vec2([tex_size.z, tex_size.y]));
        var angle = (Math.PI * 2) * (direction / 4);
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var min = size.copy().mul(-0.5);
        var max = size.copy().mul(0.5);
        var A = new vec3();
        var B = new vec3();
        var C = new vec3();
        var D = new vec3();
        // Bottom
        A = this.rotate_xz(new vec3([max.x, max.y, max.z]), c, s).add(position);
        B = this.rotate_xz(new vec3([max.x, max.y, min.z]), c, s).add(position);
        C = this.rotate_xz(new vec3([min.x, max.y, max.z]), c, s).add(position);
        D = this.rotate_xz(new vec3([min.x, max.y, min.z]), c, s).add(position);
        this.add_quad(A, B, C, D, coords5);
        // Back
        A = this.rotate_xz(new vec3([max.x, max.y, min.z]), c, s).add(position);
        B = this.rotate_xz(new vec3([max.x, min.y, min.z]), c, s).add(position);
        C = this.rotate_xz(new vec3([min.x, max.y, min.z]), c, s).add(position);
        D = this.rotate_xz(new vec3([min.x, min.y, min.z]), c, s).add(position);
        this.add_quad(A, B, C, D, coords3);
        // Right
        A = this.rotate_xz(new vec3([max.x, max.y, max.z]), c, s).add(position);
        B = this.rotate_xz(new vec3([max.x, min.y, max.z]), c, s).add(position);
        C = this.rotate_xz(new vec3([max.x, max.y, min.z]), c, s).add(position);
        D = this.rotate_xz(new vec3([max.x, min.y, min.z]), c, s).add(position);
        this.add_quad(A, B, C, D, coords4);
        // Slope / Left
        A = this.rotate_xz(new vec3([min.x, max.y, max.z]), c, s).add(position);
        B = this.rotate_xz(new vec3([max.x, min.y, max.z]), c, s).add(position);
        C = this.rotate_xz(new vec3([min.x, max.y, min.z]), c, s).add(position);
        D = this.rotate_xz(new vec3([max.x, min.y, min.z]), c, s).add(position);
        this.add_quad(A, B, C, D, coords2);
        // Front
        A = this.rotate_xz(new vec3([max.x, max.y, max.z]), c, s).add(position);
        B = this.rotate_xz(new vec3([max.x, min.y, max.z]), c, s).add(position);
        C = this.rotate_xz(new vec3([min.x, max.y, max.z]), c, s).add(position);
        D = this.rotate_xz(new vec3([min.x, min.y, max.z]), c, s).add(position);
        this.add_quad(A, B, C, D, coords1);
    };
    ModelBatch.prototype.add_quad = function (A, B, C, D, coords) {
        this.add_vertex(A.x, A.y, A.z, coords.z, coords.w);
        this.add_vertex(B.x, B.y, B.z, coords.z, coords.y);
        this.add_vertex(C.x, C.y, C.z, coords.x, coords.w);
        this.add_vertex(C.x, C.y, C.z, coords.x, coords.w);
        this.add_vertex(B.x, B.y, B.z, coords.z, coords.y);
        this.add_vertex(D.x, D.y, D.z, coords.x, coords.y);
    };
    ModelBatch.prototype.add_half_quad = function (A, B, C, coords) {
        this.add_vertex(A.x, A.y, A.z, coords.z, coords.w);
        this.add_vertex(B.x, B.y, B.z, coords.z, coords.y);
        this.add_vertex(C.x, C.y, C.z, coords.x, coords.w);
    };
    ModelBatch.prototype.add_vertex = function (x, y, z, u, v) {
        if (this.current_count >= this.count)
            return;
        this.vertex_buffer[this.current_count * 5 + 0] = x;
        this.vertex_buffer[this.current_count * 5 + 1] = y;
        this.vertex_buffer[this.current_count * 5 + 2] = z;
        this.vertex_buffer[this.current_count * 5 + 3] = u;
        this.vertex_buffer[this.current_count * 5 + 4] = v;
        this.current_count++;
    };
    return ModelBatch;
})();
;
//# sourceMappingURL=modelbatch.js.map