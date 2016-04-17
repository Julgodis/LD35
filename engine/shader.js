var global_shader_index = 0;
var Shader = (function () {
    function Shader(engine, vertex, frag) {
        this.customUniforms = null;
        this.engine = engine;
        this.fragmentShaderContent = frag;
        this.vertexShaderContent = vertex;
        this.uniforms = {};
        this.program_index = global_shader_index++;
        var gl = this.engine.webgl;
        this.vertexPointersCache = {};
        this.uniformsCache = {};
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexShaderContent);
        gl.shaderSource(this.fragmentShader, this.fragmentShaderContent);
        gl.compileShader(this.vertexShader);
        gl.compileShader(this.fragmentShader);
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(this.vertexShader));
            return null;
        }
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(this.fragmentShader));
            return null;
        }
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(this.program));
        }
        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            alert("Unable to validate the shader program " + gl.getProgramInfoLog(this.program));
        }
        gl.useProgram(this.program);
        gl.useProgram(null);
        if (gl.getError() != gl.NO_ERROR) {
            alert("" + gl.getError());
        }
        if (this.customUniforms != null) {
            for (var uName in this.customUniforms) {
                var data = this.customUniforms[uName];
                if (data.type == "array") {
                    var uni = {
                        entry: null,
                        type: data.type,
                        value: data.value,
                        names: [],
                        array_type: data.array_type
                    };
                    var i = 0;
                    for (var x in uni.value) {
                        uni.names.push(uName + "[" + i + "]");
                        i++;
                    }
                    this.uniforms[uName] = uni;
                    continue;
                }
                if (!this.hasUniform(uName))
                    continue;
                this.uniforms[uName] = {
                    entry: this.getUniform(uName),
                    type: data.type,
                    value: data.value,
                    names: [],
                    array_type: ""
                };
            }
        }
    }
    Shader.prototype.bind = function () {
        var gl = this.engine.webgl;
        gl.useProgram(this.program);
    };
    Shader.prototype.setFloat = function (name, value) {
        this.setFloatUniform(this.getUniform(name), value);
    };
    Shader.prototype.setFloatUniform = function (uniform, value) {
        if (uniform == null)
            return;
        var gl = this.engine.webgl;
        gl.uniform1f(uniform.handle, value);
    };
    Shader.prototype.setInteger = function (name, value) {
        this.setIntegerUniform(this.getUniform(name), value);
    };
    Shader.prototype.setIntegerUniform = function (uniform, value) {
        if (uniform == null)
            return;
        var gl = this.engine.webgl;
        gl.uniform1i(uniform.handle, value);
    };
    Shader.prototype.setFloat2 = function (name, a, b) {
        this.setFloat2Uniform(this.getUniform(name), a, b);
    };
    Shader.prototype.setFloat2Uniform = function (uniform, a, b) {
        if (uniform == null)
            return;
        var gl = this.engine.webgl;
        gl.uniform2f(uniform.handle, a, b);
    };
    Shader.prototype.setVec2 = function (name, value) {
        this.setVec2Uniform(this.getUniform(name), value);
    };
    Shader.prototype.setVec2Uniform = function (uniform, value) {
        var gl = this.engine.webgl;
        gl.uniform2f(uniform.handle, value.x, value.y);
    };
    Shader.prototype.setVec3 = function (name, value) {
        this.setVec3Uniform(this.getUniform(name), value);
    };
    Shader.prototype.setVec3Uniform = function (uniform, value) {
        var gl = this.engine.webgl;
        gl.uniform3f(uniform.handle, value.x, value.y, value.z);
    };
    Shader.prototype.setVec4 = function (name, value) {
        this.setVec4Uniform(this.getUniform(name), value);
    };
    Shader.prototype.setVec4Uniform = function (uniform, value) {
        var gl = this.engine.webgl;
        gl.uniform4f(uniform.handle, value.x, value.y, value.z, value.w);
    };
    /*setMatrix2(name: string, mat: mat2) {
        this.setMatrix2Uniform(this.getUniform(name), mat);
    }
    setMatrix2Uniform(uniform: Uniform, mat: mat2) {
        var gl = this.engine.webgl;
        gl.uniformMatrix2fv(uniform.handle, false, mat.values);
    }
    */
    Shader.prototype.setMatrix3 = function (name, mat) {
        this.setMatrix3Uniform(this.getUniform(name), mat);
    };
    Shader.prototype.setMatrix3Uniform = function (uniform, mat) {
        var gl = this.engine.webgl;
        gl.uniformMatrix3fv(uniform.handle, false, mat.values);
    };
    Shader.prototype.setMatrix4 = function (name, mat) {
        this.setMatrix4Uniform(this.getUniform(name), mat);
    };
    Shader.prototype.setMatrix4Uniform = function (uniform, mat) {
        var gl = this.engine.webgl;
        gl.uniformMatrix4fv(uniform.handle, false, mat.values);
    };
    Shader.prototype.hasUniform = function (name) {
        var gl = this.engine.webgl;
        if (this.uniformsCache[name] != null)
            return true;
        var handle = gl.getUniformLocation(this.program, name);
        return handle != null;
    };
    Shader.prototype.getUniform = function (name) {
        var gl = this.engine.webgl;
        if (this.uniformsCache[name] != null)
            return this.uniformsCache[name];
        var handle = gl.getUniformLocation(this.program, name);
        if (handle == null) {
            return null;
            throw new Error("Unknown uniform: " + handle);
        }
        var uniform = { name: name, handle: handle };
        this.uniformsCache[name] = uniform;
        return uniform;
    };
    Shader.prototype.getVertexAttr = function (name) {
        var gl = this.engine.webgl;
        if (this.vertexPointersCache[name] != null)
            return this.vertexPointersCache[name];
        var handle = gl.getAttribLocation(this.program, name);
        if (handle < 0) {
            throw new Error("Unknown attribute: " + handle + ", " + name);
        }
        var vertex = { name: name, handle: handle };
        this.vertexPointersCache[name] = vertex;
        return vertex;
    };
    return Shader;
})();
//# sourceMappingURL=shader.js.map