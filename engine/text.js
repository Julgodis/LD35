var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var textCtx = document.createElement("canvas").getContext("2d");
function render_canvas_text(text, width, height, font, color, center) {
    textCtx.canvas.width = width;
    textCtx.canvas.height = height;
    textCtx.imageSmoothingEnabled = true;
    textCtx.font = font;
    if (center)
        textCtx.textAlign = "center";
    else
        textCtx.textAlign = "left";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = color;
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, center ? width / 2 : 0, height / 2);
    return textCtx.canvas;
}
function render_canvas_text_stroke(text, width, height, font, color, center, stroke_width, stroke_color) {
    textCtx.canvas.width = width;
    textCtx.canvas.height = height;
    textCtx.imageSmoothingEnabled = true;
    textCtx.font = font;
    if (center)
        textCtx.textAlign = "center";
    else
        textCtx.textAlign = "left";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = color;
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, center ? width / 2 : 0, height / 2);
    textCtx.lineWidth = stroke_width;
    textCtx.strokeStyle = stroke_color;
    textCtx.strokeText(text, center ? width / 2 : 0, height / 2);
    return textCtx.canvas;
}
var TextTexture = (function (_super) {
    __extends(TextTexture, _super);
    function TextTexture(engine, data, x, y, z, width, height, options) {
        if (options === void 0) { options = null; }
        _super.call(this);
        this.engine = engine;
        this._data = data;
        this.options = options;
        this.text_width = width;
        this.text_height = height;
        this.position = new vec3([x, y, z]);
        this.tex = null;
        this.update();
    }
    Object.defineProperty(TextTexture.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this.need_update = true;
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    TextTexture.prototype.free = function () {
        if (this.tex != null)
            this.tex.free();
    };
    TextTexture.prototype.update = function () {
        var canvas_image;
        var font = "20px monospace";
        if (this.options != null &&
            this.options["font"] != null) {
            font = this.options["font"];
        }
        var color = "#FFFFFF";
        if (this.options != null &&
            this.options["color"] != null) {
            color = this.options["color"];
        }
        var center = true;
        if (this.options != null &&
            this.options["center"] != null) {
            center = this.options["center"];
        }
        if (this.options != null &&
            this.options["stroke"] != null &&
            this.options["stroke"]) {
            var stroke_width = 1;
            var stroke_color = "#000000";
            if (this.options != null &&
                this.options["stroke_width"] != null) {
                stroke_width = this.options["stroke_width"];
            }
            canvas_image = render_canvas_text_stroke(this._data.toString(), this.text_width, this.text_height, font, color, center, stroke_width, stroke_color);
        }
        else
            canvas_image = render_canvas_text(this._data.toString(), this.text_width, this.text_height, font, color, center);
        if (this.tex != null)
            this.tex.free();
        this.tex = new ImageTexture(this.engine, canvas_image, false, this.options);
        this.handle = this.tex.handle;
        this.size = this.tex.size;
    };
    return TextTexture;
})(Texture);
//# sourceMappingURL=text.js.map