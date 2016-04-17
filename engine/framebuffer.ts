class FrameBuffer extends Texture {
    width: number;
    height: number;

    framebuffer: WebGLFramebuffer;
    texture: WebGLTexture;
    buffer: WebGLBuffer;

    static RGBA8888: number = 0;

    constructor(engine: Engine, format: number, width: number, height: number, depth: boolean) {
        super();
        this.engine = engine
        this.width = width
        this.height = height
        this.size = new vec2([width, height]);

        if(format != FrameBuffer.RGBA8888)
            new Error("FrameBuffer: Unsupported format");

        if (depth)
            new Error("FrameBuffer: Unsupported depth type");

        var gl = this.engine.webgl;
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        this.texture = gl.createTexture();
        this.handle = this.texture;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        //this.buffer = gl.createRenderbuffer();
        //gl.bindRenderbuffer(gl.RENDERBUFFER, this.buffer);
        //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.buffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    begin() {
        var gl = this.engine.webgl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(0, 0, this.width, this.height);
    }

    end() {
        var gl = this.engine.webgl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    clear() {
        var gl = this.engine.webgl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    clear_transparent() {
        var gl = this.engine.webgl;
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}