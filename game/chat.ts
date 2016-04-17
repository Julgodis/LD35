var chatCtx = document.createElement("canvas").getContext("2d");

function render_chat_bubble(width: number, height: number) {
    chatCtx.canvas.width = width;
    chatCtx.canvas.height = height;

    //chatCtx.msImageSmoothingEnabled = false;
    //chatCtx.mozImageSmoothingEnabled = false;
    //chatCtx.webkitImageSmoothingEnabled = false;
    chatCtx.imageSmoothingEnabled = false;
    chatCtx.globalAlpha = 0.0;
    height -= 42;

    chatCtx.clearRect(0, 0, chatCtx.canvas.width, chatCtx.canvas.height);
    chatCtx.globalAlpha = 1.0;
    
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 0, 0, 12, 12, 0, 0, 24, 24);
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 18, 0, 9, 12, width - 24, 0, 18, 24);
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 0, 15, 12, 12, 0, height - 24, 24, 24);
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 18, 15, 9, 12, width - 24, height - 24, 18, 24);

    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 12, 0, 3, 12, 24, 0, (width - 24 - 18), 24);
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 12, 15, 3, 12, 24, height - 24, (width - 24 - 18), 24);
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 0, 12, 12, 3, 0, 24, 24, (height - 24 - 24));
    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 18, 12, 12, 3, width - 24, 24, 24, (height - 24 - 24));

    chatCtx.drawImage((<ImageTexture>chat_bubble_1_texture).image, 12, 9, 9, 9, 24, 24, (width - 24 - 18), (height - 24 - 24));
    chatCtx.drawImage((<ImageTexture>chat_bubble_2_texture).image, 0, 0, 21, 21, (width - 24 - 18) / 2, (height - 24 - 24 + 42 - 6), 42, 42);

    return chatCtx.canvas;
}

function render_chat_text(width: number, height: number, text: string[]) {
    chatCtx.canvas.width = width;
    chatCtx.canvas.height = height;

    //chatCtx.msImageSmoothingEnabled = false;
    //chatCtx.mozImageSmoothingEnabled = false;
    //chatCtx.webkitImageSmoothingEnabled = false;
    chatCtx.imageSmoothingEnabled = false;
    chatCtx.globalAlpha = 0.0;
    height -= 42;

    chatCtx.clearRect(0, 0, chatCtx.canvas.width, chatCtx.canvas.height);

    chatCtx.globalAlpha = 1.0;

    chatCtx.font = "24px pixel_font";
    chatCtx.textAlign = "left";
    chatCtx.textBaseline = "middle";
    chatCtx.fillStyle = "#000";

    for (var i = 0; i < text.length; i++) {
        var text_data = text[i];
        chatCtx.fillText(text_data, 24 + 8, 24 + 8 + i * 24, width - 24 - 18);
    }

    return chatCtx.canvas;
}

class ChatCommand {
    chat: ChatBubble
    follow: GameObject
    complete: (command: ChatCommand) => void
}

class ChatBubble extends Texture {

    private _text: string[]

    position: vec3
    size: vec2
    scale: number

    shown: boolean;
    time_limit: number;
    lifetime: number;

    tex_text: ImageTexture;
    tex_bubble: ImageTexture;

    skip_by_x: boolean;
    skip_by_space: boolean;

    constructor(engine: Engine, size: vec2) {
        super();

        this.engine = engine;
        this._text = [ ];
        this.position = new vec3([0, 0, 0]);
        this.size = size;
        this.tex_text = null;
        this.tex_bubble = null;
        this.scale = 1.0;

        this.skip_by_x = false;
        this.skip_by_space = false;

        this.shown = false;
        this.time_limit = -1;
        this.lifetime = -1;

        if (this.size.x == 0) this.size.x = 1;
        if (this.size.y == 0) this.size.y = 1;

        this.update();
    }

    set text(value: string) {   
        var line_breaks = value.split('\n');

        this._text = [];
        for (var l = 0, line_len = line_breaks.length; l < line_len; l++) {
            var words = line_breaks[l].split(' ');

            var test = "";
            for (var w = 0, len = words.length; w < len; w++) {
                var prev = test;
                test += words[w];

                chatCtx.font = "24px 'pixel_font'";
                var width = chatCtx.measureText(test).width;
                if (width > this.size.x - 24 - 18) {
                    this._text.push(prev);
                    test = words[w] + " ";
                } else
                    test += " ";
            }
            
            this._text.push(test);
        }

        this.size.y = this._text.length * 24 + 42 + 24 + 24;
        this.update();
    }

    get text(): string {
        var output = "";
        for (var i in this._text) {
            output += this._text[i] + "\n";
        }

        return output;
    }

    free() {
        if (this.tex_bubble != null) this.tex_bubble.free();
        if (this.tex_text != null) this.tex_text.free();
    }

    update() {  
        if (this.tex_bubble != null) this.tex_bubble.free();
        if (this.tex_text != null) this.tex_text.free();
   
        var bubble_image = render_chat_bubble(this.size.x, this.size.y);
        this.tex_bubble = new ImageTexture(this.engine, bubble_image, false);

        var text_image = render_chat_text(this.size.x, this.size.y, this._text);
        this.tex_text = new ImageTexture(this.engine, text_image, false);

        this.handle = this.tex_bubble.handle;
        this.size = this.tex_bubble.size;
    }
}