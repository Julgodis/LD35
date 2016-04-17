var batch_count = 0;
var BillboardBatch = (function () {
    function BillboardBatch(engine, count) {
        this.engine = engine;
        this.in_use = false;
        this.shader = null;
        this.count = count;
        this.current_count = 0;
        this.buffers = [];
        this.textures = [];
        this.texture_buffer = new Int32Array(this.count);
        this.vertex_buffer = new Float32Array(this.count * (3 + 2 + 3 + 4));
        var gl = this.engine.webgl;
        this.array_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex_buffer, gl.DYNAMIC_DRAW);
    }
    BillboardBatch.prototype.use_shader = function (shader) {
        if (!this.in_use)
            new Error("BillboardBatch::use_shader");
        this.shader = shader;
        if (this.shader == null)
            return;
        this.shader.bind();
        //if (this.buffers[this.shader.program_index] == null) {
        var position = this.shader.getVertexAttr("position");
        var texture = this.shader.getVertexAttr("texture_coords");
        var offset = this.shader.getVertexAttr("offset");
        var color = this.shader.getVertexAttr("color");
        var gl = this.engine.webgl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.enableVertexAttribArray(position.handle);
        gl.vertexAttribPointer(position.handle, 3, gl.FLOAT, false, 12 * 4, 0);
        gl.enableVertexAttribArray(texture.handle);
        gl.vertexAttribPointer(texture.handle, 2, gl.FLOAT, false, 12 * 4, 3 * 4);
        gl.enableVertexAttribArray(offset.handle);
        gl.vertexAttribPointer(offset.handle, 3, gl.FLOAT, false, 12 * 4, 5 * 4);
        gl.enableVertexAttribArray(color.handle);
        gl.vertexAttribPointer(color.handle, 4, gl.FLOAT, false, 12 * 4, 8 * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //    this.buffers[this.shader.program_index] = true;
        //}
    };
    BillboardBatch.prototype.begin = function () {
        if (this.in_use)
            throw new Error("BillboardBatch::begin");
        this.in_use = true;
        this.current_count = 0;
        this.textures = [];
    };
    BillboardBatch.prototype.end = function () {
        if (!this.in_use)
            throw new Error("BillboardBatch::end");
        this.in_use = false;
        if (this.current_count == 0)
            return;
        batch_count += this.current_count;
        var gl = this.engine.webgl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex_buffer, gl.DYNAMIC_DRAW);
        var gl = this.engine.webgl;
        var index = 0;
        var last_index = 0;
        var texture_index = -1;
        for (var i = 0; i < this.current_count; i += 1) {
            var tex_id = this.texture_buffer[i];
            if (tex_id != texture_index) {
                if (index > last_index)
                    gl.drawArrays(gl.TRIANGLES, last_index, index - last_index);
                last_index = index;
                this.textures[tex_id].texture.bind();
                texture_index = tex_id;
            }
            index++;
        }
        if (index > last_index) {
            gl.drawArrays(gl.TRIANGLES, last_index, index - last_index);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    /*
    draw(texture: Texture, x: number, y: number, width: number, height: number): void {
        // TODO: check if we have added the texture before
        this.textures.push({ index: this.textures.length, texture: texture });

        var z = 0.0;
        this.add_vertex(this.textures.length - 1, x, y, z, 0.0, 0.0, -1.0 * width, -1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, 1.0, 0.0, 1.0 * width, -1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, 0.0, 1.0, -1.0 * width, 1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, 0.0, 1.0, -1.0 * width, 1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, 1.0, 0.0, 1.0 * width, -1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, 1.0, 1.0, 1.0 * width, 1.0 * height);
    }
    */
    BillboardBatch.prototype.draw_spritesheet = function (texture, position, size, _coords, direction, color) {
        this.draw_spritesheet_rotation(texture, position, size, _coords, direction, 0, color);
    };
    BillboardBatch.prototype.draw_spritesheet_rotation = function (texture, position, size, _coords, direction, rotation, color) {
        // TODO: check if we have added the texture before
        this.textures.push({ index: this.textures.length, texture: texture });
        var coords = _coords.copy();
        if (!direction) {
            var t = coords.x;
            coords.x = coords.z;
            coords.z = t;
        }
        this.add_vertex(this.textures.length - 1, position, coords.x, coords.y, -1.0 * size.x, -1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.z, coords.y, 1.0 * size.x, -1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.x, coords.w, -1.0 * size.x, 1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.x, coords.w, -1.0 * size.x, 1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.z, coords.y, 1.0 * size.x, -1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.z, coords.w, 1.0 * size.x, 1.0 * size.y, rotation, color);
    };
    BillboardBatch.prototype.draw_chat_bubble = function (chat, position, _size, direction) {
        var size = _size.copy().mul(chat.scale);
        this.draw_image(chat.tex_bubble, position, size, direction);
        this.draw_image(chat.tex_text, position, size, true);
    };
    BillboardBatch.prototype.draw_image = function (texture, position, size, direction) {
        // TODO: check if we have added the texture before
        this.textures.push({ index: this.textures.length, texture: texture });
        var coords = new vec4([0, 0, 1, 1]);
        var rotation = 0;
        var color = new vec4([1, 1, 1, 1]);
        if (!direction) {
            var t = coords.x;
            coords.x = coords.z;
            coords.z = t;
        }
        this.add_vertex(this.textures.length - 1, position, coords.x, coords.y, -1.0 * size.x, -1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.z, coords.y, 1.0 * size.x, -1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.x, coords.w, -1.0 * size.x, 1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.x, coords.w, -1.0 * size.x, 1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.z, coords.y, 1.0 * size.x, -1.0 * size.y, rotation, color);
        this.add_vertex(this.textures.length - 1, position, coords.z, coords.w, 1.0 * size.x, 1.0 * size.y, rotation, color);
    };
    /*
    draw_spritesheet_2(texture: Texture, x: number, y: number, width: number, height: number, sw: number, sh: number, sid: number): void {
        this.draw_spritesheet_3d(texture, x, y, 0.0, width, height, sw, sh, sid);
    }

    draw_spritesheet_3d(texture: Texture, x: number, y: number, z: number, width: number, height: number, sw: number, sh: number, sid: number): void {
        // TODO: check if we have added the texture before
        this.textures.push({ index: this.textures.length, texture: texture });

        var m = (1 / 500.0);
        var w = (texture.size.x / sw) | 0;
        var du = 1 / (texture.size.x / sw);
        var dv = 1 / (texture.size.y / sh);

        var u1 = ((sid % w) + 0) * du + m;
        var u2 = ((sid % w) + 1) * du - m;

        var row = (sid / w) | 0;
        var v1 = (row + 0) * dv + m;
        var v2 = (row + 1) * dv - m;

        this.add_vertex(this.textures.length - 1, x, y, z, u1, v1, -1.0 * width, -1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, u2, v1, 1.0 * width, -1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, u1, v2, -1.0 * width, 1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, u1, v2, -1.0 * width, 1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, u2, v1, 1.0 * width, -1.0 * height);
        this.add_vertex(this.textures.length - 1, x, y, z, u2, v2, 1.0 * width, 1.0 * height);
    }
    */
    BillboardBatch.prototype.add_vertex = function (tex_id, position, u, v, ox, oy, angle, color) {
        if (this.current_count >= this.count)
            return;
        this.texture_buffer[this.current_count] = tex_id;
        this.vertex_buffer[this.current_count * 12 + 0] = position.x;
        this.vertex_buffer[this.current_count * 12 + 1] = position.y;
        this.vertex_buffer[this.current_count * 12 + 2] = position.z;
        this.vertex_buffer[this.current_count * 12 + 3] = u;
        this.vertex_buffer[this.current_count * 12 + 4] = v;
        this.vertex_buffer[this.current_count * 12 + 5] = ox;
        this.vertex_buffer[this.current_count * 12 + 6] = oy;
        this.vertex_buffer[this.current_count * 12 + 7] = angle;
        this.vertex_buffer[this.current_count * 12 + 8] = color.x;
        this.vertex_buffer[this.current_count * 12 + 9] = color.y;
        this.vertex_buffer[this.current_count * 12 + 10] = color.z;
        this.vertex_buffer[this.current_count * 12 + 11] = color.w;
        this.current_count++;
    };
    return BillboardBatch;
})();
;
//# sourceMappingURL=billboardbatch.js.map