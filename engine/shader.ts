interface VertexPointerEntry {
    name: string;
    handle: number;
}

interface UniformEntry {
    name: string;
    handle: WebGLUniformLocation;
}

interface Uniform {
    entry: UniformEntry | string;
    type: string;
    value: any;
}

interface UniformArray extends Uniform {
    names: string[];
    array_type: string;
}

var global_shader_index: number = 0;
class Shader {
    engine: Engine;
    fragmentShaderContent: string;
    vertexShaderContent: string;

    fragmentShader: WebGLShader;
    vertexShader: WebGLShader;

    program: WebGLProgram;
    program_index: number;

    vertexPointersCache: { [name: string]: VertexPointerEntry; };
    uniformsCache: { [name: string]: UniformEntry; };

    uniforms: { [name: string]: Uniform; };
    customUniforms: any = null;

    constructor(engine: Engine, vertex?: string, frag?: string) {
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
                    var uni = <UniformArray>{
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

                this.uniforms[uName] = <Uniform>{
                    entry: this.getUniform(uName),
                    type: data.type,
                    value: data.value,
                    names: [],
                    array_type: ""
                };
            }

        }
    }

    bind() {
        var gl = this.engine.webgl;
        gl.useProgram(this.program);
    }

    setFloat(name: string, value: number) {
        this.setFloatUniform(this.getUniform(name), value);
    }

    setFloatUniform(uniform: UniformEntry, value: number) {
        if (uniform == null) return;
        var gl = this.engine.webgl;
        gl.uniform1f(uniform.handle, value);
    }

    setInteger(name: string, value: number) {
        this.setIntegerUniform(this.getUniform(name), value);
    }

    setIntegerUniform(uniform: UniformEntry, value: number) {
        if (uniform == null) return;
        var gl = this.engine.webgl;
        gl.uniform1i(uniform.handle, value);
    }

    setFloat2(name: string, a: number, b: number) {
        this.setFloat2Uniform(this.getUniform(name), a, b);
    }

    setFloat2Uniform(uniform: UniformEntry, a: number, b: number) {
        if (uniform == null) return;
        var gl = this.engine.webgl;
        gl.uniform2f(uniform.handle, a, b);
    }


    setVec2(name: string, value: vec2) {
        this.setVec2Uniform(this.getUniform(name), value);
    }

    setVec2Uniform(uniform: UniformEntry, value: vec2) {
        var gl = this.engine.webgl;
        gl.uniform2f(uniform.handle, value.x, value.y);
    }

    setVec3(name: string, value: vec3) {
        this.setVec3Uniform(this.getUniform(name), value);
    }

    setVec3Uniform(uniform: UniformEntry, value: vec3) {
        var gl = this.engine.webgl;
        gl.uniform3f(uniform.handle, value.x, value.y, value.z);
    }

    setVec4(name: string, value: vec4) {
        this.setVec4Uniform(this.getUniform(name), value);
    }

    setVec4Uniform(uniform: UniformEntry, value: vec4) {
        var gl = this.engine.webgl;
        gl.uniform4f(uniform.handle, value.x, value.y, value.z, value.w);
    }
    /*setMatrix2(name: string, mat: mat2) {
        this.setMatrix2Uniform(this.getUniform(name), mat);
    }
    setMatrix2Uniform(uniform: Uniform, mat: mat2) {
        var gl = this.engine.webgl;
        gl.uniformMatrix2fv(uniform.handle, false, mat.values);
    }
    */
    setMatrix3(name: string, mat: mat3) {
        this.setMatrix3Uniform(this.getUniform(name), mat);
    }

    setMatrix3Uniform(uniform: UniformEntry, mat: mat3) {
        var gl = this.engine.webgl;
        gl.uniformMatrix3fv(uniform.handle, false, mat.values);
    }
    
    setMatrix4(name: string, mat: mat4) {
        this.setMatrix4Uniform(this.getUniform(name), mat);
    }
    setMatrix4Uniform(uniform: UniformEntry, mat: mat4) {
        var gl = this.engine.webgl;
        gl.uniformMatrix4fv(uniform.handle, false, mat.values);
    }

    hasUniform(name: string): boolean {
        var gl = this.engine.webgl;

        if (this.uniformsCache[name] != null)
            return true;

        var handle = gl.getUniformLocation(this.program, name);
        return handle != null;
    }

    getUniform(name: string): UniformEntry {
        var gl = this.engine.webgl;

        if (this.uniformsCache[name] != null)
            return this.uniformsCache[name];

        var handle = gl.getUniformLocation(this.program, name);
        if (handle == null) {
            return null;
            throw new Error("Unknown uniform: " + handle);
        }

        var uniform: UniformEntry = { name: name, handle: handle };
        this.uniformsCache[name] = uniform;

        return uniform;
    }

    getVertexAttr(name: string): VertexPointerEntry {
        var gl = this.engine.webgl;

        if (this.vertexPointersCache[name] != null)
            return this.vertexPointersCache[name];

        var handle = gl.getAttribLocation(this.program, name);
        if (handle < 0) {
            throw new Error("Unknown attribute: " + handle + ", " + name);
        }

        var vertex: VertexPointerEntry = { name: name, handle: handle };
        this.vertexPointersCache[name] = vertex;

        return vertex;
    }
} 