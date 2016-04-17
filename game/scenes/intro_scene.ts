class IntroScene extends Scene {

    title: TextTexture;
    by: TextTexture;
    rate: TextTexture;
    play: TextTexture;
    fps_text: TextTexture;

    last_mouse_left: boolean;
    clicked: boolean;

    animation: AnimationManager;
    position: vec3;
    color: vec4;
    base_color: vec4;

    constructor(engine: Engine) {
        super(engine, "intro");
        this.last_mouse_left = true;
        this.clicked = false;

        this.title = new TextTexture(engine, "The Time Shifter", -300, -180, 0, 600, 50, { center: true, font: "60px 'pixel_font'" });
        this.by = new TextTexture(engine, "Entry by Julgodis for Ludum Dare #34", -300, -150, 0, 600, 50, { center: true, font: "24px 'pixel_font'" });
        this.rate = new TextTexture(engine, "[ RATE ]", -540, 120, 0, 600, 50, { center: true, font: "30px 'pixel_font'" });
        this.play = new TextTexture(engine, "[ PLAY ]", -300, -20, 0, 600, 50, { center: true, font: "50px 'pixel_font'" });

        this.fps_text = new TextTexture(engine, "FPS: 000", -engine.width / 2 + 5, -engine.height / 2, 0.0, 300, 30, { center: false, font: "24px 'pixel_font'" });

        this.animation = new AnimationManager(player_texture, 16, 16);
        var dance_animation = this.animation.add_animation("dance",
            Animation.fsequence(24, 4),
            Animation.ft_repate(4, Animation.FrameTime * 3.5),
            true);
        this.animation.play("dance");

        this.position = new vec3([0, 0, 0]);
        this.color = new vec4([1, 1, 1, 1]);
        this.base_color = new vec4([135.0 / 255.0, 206.0 / 255.0, 250.0 / 255.0, 1.0]);
    }

    update(time: number, dt: number) {
        var mouse = engine.mouse;
        if (mouse.leftDown && !this.last_mouse_left && !this.clicked) {
            this.clicked = true;
            select_sound.play();
            if (mouse.position.x < 200 && mouse.position.y > 270) {
                open_rate();
                this.clicked = false;
            } else {
                (new Tween(this)).to({}, 3500.0).on(function (value: number) {
                    this.title.position.y -= value * 100;
                    this.by.position.y -= value * 100;
                    this.play.position.x -= value * 100;
                    this.rate.position.x -= value * 100;
                    this.position.x = value * 4;
                    this.color = new vec4([1 - value, 1 - value, 1 - value, 1]);
                }).start(engine.time).complete(this, function () {
                    this.title.free();
                    this.by.free();
                    this.rate.free();
                    this.play.free();

                    scene = new Story(this.engine);
                });
            }
        }
        this.last_mouse_left = mouse.leftDown;

        this.animation.update(time / 1000.0, dt);
    }

    render(time: number, dt: number) {
        var gl = engine.webgl;

        var temp_color = this.base_color.copy().mul(this.color);
        gl.clearColor(temp_color.r, temp_color.g, temp_color.b, temp_color.a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        projection_matrix = mat4.make2DProjection(engine.width, engine.height, 0.0, 2000.0);
        var translationMatrix = mat4.makeTranslate(engine.width / 2.0, engine.height - 120, 0);
        var scaleMatrix = mat4.makeScale(100, 100, 100);
        view_matrix = mat4.makeIdentity();
        view_matrix.multiply(scaleMatrix);
        view_matrix.multiply(translationMatrix);

        gl.disable(gl.DEPTH_TEST);
        billboard_batch.use_shader(billboard_3d_shader);
        billboard_3d_shader.setMatrix4("projection", projection_matrix);
        billboard_3d_shader.setMatrix4("view", view_matrix);
        billboard_3d_shader.setFloat("time", 0);
        billboard_3d_shader.setFloat("deform", 0);
        billboard_3d_shader.setInteger("sampler0", 0);
        billboard_batch.begin();

        for (var i = 0; i < 8; i++) {
            billboard_batch.draw_spritesheet(
                tilemap_texture,
                new vec3([i - 4, 1, 0]),
                new vec3([1, 1, 1]),
                new vec4([0, 0, 1.0 / 6.0, 16.0 / tilemap_texture.size.y]),
                true,
                this.color);
        }

        billboard_batch.draw_spritesheet_rotation(
            player_texture,
            this.position,
            new vec3([1, 1, 1]),
            this.animation.coords,
            false,
            Math.sin(engine.time / 200.0) * 0.005,
            this.color);

        billboard_batch.end();

        var fps = engine.fps;//(1000.0 / engine.dt_render);
        fps *= 1.0;
        this.fps_text.data = "FPS: " + (fps | 0).toString();
        batch_count = 0;

        batch2d.use_shader(engine.basic_2d_shader);
        engine.basic_2d_shader.setFloat2("origin", 0, 0);
        engine.basic_2d_shader.setFloat2("resolution", engine.width, engine.height);

        batch2d.begin();
        batch2d.draw_text(this.title);
        batch2d.draw_text(this.by);
        batch2d.draw_text(this.rate);
        batch2d.draw_text(this.play);
        batch2d.draw_text(this.fps_text);
        batch2d.end();

        gl.enable(gl.DEPTH_TEST);
    }
}