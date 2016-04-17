class LoseScene extends Scene {

    blood: ParticleEmitter;
    thank_you: TextTexture;
    by: TextTexture;
    rate: TextTexture;
    try_again: TextTexture;
    noob: TextTexture;
    fps_text: TextTexture;

    last_mouse_left: boolean;
    clicked: boolean;

    color: vec4;
    base_color: vec4;

    constructor(engine: Engine) {
        super(engine, "lose");
        this.last_mouse_left = true;
        this.clicked = false;

        {
            var pm = new ParticleEmitter(new vec3([1, 1, 1]));
            pm.position = new vec3([0, 0, 0]);
            pm.textures = [particle_texture_basic];
            pm.spawn_max = -1;
            pm.spawn_rate = -1;
            pm.lifetime = 2000.0;
            pm.gravity_effect = 1.0;
            pm.relative_position = new vec3([0, 0, 0]);
            pm.relative_random_position = new vec3([0, 0, 0]);
            pm.velocity = new vec3([0, -4.0, 0]);
            pm.random_velocity = new vec3([2.5, 2.5, 2.5]);
            pm.scale = 1.2 / 16;
            pm.scale_velocity = 0.01;
            pm.random_scale = 0.5 / 16;
            pm.color1 = new vec4([1, 0.2, 0.2, 1]);
            pm.color2 = new vec4([0.5, 0.0, 0.0, 0]);
            pm.random_color1 = new vec4([0.2, 0.1, 0.1, 0]);
            pm.random_color2 = new vec4([0.2, 0.1, 0.1, 0]);
            pm.rotation = 0;
            pm.random_rotation = 2.0;
            this.blood = pm;
        }

        this.thank_you = new TextTexture(engine, "Thank you for playing!", -200, -200, 0, 400, 50, { center: true, font: "30px 'pixel_font'" });
        this.by = new TextTexture(engine, "Entry by Julgodis for Ludum Dare #34", -300, -150, 0, 600, 50, { center: true, font: "24px 'pixel_font'" });
        this.rate = new TextTexture(engine, "[ RATE ]", -170, -60, 0, 600, 50, { center: true, font: "50px 'pixel_font'" });
        this.try_again = new TextTexture(engine, "[ TRY AGAIN ]", -470, -75, 0, 600, 50, { center: true, font: "30px 'pixel_font'" });
        this.noob = new TextTexture(engine, "[   NOOOB   ]", -470, -45, 0, 600, 50, { center: true, font: "30px 'pixel_font'" });

        this.fps_text = new TextTexture(engine, "FPS: 000", -engine.width / 2 + 5, -engine.height / 2, 0.0, 300, 30, { center: false, font: "24px 'pixel_font'" });

        this.color = new vec4([1, 1, 1, 1]);
        this.base_color = new vec4([135.0 / 255.0, 206.0 / 255.0, 250.0 / 255.0, 1.0]);
    }

    update(time: number, dt: number) {

        var mouse = engine.mouse;
        if (mouse.leftDown && !this.last_mouse_left && !this.clicked) {
            this.clicked = true;
            select_sound.play();
            if (mouse.position.x > engine.width / 2) {
                open_rate();
                this.clicked = false;
            } else {
                (new Tween(this)).to({}, 2000.0).on(function (value: number) {
                    this.thank_you.position.y -= value * 100;
                    this.by.position.y -= value * 100;
                    this.rate.position.y -= value * 100;
                    this.try_again.position.y -= value * 100;
                    this.noob.position.y -= value * 100;

                    this.color = new vec4([1 - value, 1 - value, 1 - value, 1]);
                }).start(engine.time).complete(this, function () {
                    this.thank_you.free();
                    this.by.free();
                    this.rate.free();
                    this.noob.free();
                    this.try_again.free();

                    scene = new Story(this.engine);
                });
            }
        }
        this.last_mouse_left = mouse.leftDown;

        this.blood.spawn_x(time, dt, 3);
        this.blood.update(time, dt, new vec3([0, 9.81, 0]));
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
            new vec3([0, 0.25, 0]),
            new vec3([1, 1, 1]),
            new vec4([0, 0, 1.0 / 8.0, 1.0 / 8.0]),
            true,
            1 / 4 + Math.sin(engine.time / 200.0) * 0.01,
            this.color);

        for (var pi in this.blood.particles) {
            var particle = this.blood.particles[pi];
            billboard_batch.draw_spritesheet_rotation(
                particle.texture,
                particle.position.copy().add(new vec3([-0.1, 0.2, 0])),
                this.blood.size.copy().mul(particle.scale),
                new vec4([0, 0, 1, 1]),
                true,
                particle.rotation,
                particle.color.copy().mul(this.color));
        }

        billboard_batch.end();

        var fps = engine.fps;//(1000.0 / engine.dt_render);
        fps *= 1.0;
        this.fps_text.data = "FPS: " + (fps | 0).toString();
        batch_count = 0;

        batch2d.use_shader(engine.basic_2d_shader);
        engine.basic_2d_shader.setFloat2("origin", 0, 0);
        engine.basic_2d_shader.setFloat2("resolution", engine.width, engine.height);

        batch2d.begin();
        batch2d.draw_text(this.thank_you);
        batch2d.draw_text(this.by);
        batch2d.draw_text(this.rate);
        batch2d.draw_text(this.try_again);
        batch2d.draw_text(this.noob);
        batch2d.draw_text(this.fps_text);
        batch2d.end();

        gl.enable(gl.DEPTH_TEST);
    }
}