var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Texture = (function () {
    function Texture() {
    }
    Texture.prototype.bind = function (index) {
        if (index === void 0) { index = 0; }
        var gl = this.engine.webgl;
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, this.handle);
    };
    return Texture;
})();
;
var ImageTexture = (function (_super) {
    __extends(ImageTexture, _super);
    function ImageTexture(engine, image, mip, options) {
        if (mip === void 0) { mip = true; }
        if (options === void 0) { options = null; }
        _super.call(this);
        this.engine = engine;
        this.image = image;
        this.mip = mip;
        this.options = options;
        var gl = this.engine.webgl;
        this.handle = gl.createTexture();
        this.update();
        if (this.options != null &&
            this.options["pixelate"] != null &&
            this.options["pixelate"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        if (this.options != null &&
            this.options["repeat_x"] != null &&
            this.options["repeat_x"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        }
        if (this.options != null &&
            this.options["repeat_y"] != null &&
            this.options["repeat_y"]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        if (this.mip) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    ImageTexture.prototype.update = function () {
        this.bind();
        var gl = this.engine.webgl;
        var from_type = gl.RGBA;
        var of_type = gl.UNSIGNED_BYTE;
        if (this.options != null && this.options["opengl_type"] != null) {
            from_type = this.options["opengl_type"];
        }
        if (this.options != null && this.options["opengl_data_type"] != null) {
            of_type = this.options["opengl_data_type"];
        }
        if (this.image instanceof Float32Array || this.image instanceof Uint8Array) {
            if (this.options == null || this.options["width"] == null) {
                alert("error: Unknown Width");
            }
            if (this.options == null || this.options["height"] == null) {
                alert("error: Unknown Height");
            }
            var width = this.options["width"];
            var height = this.options["height"];
            gl.texImage2D(gl.TEXTURE_2D, 0, from_type, width, height, 0, from_type, of_type, this.image);
            this.size = new vec2([width, height]);
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, from_type, from_type, of_type, this.image); // NOTE(Wase): From Image
            this.size = new vec2([this.image.width, this.image.height]);
        }
    };
    ImageTexture.prototype.free = function () {
        var gl = this.engine.webgl;
        gl.deleteTexture(this.handle);
    };
    return ImageTexture;
})(Texture);
//# sourceMappingURL=texture.js.map