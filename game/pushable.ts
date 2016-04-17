interface Pushable {
    push_factor: number;
}

class PushBlock extends GameObject implements Pushable {
    push_factor: number;
    push_me: ChatBubble

    scene: StoryScene;
    constructor(texture: Texture, scene: StoryScene) {
        super(texture);

        this.scene = scene;
        this.size = new vec3([0.8, 2.0, 4/16.0]);
        this.push_factor = 1.0;
        this.scale = 1;
        this.push_me = null;
    }

    update(world: World, dt: number): void {
        super.update(world, dt);

        var delta = this.position.copy().sub(world.player.position);
        var distance = delta.length2();

        if (distance < Math.pow(2, 2) && this.push_me == null) {
            this.push_me = new ChatBubble(world.engine, new vec2([150, 0]));
            this.push_me.text = "Push?";
            
            this.scene.add_chat_command(this.push_me, this, null);
        }
    }
}