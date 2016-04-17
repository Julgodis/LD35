class Texture {
    engine: Engine
    handle: WebGLTexture;
    size: vec2;

    bind(index: number = 0) {
        var gl = this.engine.webgl;

        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, this.handle);
    }
};

class ImageTexture extends Texture {
    image: any;

    mip: boolean;
    options: any;

    constructor(engine: Engine, image: any, mip: boolean = true, options: any = null) {
        super();
        this.engine = engine;
        this.image = image;
        this.mip = mip;
        this.options = options;

        var gl = this.engine.webgl;
        this.handle = gl.createTexture();
        this.update()

        if (this.options != null &&
            this.options["pixelate"] != null &&
            this.options["pixelate"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        if (this.options != null &&
            this.options["repeat_x"] != null &&
            this.options["repeat_x"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        }

        if (this.options != null &&
            this.options["repeat_y"] != null &&
            this.options["repeat_y"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        if (this.mip) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.generateMipmap(gl.TEXTURE_2D);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    update() {
        this.bind()

        var gl = this.engine.webgl;
        var from_type: number = gl.RGBA;
        var of_type: number = gl.UNSIGNED_BYTE;
        if (this.options != null && this.options["opengl_type"] != null) {
            from_type = this.options["opengl_type"] as number;
        }

        if (this.options != null && this.options["opengl_data_type"] != null) {
            of_type = this.options["opengl_data_type"] as number;
        }

        if (this.image instanceof Float32Array || this.image instanceof Uint8Array) {
            if (this.options == null || this.options["width"] == null) {
                alert("error: Unknown Width");
            }

            if (this.options == null || this.options["height"] == null) {
                alert("error: Unknown Height");
            }

            var width = <number>this.options["width"];
            var height = <number>this.options["height"];
            gl.texImage2D(gl.TEXTURE_2D, 0, from_type, width, height, 0, from_type, of_type, this.image);

            this.size = new vec2([width, height]);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, from_type, from_type, of_type, <HTMLImageElement>this.image);  // NOTE(Wase): From Image
            this.size = new vec2([(<HTMLImageElement>this.image).width, (<HTMLImageElement>this.image).height]);
        }
    }

    free() {
        var gl = this.engine.webgl;
        gl.deleteTexture(this.handle);
    }
} 