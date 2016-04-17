class Scene {
    engine: Engine;
    name: string;

    constructor(engine: Engine, name: string) {
        this.engine = engine;
        this.name = name;
    }

    update(time: number, dt: number) { }
    render(time: number, dt: number) { }
}