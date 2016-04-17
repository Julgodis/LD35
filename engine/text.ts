var textCtx = document.createElement("canvas").getContext("2d");

function render_canvas_text(text: string, width: number, height: number, font: string, color: string, center: boolean) {
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

function render_canvas_text_stroke(text: string, width: number, height: number, font: string, color: string, center: boolean, stroke_width: number, stroke_color: string) {
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

class TextTexture extends Texture  {
    private _data: string;
    options: any;
    text_width: number;
    text_height: number;

    position: vec3;

    need_update: boolean;
    private tex: ImageTexture;

    constructor(engine: Engine, data: string, x: number, y: number, z: number, width: number, height: number, options: any = null) {
        super();
        this.engine = engine;
        this._data = data;
        this.options = options;
        this.text_width = width;
        this.text_height = height;
        this.position = new vec3([x, y, z]);

        this.tex = null;

        this.update();
    }

    set data(value: string) {
        this.need_update = true;
        this._data = value;
    }

    get data(): string {
        return this._data;
    }

    free() {
        if (this.tex != null)
            this.tex.free();
    }

    update() {
        var canvas_image: HTMLCanvasElement;

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
        } else
            canvas_image = render_canvas_text(this._data.toString(), this.text_width, this.text_height, font, color, center);
 
        if (this.tex != null)
            this.tex.free();

        this.tex = new ImageTexture(this.engine, canvas_image, false, this.options);
        this.handle = this.tex.handle;
        this.size = this.tex.size;
    }
}