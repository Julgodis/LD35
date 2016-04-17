var SpriteBatch = (function () {
    function SpriteBatch(engine, count) {
        this.engine = engine;
        this.in_use = false;
        this.shader = null;
        this.count = count;
        this.current_count = 0;
        this.buffers = [];
        this.textures = [];
        this.texture_buffer = new Int32Array(this.count);
        this.vertex_buffer = new Float32Array(this.count * (2 + 2));
        var gl = this.engine.webgl;
        this.array_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex_buffer, gl.DYNAMIC_DRAW);
    }
    SpriteBatch.prototype.use_shader = function (shader) {
        if (!this.in_use)
            new Error("Batch::use_shader");
        this.shader = shader;
        if (this.shader == null)
            return;
        this.shader.bind();
        if (this.buffers[this.shader.program_index] == null) {
            var position = this.shader.getVertexAttr("position");
            var texture = this.shader.getVertexAttr("texture_coords");
            var gl = this.engine.webgl;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.array_buffer);
            gl.enableVertexAttribArray(position.handle);
            gl.vertexAttribPointer(position.handle, 2, gl.FLOAT, false, 4 * 4, 0);
            gl.enableVertexAttribArray(texture.handle);
            gl.vertexAttribPointer(texture.handle, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    };
    SpriteBatch.prototype.begin = function () {
        if (this.in_use)
            new Error("SpriteBatch::begin");
        this.in_use = true;
        this.current_count = 0;
        this.textures = [];
    };
    SpriteBatch.prototype.end = function () {
        if (!this.in_use)
            new Error("SpriteBatch::end");
        this.in_use = false;
        if (this.current_count == 0)
            return;
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
    SpriteBatch.prototype.draw2f = function (texture, position, size) {
        this.draw(texture, position.x, position.y, size.x, size.y);
    };
    SpriteBatch.prototype.draw = function (texture, x, y, width, height) {
        // TODO: check if we have added the texture before
        this.textures.push({ index: this.textures.length, texture: texture });
        this.add_vertex(this.textures.length - 1, x - width * 0.5, y - height * 0.5, 0.0, 0.0);
        this.add_vertex(this.textures.length - 1, x + width * 0.5, y - height * 0.5, 1.0, 0.0);
        this.add_vertex(this.textures.length - 1, x - width * 0.5, y + height * 0.5, 0.0, 1.0);
        this.add_vertex(this.textures.length - 1, x - width * 0.5, y + height * 0.5, 0.0, 1.0);
        this.add_vertex(this.textures.length - 1, x + width * 0.5, y - height * 0.5, 1.0, 0.0);
        this.add_vertex(this.textures.length - 1, x + width * 0.5, y + height * 0.5, 1.0, 1.0);
    };
    SpriteBatch.prototype.draw_text = function (text) {
        this.draw_text_at(text, text.position);
    };
    SpriteBatch.prototype.draw_text_at = function (text, position) {
        if (text.need_update)
            text.update();
        this.draw(text, position.x + text.text_width * 0.5, position.y + text.text_height * 0.5, text.text_width, text.text_height);
    };
    SpriteBatch.prototype.add_vertex = function (tex_id, x, y, u, v) {
        if (this.current_count >= this.count)
            new Error("SpriteBatch::add_vertex");
        this.texture_buffer[this.current_count] = tex_id;
        this.vertex_buffer[this.current_count * 4 + 0] = x;
        this.vertex_buffer[this.current_count * 4 + 1] = y;
        this.vertex_buffer[this.current_count * 4 + 2] = u;
        this.vertex_buffer[this.current_count * 4 + 3] = v;
        this.current_count++;
    };
    return SpriteBatch;
})();
;
//# sourceMappingURL=spritebatch.js.map