var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FrameBuffer = (function (_super) {
    __extends(FrameBuffer, _super);
    function FrameBuffer(engine, format, width, height, depth) {
        _super.call(this);
        this.engine = engine;
        this.width = width;
        this.height = height;
        this.size = new vec2([width, height]);
        if (format != FrameBuffer.RGBA8888)
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
    FrameBuffer.prototype.begin = function () {
        var gl = this.engine.webgl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.viewport(0, 0, this.width, this.height);
    };
    FrameBuffer.prototype.end = function () {
        var gl = this.engine.webgl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    FrameBuffer.prototype.clear = function () {
        var gl = this.engine.webgl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    FrameBuffer.prototype.clear_transparent = function () {
        var gl = this.engine.webgl;
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    FrameBuffer.RGBA8888 = 0;
    return FrameBuffer;
})(Texture);
//# sourceMappingURL=framebuffer.js.map