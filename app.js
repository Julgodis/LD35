/*

    


*/
var engine;
var loading = true;
var batch2d;
var billboard_batch;
var projection_matrix;
var view_matrix;
var screen_x_offset = 0;
var scene;
// NOTE: resources
var basic_3d_shader_resource;
var billboard_3d_shader_resource;
var tilemap_texture_resource;
var player_texture_resource;
var player_texture_2_resource;
var son_texture_resource;
var enemy_texture_resources;
var itemmap_texture_resource;
var particle_texture_basic_resource;
var chat_bubble_1_texture_resource;
var chat_bubble_2_texture_resource;
var tree_texture_1_resource;
var tree_texture_2_resource;
var bush_texture_1_resource;
var sandhill_texture_1_resource;
var inventory_base_texture_resource;
var inventory_select_texture_resource;
var boss_canon_texture_resource;
var map_texture_resource;
var push_block_texture_resource;
var big_boss_texture_resources;
// 
var basic_3d_shader;
var billboard_3d_shader;
var tilemap_texture;
var player_texture;
var player_texture_2;
var son_texture;
var enemy_texture;
var itemmap_texture;
var particle_texture_basic;
var chat_bubble_1_texture;
var chat_bubble_2_texture;
var tree_texture_1;
var tree_texture_2;
var bush_texture_1;
var sandhill_texture_1;
var inventory_base_texture;
var inventory_select_texture;
var boss_canon_texture;
var map_texture;
var push_block_texture;
var big_boss_texture;
//
var music_resource;
var explosion_sound_resource;
var hurt_sound_resource;
var inspect_sound_resource;
var laser_sound_resource;
var pickup_sound_resource;
var shift_sound_resource;
var wall_hit_sound_resource;
var select_sound_resource;
//
var music;
var explosion_sound;
var hurt_sound;
var inspect_sound;
var laser_sound;
var pickup_sound;
var shift_sound;
var wall_hit_sound;
var select_sound;
window.onload = function () {
    engine = new Engine(640, 480);
    engine.do_update = update_base;
    engine.do_render = render_base;
    batch2d = new SpriteBatch(engine, 4 * 256);
    engine.run();
    basic_3d_shader_resource = Loader.ReadShaderResource(engine, "resources/basic_3d_shader");
    billboard_3d_shader_resource = Loader.ReadShaderResource(engine, "resources/billboard_3d_shader");
    tilemap_texture_resource = Loader.ReadTextureResource(engine, "resources/tilemap_texture.png", { pixelate: true });
    itemmap_texture_resource = Loader.ReadTextureResource(engine, "resources/items.png", { pixelate: true });
    player_texture_resource = Loader.ReadTextureResource(engine, "resources/player.png", { pixelate: true });
    player_texture_2_resource = Loader.ReadTextureResource(engine, "resources/player_2.png", { pixelate: true });
    son_texture_resource = Loader.ReadTextureResource(engine, "resources/son.png", { pixelate: true });
    particle_texture_basic_resource = Loader.ReadTextureResource(engine, "resources/basic_particle.png", { pixelate: true });
    chat_bubble_1_texture_resource = Loader.ReadTextureResource(engine, "resources/chat_bubble_1.png", { pixelate: true });
    chat_bubble_2_texture_resource = Loader.ReadTextureResource(engine, "resources/chat_bubble_2.png", { pixelate: true });
    tree_texture_1_resource = Loader.ReadTextureResource(engine, "resources/tree_1.png", { pixelate: true });
    tree_texture_2_resource = Loader.ReadTextureResource(engine, "resources/tree_2.png", { pixelate: true });
    bush_texture_1_resource = Loader.ReadTextureResource(engine, "resources/bushes_1.png", { pixelate: true });
    sandhill_texture_1_resource = Loader.ReadTextureResource(engine, "resources/sand_hill.png", { pixelate: true });
    inventory_base_texture_resource = Loader.ReadTextureResource(engine, "resources/inventory_bar.png", { pixelate: true });
    inventory_select_texture_resource = Loader.ReadTextureResource(engine, "resources/inventory_selected.png", { pixelate: true });
    boss_canon_texture_resource = Loader.ReadTextureResource(engine, "resources/boss_canon_bullet.png", { pixelate: true });
    map_texture_resource = Loader.ReadTextureResource(engine, "resources/map_1.bmp", { pixelate: true });
    push_block_texture_resource = Loader.ReadTextureResource(engine, "resources/push_block.png", { pixelate: true });
    enemy_texture_resources = [];
    enemy_texture_resources[0] = Loader.ReadTextureResource(engine, "resources/enemy_1.png", { pixelate: true });
    enemy_texture_resources[1] = Loader.ReadTextureResource(engine, "resources/enemy_2.png", { pixelate: true });
    enemy_texture_resources[2] = Loader.ReadTextureResource(engine, "resources/enemy_3.png", { pixelate: true });
    big_boss_texture_resources = [];
    big_boss_texture_resources[0] = Loader.ReadTextureResource(engine, "resources/big_boss_state_1.png", { pixelate: true });
    big_boss_texture_resources[1] = Loader.ReadTextureResource(engine, "resources/big_boss_state_2.png", { pixelate: true });
    big_boss_texture_resources[2] = Loader.ReadTextureResource(engine, "resources/big_boss_state_3.png", { pixelate: true });
    music_resource = Loader.ReadMusicResource("resources/music.ogg", { loop: true });
    explosion_sound_resource = Loader.ReadSoundResource("resources/explosion.ogg", 5);
    hurt_sound_resource = Loader.ReadSoundResource("resources/hurt.ogg", 15);
    inspect_sound_resource = Loader.ReadSoundResource("resources/inspect.ogg", 2);
    laser_sound_resource = Loader.ReadSoundResource("resources/laser.ogg", 30);
    pickup_sound_resource = Loader.ReadSoundResource("resources/pickup.ogg", 10);
    shift_sound_resource = Loader.ReadSoundResource("resources/shift.ogg", 4);
    wall_hit_sound_resource = Loader.ReadSoundResource("resources/wall_hit.ogg", 30);
    select_sound_resource = Loader.ReadSoundResource("resources/select.ogg", 10);
    Loader.ReadFileResource("http://julgodis.github.io/LD35/resources/pixel_font.TTF"); // NOTE: Depend on the font
    var wait_for_resources = setInterval(function () {
        if (Loader.Loaded) {
            clearInterval(wait_for_resources);
            loaded();
        }
    }, 100);
};
function loaded() {
    basic_3d_shader = basic_3d_shader_resource.shader;
    billboard_3d_shader = billboard_3d_shader_resource.shader;
    tilemap_texture = tilemap_texture_resource.texture;
    itemmap_texture = itemmap_texture_resource.texture;
    player_texture = player_texture_resource.texture;
    player_texture_2 = player_texture_2_resource.texture;
    son_texture = son_texture_resource.texture;
    particle_texture_basic = particle_texture_basic_resource.texture;
    chat_bubble_1_texture = chat_bubble_1_texture_resource.texture;
    chat_bubble_2_texture = chat_bubble_2_texture_resource.texture;
    tree_texture_1 = tree_texture_1_resource.texture;
    tree_texture_2 = tree_texture_2_resource.texture;
    bush_texture_1 = bush_texture_1_resource.texture;
    sandhill_texture_1 = sandhill_texture_1_resource.texture;
    inventory_base_texture = inventory_base_texture_resource.texture;
    inventory_select_texture = inventory_select_texture_resource.texture;
    boss_canon_texture = boss_canon_texture_resource.texture;
    map_texture = map_texture_resource.texture;
    push_block_texture = push_block_texture_resource.texture;
    enemy_texture = [];
    for (var i in enemy_texture_resources) {
        enemy_texture[i] = enemy_texture_resources[i].texture;
    }
    big_boss_texture = [];
    for (var i in big_boss_texture_resources) {
        big_boss_texture[i] = big_boss_texture_resources[i].texture;
    }
    music = music_resource.music;
    explosion_sound = explosion_sound_resource.sound;
    hurt_sound = hurt_sound_resource.sound;
    inspect_sound = inspect_sound_resource.sound;
    laser_sound = laser_sound_resource.sound;
    pickup_sound = pickup_sound_resource.sound;
    shift_sound = shift_sound_resource.sound;
    wall_hit_sound = wall_hit_sound_resource.sound;
    select_sound = select_sound_resource.sound;
    music.play();
    music.volume = 0.2;
    select_sound.volume = 0.1;
    wall_hit_sound.volume = 0.1;
    inspect_sound.volume = 0.1;
    hurt_sound.volume = 0.1;
    laser_sound.volume = 0.1;
    pickup_sound.volume = 0.1;
    shift_sound.volume = 0.05;
    billboard_batch = new BillboardBatch(engine, 4 * 1024);
    scene = new IntroScene(engine);
    loading = false;
}
function update_base(dt) {
    if (loading)
        return;
    scene.update(engine.time, dt);
    _global_tweener.update(engine.time, dt);
}
function render_base(dt, update_between) {
    if (loading)
        return;
    scene.render(engine.time, engine.dt / 1000.0);
}
function OpenInNewTabWinBrowser(url) {
    var win = window.open(url, '_blank');
    win.focus();
}
function open_rate() {
    window.location.href = ("http://ludumdare.com/compo/ludum-dare-35/?action=preview&uid=16119");
}
//# sourceMappingURL=app.js.map