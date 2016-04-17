interface AnimationComplete {
    animation_complete(name: string): void;
}

class Animation {
    name: string;
    frame_sequence: number[];
    frame_time: number[];

    current_frame: number;
    next_frame_time: number;

    repeat: boolean;
    repeat_count: number;
    repeat_max: number;
    random_frame_time: number;

    complete_interface: AnimationComplete;
    complete: boolean;

    constructor() {
        this.repeat_max = 0;
        this.random_frame_time = 0;
        this.reset();

        this.complete = false;
        this.complete_interface = null;
    }

    update(time: number, delta: number) {
        var rft = this.random_frame_time * 1 * Math.random();
        if (this.current_frame == -1) {
            this.current_frame = 0;
            this.next_frame_time = time + this.frame_time[this.current_frame] + rft;
        }

        if (time > this.next_frame_time) {
            this.current_frame++;
            if (this.current_frame >= this.frame_sequence.length) {
                if (this.repeat) {
                    if (this.repeat_count + 1 < this.repeat_max || this.repeat_max == 0) {
                        this.current_frame = 0;
                        this.repeat_count++;
                        this.next_frame_time = time + this.frame_time[this.current_frame] + rft;
                        return;
                    } 
                }

                if (this.complete_interface != null && !this.complete) {
                    this.complete_interface.animation_complete(this.name);
                    this.complete = true;
                }
            } else if (this.current_frame >= this.frame_sequence.length)
                this.current_frame--;
            else {
                this.next_frame_time = time + this.frame_time[this.current_frame] + rft;
            }
        }
    }

    reset() {
        this.current_frame = -1;
        this.next_frame_time = 0;
        this.repeat_count = 0;
        this.complete = false;
    }

    get_current_frame() {
        if (this.current_frame < 0)
            return null;
        return this.frame_sequence[this.current_frame];
    }

    static fsequence(a: number, b: number): number[] {
        var r: number[] = [];
        for (var i = a; i < (a + b); i++)
            r.push(i);

        return r;
    }

    static ft_repate(n: number, t: number): number[] {
        var r: number[] = [];
        for (var i = 0; i < n; i++)
            r.push(t);

        return r;
    }

    static FrameTime: number = 1.0 / 30.0;
}

class AnimationManager {
    spritesheet: Texture; 

    coords: vec4;

    width_per_frame: number;
    height_per_frame: number;

    animations: { [id: string]: Animation };
    current_animation: string;

    animate: boolean = true;

    complete_interface: AnimationComplete;

    constructor(spritesheet: Texture, width_per_frame: number, height_per_frame: number) {
        this.animations = {};
        this.current_animation = null;
        this.spritesheet = spritesheet;
        this.width_per_frame = width_per_frame;
        this.height_per_frame = height_per_frame;
        this.coords = new vec4([0, 0, 0, 0]);
        this.complete_interface = null;
    }

    update(time: number, delta: number) {
        var animation = this.animations[this.current_animation];
        if (animation == null) return;

        if (this.animate)
            animation.update(time, delta);

        var frame = animation.get_current_frame();
        if (frame == null) return;

        var m = 1.0 / 500.0;
        var fdx = this.width_per_frame / this.spritesheet.size.x;
        var fdy = this.height_per_frame / this.spritesheet.size.y;
        var frame_x = frame % ((1.0 / fdx) | 0);
        var frame_y = (frame * fdx) | 0;
        this.coords = new vec4([
            (frame_x + 0) * fdx + m,
            (frame_y + 0) * fdy + m,
            (frame_x + 1) * fdx - m,
            (frame_y + 1) * fdy - m]);
    }

    play(name: string): Animation {
        if (this.animations[name] == null)
            return null;

        if (this.animations[this.current_animation] != null) {
            this.animations[this.current_animation].complete_interface = null;
            this.animations[this.current_animation].reset();
        }

        var animation = this.animations[name];
        animation.complete_interface = this.complete_interface;
        this.current_animation = name;
        return animation;
    }

    play_ifn(name: string): Animation {
        if (this.current_animation == name)
            return this.animations[this.current_animation];

        return this.play(name);
    }

    add_animation(name: string, frame_sequence: number[], frame_time: number[], repeat: boolean = false): Animation {
        var animation = new Animation();
        animation.name = name;
        animation.frame_sequence = frame_sequence;
        animation.frame_time = frame_time;
        animation.repeat = repeat;
        this.animations[name] = animation;

        return animation;
    }
}